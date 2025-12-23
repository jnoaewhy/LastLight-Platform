// Last Light Security & Authentication System
// Role-based access control, staff authentication, and security monitoring

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

class SecurityManager {
  constructor(sessionManager, auditLogger, config = {}) {
    this.sessions = sessionManager;
    this.audit = auditLogger;
    
    this.config = {
      // JWT Configuration
      jwt: {
        secret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
        access_token_expiry: '15m',
        refresh_token_expiry: '7d',
        issuer: 'lastlight-venue',
        algorithm: 'HS256'
      },
      
      // Password Policy
      password: {
        min_length: 12,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: true,
        max_attempts: 5,
        lockout_duration: 30 * 60 * 1000, // 30 minutes
        history_count: 5 // Can't reuse last 5 passwords
      },
      
      // 2FA Configuration
      twofa: {
        issuer: 'Last Light Venue',
        window: 2, // Allow 2 time steps tolerance
        required_for_admin: true,
        required_for_emergency: true,
        backup_codes_count: 10
      },
      
      // Session Security
      session: {
        max_concurrent: 3,
        idle_timeout: 30 * 60 * 1000, // 30 minutes
        absolute_timeout: 8 * 60 * 60 * 1000, // 8 hours max
        device_trust_duration: 30 * 24 * 60 * 60 * 1000 // 30 days
      },
      
      // Rate Limiting
      rate_limits: {
        login_attempts: { window: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 min
        password_reset: { window: 60 * 60 * 1000, max: 3 }, // 3 resets per hour
        emergency_actions: { window: 60 * 1000, max: 10 }, // 10 emergency actions per minute
        api_calls: { window: 60 * 1000, max: 1000 } // 1000 API calls per minute
      },
      
      ...config
    };

    // Permission hierarchy and roles
    this.roles = {
      'super_admin': {
        level: 100,
        permissions: ['*'], // All permissions
        description: 'Full system access'
      },
      'venue_manager': {
        level: 80,
        permissions: [
          'view_all_sessions', 'override_sessions', 'emergency_unlock',
          'view_analytics', 'manage_staff', 'financial_reports',
          'system_settings', 'audit_logs'
        ],
        description: 'Venue operations management'
      },
      'floor_manager': {
        level: 60,
        permissions: [
          'view_sessions', 'override_sessions', 'emergency_unlock',
          'resolve_payments', 'hardware_controls', 'customer_support'
        ],
        description: 'Floor operations and customer service'
      },
      'security_staff': {
        level: 50,
        permissions: [
          'view_sessions', 'emergency_unlock', 'lockdown_mode',
          'incident_reports', 'camera_access'
        ],
        description: 'Security and safety enforcement'
      },
      'bartender': {
        level: 30,
        permissions: [
          'view_customer_perks', 'process_payments', 'customer_lookup'
        ],
        description: 'Customer service and payment processing'
      },
      'support_staff': {
        level: 20,
        permissions: [
          'customer_lookup', 'basic_support', 'physical_recovery'
        ],
        description: 'Customer support and recovery assistance'
      },
      'readonly': {
        level: 10,
        permissions: [
          'view_dashboard', 'view_analytics'
        ],
        description: 'Dashboard viewing only'
      }
    };

    // Security state tracking
    this.activeUsers = new Map(); // user_id -> session info
    this.loginAttempts = new Map(); // ip/user -> attempt tracking
    this.trustedDevices = new Map(); // device_fingerprint -> trust info
    this.emergencyMode = false;
    this.securityIncidents = [];

    this.initializeSecurity();
  }

  async initializeSecurity() {
    console.log('🔐 Initializing security system...');
    
    // Create default admin user if none exists
    await this.createDefaultAdmin();
    
    // Initialize rate limiters
    this.setupRateLimiters();
    
    // Start security monitoring
    this.startSecurityMonitoring();
    
    console.log('✅ Security system initialized');
  }

  // User Management
  async createUser(userData, createdBy) {
    try {
      const { 
        username, 
        email, 
        password, 
        role, 
        first_name, 
        last_name,
        employee_id,
        department 
      } = userData;

      // Validate permissions
      await this.requirePermission(createdBy, 'manage_staff');

      // Validate role assignment
      if (!this.canAssignRole(createdBy, role)) {
        throw new Error('Insufficient privileges to assign this role');
      }

      // Validate password strength
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.valid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // Check if user exists
      const existingUser = await this.getUserByUsername(username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(password, salt);

      // Generate user ID and security data
      const user_id = crypto.randomUUID();
      const security_data = {
        password_history: [password_hash],
        created_at: new Date(),
        created_by: createdBy.user_id,
        login_attempts: 0,
        locked_until: null,
        last_password_change: new Date(),
        force_password_change: true,
        twofa_enabled: false,
        twofa_secret: null,
        backup_codes: [],
        trusted_devices: [],
        last_login: null,
        failed_logins: 0
      };

      const newUser = {
        user_id,
        username,
        email,
        password_hash,
        role,
        first_name,
        last_name,
        employee_id,
        department,
        active: true,
        security_data,
        created_at: new Date(),
        created_by: createdBy.user_id
      };

      // Store user (would be in database)
      await this.storeUser(newUser);

      // Audit log
      await this.audit.log('user_created', {
        created_user_id: user_id,
        username,
        role,
        created_by: createdBy.user_id
      });

      console.log(`👤 User created: ${username} (${role})`);

      return {
        success: true,
        user_id,
        username,
        role,
        force_password_change: true
      };

    } catch (error) {
      console.error('User creation failed:', error);
      throw error;
    }
  }

  async authenticateUser(credentials, deviceInfo = {}) {
    try {
      const { username, password, totp_code, device_fingerprint } = credentials;
      const { ip_address, user_agent } = deviceInfo;

      // Rate limiting check
      if (await this.isRateLimited('login', ip_address)) {
        throw new Error('Too many login attempts. Try again later.');
      }

      // Get user
      const user = await this.getUserByUsername(username);
      if (!user) {
        await this.recordFailedLogin(username, ip_address, 'invalid_username');
        throw new Error('Invalid credentials');
      }

      // Check if account is locked
      if (user.security_data.locked_until && new Date() < user.security_data.locked_until) {
        throw new Error('Account is temporarily locked');
      }

      // Check if account is active
      if (!user.active) {
        await this.audit.log('login_attempt_inactive_account', {
          username,
          ip_address,
          user_agent
        });
        throw new Error('Account is deactivated');
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.password_hash);
      if (!passwordValid) {
        await this.recordFailedLogin(username, ip_address, 'invalid_password');
        throw new Error('Invalid credentials');
      }

      // Check 2FA if enabled
      if (user.security_data.twofa_enabled) {
        if (!totp_code) {
          throw new Error('2FA code required');
        }

        const twoFactorValid = speakeasy.totp.verify({
          secret: user.security_data.twofa_secret,
          encoding: 'base32',
          token: totp_code,
          window: this.config.twofa.window
        });

        if (!twoFactorValid) {
          await this.recordFailedLogin(username, ip_address, 'invalid_2fa');
          throw new Error('Invalid 2FA code');
        }
      }

      // Check device trust
      const deviceTrusted = this.isDeviceTrusted(user.user_id, device_fingerprint);
      
      // Successful authentication
      await this.recordSuccessfulLogin(user, deviceInfo);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Create session
      const session = await this.createUserSession(user, deviceInfo, tokens);

      console.log(`✅ User authenticated: ${username} (${user.role})`);

      return {
        success: true,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          permissions: this.roles[user.role].permissions
        },
        tokens,
        session_id: session.session_id,
        device_trusted: deviceTrusted,
        requires_password_change: user.security_data.force_password_change
      };

    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  async generateTokens(user) {
    const payload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      permissions: this.roles[user.role].permissions
    };

    const accessToken = jwt.sign(payload, this.config.jwt.secret, {
      expiresIn: this.config.jwt.access_token_expiry,
      issuer: this.config.jwt.issuer,
      algorithm: this.config.jwt.algorithm
    });

    const refreshToken = jwt.sign(
      { user_id: user.user_id, type: 'refresh' },
      this.config.jwt.secret,
      {
        expiresIn: this.config.jwt.refresh_token_expiry,
        issuer: this.config.jwt.issuer,
        algorithm: this.config.jwt.algorithm
      }
    );

    return { accessToken, refreshToken };
  }

  async createUserSession(user, deviceInfo, tokens) {
    const session = {
      session_id: crypto.randomUUID(),
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      device_fingerprint: deviceInfo.device_fingerprint,
      ip_address: deviceInfo.ip_address,
      user_agent: deviceInfo.user_agent,
      created_at: new Date(),
      last_activity: new Date(),
      expires_at: new Date(Date.now() + this.config.session.absolute_timeout)
    };

    // Store session
    this.activeUsers.set(user.user_id, session);

    // Clean up old sessions if user has too many
    await this.enforceSessionLimits(user.user_id);

    return session;
  }

  // Authorization Middleware
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.config.jwt.secret, {
        issuer: this.config.jwt.issuer,
        algorithms: [this.config.jwt.algorithm]
      });

      // Check if user session is still active
      const session = this.activeUsers.get(decoded.user_id);
      if (!session) {
        throw new Error('Session not found');
      }

      // Check session expiry
      if (new Date() > session.expires_at) {
        await this.invalidateSession(decoded.user_id);
        throw new Error('Session expired');
      }

      // Update last activity
      session.last_activity = new Date();

      return decoded;

    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async requirePermission(user, permission) {
    if (!user || !user.permissions) {
      throw new Error('User not authenticated');
    }

    // Super admin has all permissions
    if (user.permissions.includes('*')) {
      return true;
    }

    // Check specific permission
    if (!user.permissions.includes(permission)) {
      await this.audit.log('permission_denied', {
        user_id: user.user_id,
        username: user.username,
        required_permission: permission,
        user_permissions: user.permissions
      });
      
      throw new Error(`Permission denied: ${permission}`);
    }

    return true;
  }

  async requireRole(user, minRole) {
    const userRole = user.role;
    const userLevel = this.roles[userRole]?.level || 0;
    const minLevel = this.roles[minRole]?.level || 0;

    if (userLevel < minLevel) {
      await this.audit.log('insufficient_role', {
        user_id: user.user_id,
        username: user.username,
        required_role: minRole,
        user_role: userRole
      });
      
      throw new Error(`Insufficient role. Required: ${minRole}, User: ${userRole}`);
    }

    return true;
  }

  // 2FA Management
  async enable2FA(userId, requestingUser) {
    await this.requirePermission(requestingUser, 'manage_2fa');

    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `${user.username}@${this.config.twofa.issuer}`,
      issuer: this.config.twofa.issuer
    });

    // Generate backup codes
    const backupCodes = this.generate2FABackupCodes();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Store temporarily (user must verify before enabling)
    user.security_data.twofa_setup = {
      secret: secret.base32,
      backup_codes: backupCodes.map(code => bcrypt.hashSync(code, 10)),
      setup_at: new Date()
    };

    await this.updateUser(user);

    await this.audit.log('2fa_setup_initiated', {
      user_id: userId,
      setup_by: requestingUser.user_id
    });

    return {
      success: true,
      secret: secret.base32,
      qr_code: qrCode,
      backup_codes: backupCodes
    };
  }

  async verify2FASetup(userId, totpCode, requestingUser) {
    const user = await this.getUserById(userId);
    if (!user || !user.security_data.twofa_setup) {
      throw new Error('2FA setup not initiated');
    }

    const verified = speakeasy.totp.verify({
      secret: user.security_data.twofa_setup.secret,
      encoding: 'base32',
      token: totpCode,
      window: this.config.twofa.window
    });

    if (!verified) {
      throw new Error('Invalid 2FA code');
    }

    // Enable 2FA
    user.security_data.twofa_enabled = true;
    user.security_data.twofa_secret = user.security_data.twofa_setup.secret;
    user.security_data.backup_codes = user.security_data.twofa_setup.backup_codes;
    user.security_data.twofa_enabled_at = new Date();
    
    // Remove setup data
    delete user.security_data.twofa_setup;

    await this.updateUser(user);

    await this.audit.log('2fa_enabled', {
      user_id: userId,
      enabled_by: requestingUser.user_id
    });

    return { success: true };
  }

  generate2FABackupCodes() {
    const codes = [];
    for (let i = 0; i < this.config.twofa.backup_codes_count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  // Password Management
  validatePassword(password) {
    const errors = [];
    const config = this.config.password;

    if (password.length < config.min_length) {
      errors.push(`Password must be at least ${config.min_length} characters`);
    }

    if (config.require_uppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letters');
    }

    if (config.require_lowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letters');
    }

    if (config.require_numbers && !/\d/.test(password)) {
      errors.push('Password must contain numbers');
    }

    if (config.require_symbols && !/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain special characters');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password123', 'admin123', 'welcome123', 'lastlight123',
      '123456789', 'qwerty123', 'password1'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async changePassword(userId, oldPassword, newPassword, requestingUser) {
    // Users can change their own password, or managers can reset others
    if (userId !== requestingUser.user_id) {
      await this.requirePermission(requestingUser, 'manage_staff');
    }

    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password (unless manager override)
    if (userId === requestingUser.user_id) {
      const oldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!oldPasswordValid) {
        throw new Error('Current password is incorrect');
      }
    }

    // Validate new password
    const validation = this.validatePassword(newPassword);
    if (!validation.valid) {
      throw new Error(`Password validation failed: ${validation.errors.join(', ')}`);
    }

    // Check password history
    const isPasswordReused = await this.checkPasswordHistory(user, newPassword);
    if (isPasswordReused) {
      throw new Error('Cannot reuse recent passwords');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password and history
    user.password_hash = password_hash;
    user.security_data.password_history.push(password_hash);
    
    // Keep only last N passwords
    if (user.security_data.password_history.length > this.config.password.history_count) {
      user.security_data.password_history.shift();
    }
    
    user.security_data.last_password_change = new Date();
    user.security_data.force_password_change = false;

    await this.updateUser(user);

    // Invalidate all user sessions (force re-login)
    await this.invalidateUserSessions(userId);

    await this.audit.log('password_changed', {
      user_id: userId,
      changed_by: requestingUser.user_id,
      self_change: userId === requestingUser.user_id
    });

    return { success: true };
  }

  async checkPasswordHistory(user, newPassword) {
    for (const historicalHash of user.security_data.password_history) {
      if (await bcrypt.compare(newPassword, historicalHash)) {
        return true;
      }
    }
    return false;
  }

  // Emergency Access Control
  async enableEmergencyMode(user, reason) {
    await this.requirePermission(user, 'emergency_unlock');

    this.emergencyMode = true;

    const incident = {
      incident_id: crypto.randomUUID(),
      type: 'emergency_mode_enabled',
      enabled_by: user.user_id,
      username: user.username,
      reason,
      timestamp: new Date(),
      auto_disable_at: new Date(Date.now() + (2 * 60 * 60 * 1000)) // 2 hours
    };

    this.securityIncidents.push(incident);

    await this.audit.log('emergency_mode_enabled', {
      incident_id: incident.incident_id,
      enabled_by: user.user_id,
      reason
    });

    // Schedule automatic disable
    setTimeout(() => {
      this.disableEmergencyMode('auto_timeout');
    }, 2 * 60 * 60 * 1000);

    console.log(`🚨 Emergency mode enabled by ${user.username}: ${reason}`);

    return { success: true, incident_id: incident.incident_id };
  }

  async disableEmergencyMode(disabledBy, reason = 'Manual disable') {
    if (!this.emergencyMode) {
      return { success: false, error: 'Emergency mode not active' };
    }

    this.emergencyMode = false;

    await this.audit.log('emergency_mode_disabled', {
      disabled_by: disabledBy,
      reason
    });

    console.log(`✅ Emergency mode disabled: ${reason}`);

    return { success: true };
  }

  // Security Monitoring
  startSecurityMonitoring() {
    // Monitor for suspicious patterns
    setInterval(() => {
      this.detectSuspiciousActivity();
      this.cleanupExpiredSessions();
      this.monitorFailedLogins();
    }, 60000); // Every minute

    console.log('🕵️ Security monitoring started');
  }

  detectSuspiciousActivity() {
    // Multiple failed logins from same IP
    for (const [key, attempts] of this.loginAttempts.entries()) {
      if (attempts.count > 10 && Date.now() - attempts.last_attempt < 60000) {
        this.createSecurityIncident('suspicious_login_pattern', {
          key,
          attempt_count: attempts.count,
          time_window: '1 minute'
        });
      }
    }

    // Multiple concurrent sessions from different locations
    for (const [userId, session] of this.activeUsers.entries()) {
      // This would check for geographic impossibilities
      // e.g., login from NYC and London within 1 hour
    }
  }

  async recordFailedLogin(username, ipAddress, reason) {
    const key = `${username}:${ipAddress}`;
    const attempts = this.loginAttempts.get(key) || { count: 0, first_attempt: Date.now() };
    
    attempts.count++;
    attempts.last_attempt = Date.now();
    
    this.loginAttempts.set(key, attempts);

    await this.audit.log('login_failed', {
      username,
      ip_address: ipAddress,
      reason,
      attempt_count: attempts.count
    });

    // Lock account after too many failures
    if (attempts.count >= this.config.password.max_attempts) {
      await this.lockUserAccount(username, this.config.password.lockout_duration);
    }
  }

  async recordSuccessfulLogin(user, deviceInfo) {
    // Clear failed attempts
    const key = `${user.username}:${deviceInfo.ip_address}`;
    this.loginAttempts.delete(key);

    // Update user login info
    user.security_data.last_login = new Date();
    user.security_data.failed_logins = 0;
    user.security_data.locked_until = null;

    await this.updateUser(user);

    await this.audit.log('login_successful', {
      user_id: user.user_id,
      username: user.username,
      ip_address: deviceInfo.ip_address,
      user_agent: deviceInfo.user_agent,
      device_fingerprint: deviceInfo.device_fingerprint
    });
  }

  // Rate Limiting
  setupRateLimiters() {
    this.loginLimiter = rateLimit({
      windowMs: this.config.rate_limits.login_attempts.window,
      max: this.config.rate_limits.login_attempts.max,
      message: 'Too many login attempts',
      standardHeaders: true,
      legacyHeaders: false
    });

    this.emergencyLimiter = rateLimit({
      windowMs: this.config.rate_limits.emergency_actions.window,
      max: this.config.rate_limits.emergency_actions.max,
      message: 'Emergency action rate limit exceeded'
    });
  }

  async isRateLimited(action, identifier) {
    // Implementation would check rate limits for specific actions
    return false; // Simplified for demo
  }

  // Utility Methods
  canAssignRole(assigner, targetRole) {
    const assignerLevel = this.roles[assigner.role]?.level || 0;
    const targetLevel = this.roles[targetRole]?.level || 0;
    
    // Can only assign roles at or below your level
    return assignerLevel >= targetLevel;
  }

  isDeviceTrusted(userId, deviceFingerprint) {
    const userTrustedDevices = this.trustedDevices.get(userId) || [];
    return userTrustedDevices.some(device => 
      device.fingerprint === deviceFingerprint && 
      device.expires_at > new Date()
    );
  }

  async createSecurityIncident(type, details) {
    const incident = {
      incident_id: crypto.randomUUID(),
      type,
      details,
      timestamp: new Date(),
      status: 'open'
    };

    this.securityIncidents.push(incident);

    await this.audit.log('security_incident', {
      incident_id: incident.incident_id,
      type,
      details
    });

    console.warn(`🔒 Security incident: ${type}`, details);
  }

  async createDefaultAdmin() {
    // Create default admin if no users exist
    const existingUsers = await this.getUserCount();
    if (existingUsers === 0) {
      const adminPassword = crypto.randomBytes(12).toString('base64');
      
      const adminUser = {
        username: 'admin',
        email: 'admin@venue.local',
        password: adminPassword,
        role: 'super_admin',
        first_name: 'System',
        last_name: 'Administrator',
        employee_id: 'ADMIN-001',
        department: 'IT'
      };

      const systemUser = { user_id: 'system', role: 'super_admin' };
      await this.createUser(adminUser, systemUser);

      console.log(`🔑 Default admin created: username=admin, password=${adminPassword}`);
      console.log('🚨 CHANGE DEFAULT ADMIN PASSWORD IMMEDIATELY!');
    }
  }

  // Express Middleware
  authenticate() {
    return async (req, res, next) => {
      try {
        const authHeader = req.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            error: 'Authentication token required'
          });
        }

        const token = authHeader.substring(7);
        const user = await this.verifyToken(token);
        
        req.user = user;
        next();
        
      } catch (error) {
        res.status(401).json({
          success: false,
          error: error.message
        });
      }
    };
  }

  requirePermissions(...permissions) {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            error: 'Authentication required'
          });
        }

        for (const permission of permissions) {
          await this.requirePermission(req.user, permission);
        }

        next();
        
      } catch (error) {
        res.status(403).json({
          success: false,
          error: error.message
        });
      }
    };
  }

  // Public API Methods
  getSecurityStatus() {
    return {
      emergency_mode: this.emergencyMode,
      active_users: this.activeUsers.size,
      failed_login_attempts: this.loginAttempts.size,
      recent_incidents: this.securityIncidents.slice(-10),
      system_uptime: process.uptime()
    };
  }

  // Database abstraction methods (would be implemented with actual DB)
  async storeUser(user) {
    // Store user in database
    console.log('💾 User stored:', user.username);
  }

  async getUserByUsername(username) {
    // Mock implementation
    return null;
  }

  async getUserById(userId) {
    // Mock implementation  
    return null;
  }

  async updateUser(user) {
    // Update user in database
    console.log('💾 User updated:', user.username);
  }

  async getUserCount() {
    // Return count of users in database
    return 0;
  }

  async lockUserAccount(username, duration) {
    console.log(`🔒 Account locked: ${username} for ${duration}ms`);
  }

  async invalidateSession(userId) {
    this.activeUsers.delete(userId);
  }

  async invalidateUserSessions(userId) {
    this.activeUsers.delete(userId);
  }

  async enforceSessionLimits(userId) {
    // Implementation would limit concurrent sessions
  }

  cleanupExpiredSessions() {
    for (const [userId, session] of this.activeUsers.entries()) {
      if (new Date() > session.expires_at) {
        this.activeUsers.delete(userId);
      }
    }
  }

  monitorFailedLogins() {
    // Clean up old failed login attempts
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    for (const [key, attempts] of this.loginAttempts.entries()) {
      if (attempts.first_attempt < cutoff) {
        this.loginAttempts.delete(key);
      }
    }
  }
}

module.exports = { SecurityManager };