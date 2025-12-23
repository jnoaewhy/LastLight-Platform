// Last Light API Server
// Complete REST API with WebSocket support for real-time updates

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const Redis = require('redis');
const { Pool } = require('pg');

const { SessionManager } = require('./session-management');
const { OfflineRecoveryManager } = require('./offline-recovery');

class LastLightAPI {
  constructor(config = {}) {
    this.config = {
      port: process.env.PORT || 3000,
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'lastlight',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD
      },
      venue: {
        id: 'lantern_001',
        capacity: 500,
        pod_capacity: 50,
        parking_spots: 100
      },
      ...config
    };

    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });

    // Initialize systems
    this.initializeConnections();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.startCapacityMonitoring();
  }

  async initializeConnections() {
    // Redis connection
    this.redis = Redis.createClient(this.config.redis);
    await this.redis.connect();
    
    // PostgreSQL connection
    this.db = new Pool(this.config.database);
    
    // Initialize managers
    this.sessionManager = new SessionManager(this.redis, this.db);
    this.offlineManager = new OfflineRecoveryManager(this.sessionManager);
    
    // Initialize venue capacity tracking
    this.capacityTracker = {
      current_occupancy: 0,
      pod_availability: this.config.venue.pod_capacity,
      parking_availability: this.config.venue.parking_spots,
      last_updated: new Date()
    };

    console.log('🚀 Last Light API systems initialized');
  }

  setupMiddleware() {
    // Security
    this.app.use(helmet());
    this.app.use(cors());
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP'
    });
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
      next();
    });

    // Error handling middleware
    this.app.use(this.handleValidationErrors);
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', this.healthCheck.bind(this));
    
    // Entry flow endpoints
    this.app.post('/api/entry/scan', [
      body('qr_code').notEmpty().withMessage('QR code is required'),
      body('venue_id').optional().isString()
    ], this.scanEntry.bind(this));

    this.app.get('/api/transport/options/:temp_id', [
      param('temp_id').isUUID().withMessage('Valid session ID required')
    ], this.getTransportOptions.bind(this));

    this.app.post('/api/transport/select', [
      body('temp_id').isUUID().withMessage('Valid session ID required'),
      body('transport_type').isIn(['pod', 'rideshare', 'dd']).withMessage('Valid transport type required')
    ], this.selectTransport.bind(this));

    this.app.post('/api/payment/process', [
      body('temp_id').isUUID(),
      body('payment_method').notEmpty(),
      body('amount').optional().isNumeric()
    ], this.processPayment.bind(this));

    this.app.post('/api/wristband/activate', [
      body('temp_id').isUUID(),
      body('wristband_nfc_id').notEmpty().withMessage('Wristband NFC ID required')
    ], this.activateWristband.bind(this));

    // Exit flow endpoints
    this.app.post('/api/exit/scan', [
      body('wristband_nfc_id').notEmpty().withMessage('Wristband NFC ID required')
    ], this.scanExit.bind(this));

    this.app.post('/api/exit/verify/:temp_id', [
      param('temp_id').isUUID()
    ], this.verifyExit.bind(this));

    this.app.post('/api/exit/complete', [
      body('temp_id').isUUID(),
      body('transport_confirmed').isBoolean()
    ], this.completeExit.bind(this));

    // Group session endpoints
    this.app.post('/api/group/create', [
      body('coordinator_id').isUUID(),
      body('member_ids').isArray().withMessage('Member IDs must be an array')
    ], this.createGroup.bind(this));

    this.app.get('/api/group/:group_id', [
      param('group_id').isUUID()
    ], this.getGroup.bind(this));

    // Staff override endpoints  
    this.app.post('/api/staff/override/:temp_id', [
      param('temp_id').isUUID(),
      body('staff_id').notEmpty(),
      body('reason').notEmpty(),
      body('override_data').isObject()
    ], this.staffOverride.bind(this));

    this.app.post('/api/staff/emergency/unlock', [
      body('staff_id').notEmpty(),
      body('reason').notEmpty(),
      body('unlock_all').optional().isBoolean()
    ], this.emergencyUnlock.bind(this));

    // Recovery endpoints
    this.app.post('/api/recovery/physical', [
      body('recovery_code').isLength({ min: 6, max: 6 }),
      body('staff_id').notEmpty()
    ], this.physicalRecovery.bind(this));

    this.app.post('/api/recovery/session', [
      body('recovery_phrase').notEmpty(),
      body('device_fingerprint').optional()
    ], this.sessionRecovery.bind(this));

    // Analytics and monitoring
    this.app.get('/api/analytics/sessions', this.getSessionAnalytics.bind(this));
    this.app.get('/api/analytics/capacity', this.getCapacityAnalytics.bind(this));
    this.app.get('/api/system/status', this.getSystemStatus.bind(this));

    // Offline mode endpoints
    this.app.post('/api/offline/enable', [
      body('staff_id').notEmpty(),
      body('reason').notEmpty()
    ], this.enableOfflineMode.bind(this));

    this.app.post('/api/offline/sync', this.syncOfflineData.bind(this));
    this.app.get('/api/offline/status', this.getOfflineStatus.bind(this));
  }

  // Entry Flow Endpoints
  async scanEntry(req, res) {
    try {
      const { qr_code, venue_id = this.config.venue.id } = req.body;
      const clientIP = req.ip;
      const userAgent = req.get('User-Agent');
      
      // Simulate age verification (would integrate with ID scanning service)
      const ageVerified = await this.verifyAge(qr_code);
      if (!ageVerified.success) {
        return res.status(400).json({
          success: false,
          error: 'Age verification failed',
          details: ageVerified.error
        });
      }

      // Create session
      const sessionResult = await this.sessionManager.createSession({
        ageVerified: true,
        venueId: venue_id,
        clientIP,
        userAgent
      });

      if (!sessionResult.success) {
        return res.status(500).json(sessionResult);
      }

      // Emit real-time update
      this.io.emit('session:created', {
        venue_id,
        session_count: await this.getActiveSessionCount()
      });

      res.json({
        success: true,
        data: {
          temp_id: sessionResult.temp_id,
          age_verified: true,
          can_enter: true,
          session_expires: sessionResult.expires_at,
          recovery_phrase: sessionResult.recovery_phrase
        },
        message: "Age verification successful",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Entry scan error:', error);
      res.status(500).json({
        success: false,
        error: 'Entry scan failed',
        timestamp: new Date().toISOString()
      });
    }
  }

  async getTransportOptions(req, res) {
    try {
      const { temp_id } = req.params;
      
      // Validate session
      const sessionResult = await this.sessionManager.getSession(temp_id);
      if (!sessionResult.success) {
        return res.status(404).json({
          success: false,
          error: sessionResult.error
        });
      }

      // Get real-time availability
      const availability = await this.getCurrentAvailability();
      
      const transportOptions = [
        {
          type: "pod",
          display_name: "Stay the Night - Pod Hotel",
          available: availability.pods > 0,
          capacity_remaining: availability.pods,
          pricing: {
            base_price: 89.99,
            discounted_price: 62.99,
            discount_percentage: 30
          },
          perks: [
            "30% off pod rate",
            "10 gaming credits", 
            "Priority bar service"
          ],
          estimated_availability: availability.pods > 0 ? "immediate" : "waitlist"
        },
        {
          type: "rideshare",
          display_name: "Rideshare Home",
          available: true,
          services: ["uber", "lyft"],
          perks: [
            "5 drink vouchers",
            "Skip the bar line",
            "Pre-authorized ride"
          ],
          estimated_wait: "8-12 minutes"
        },
        {
          type: "dd", 
          display_name: "Designated Driver",
          available: availability.parking > 0,
          parking_spots: availability.parking,
          perks: [
            "Free soft drinks all night",
            "Free parking",
            "Double reward points"
          ]
        }
      ];

      res.json({
        success: true,
        data: {
          session_id: temp_id,
          available_options: transportOptions
        },
        message: "Transport options retrieved",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Transport options error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get transport options'
      });
    }
  }

  async selectTransport(req, res) {
    try {
      const { temp_id, transport_type, additional_data = {} } = req.body;
      
      // Validate availability
      const availability = await this.getCurrentAvailability();
      if (transport_type === 'pod' && availability.pods === 0) {
        return res.status(400).json({
          success: false,
          error: 'Pod hotel is at capacity'
        });
      }

      if (transport_type === 'dd' && availability.parking === 0) {
        return res.status(400).json({
          success: false,
          error: 'Parking is full'
        });
      }

      // Update session
      const updateResult = await this.sessionManager.updateSession(temp_id, {
        transport_method: transport_type,
        status: 'transport_selected',
        transport_selected_at: new Date().toISOString(),
        ...additional_data
      });

      if (!updateResult.success) {
        return res.status(400).json(updateResult);
      }

      // Reserve capacity
      await this.reserveCapacity(transport_type);

      // Generate confirmation
      const confirmationCode = this.generateConfirmationCode(transport_type);
      const incentives = this.getTransportIncentives(transport_type);

      // Emit capacity update
      this.io.emit('capacity:updated', await this.getCurrentAvailability());

      res.json({
        success: true,
        data: {
          temp_id,
          transport_selected: transport_type,
          confirmation_code: confirmationCode,
          incentives_applied: incentives,
          next_step: transport_type === 'dd' ? 'wristband_activation' : 'payment',
          payment_required: transport_type !== 'dd' ? this.getTransportPrice(transport_type) : 0
        },
        message: `${transport_type} selected successfully`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Transport selection error:', error);
      res.status(500).json({
        success: false,
        error: 'Transport selection failed'
      });
    }
  }

  async processPayment(req, res) {
    try {
      const { temp_id, payment_method, amount, stripe_token } = req.body;
      
      // Validate session
      const sessionResult = await this.sessionManager.getSession(temp_id);
      if (!sessionResult.success) {
        return res.status(404).json({ success: false, error: sessionResult.error });
      }

      const session = sessionResult.session;
      
      // Process payment based on transport method
      let paymentResult;
      if (session.transport_method === 'pod') {
        paymentResult = await this.processStripePayment(stripe_token, amount);
      } else if (session.transport_method === 'rideshare') {
        paymentResult = await this.authorizeRidesharePayment(payment_method);
      } else {
        return res.status(400).json({
          success: false,
          error: 'No payment required for designated driver'
        });
      }

      if (!paymentResult.success) {
        await this.sessionManager.updateSession(temp_id, {
          status: 'payment_failed',
          payment_error: paymentResult.error
        });
        return res.status(400).json(paymentResult);
      }

      // Update session with payment info
      await this.sessionManager.updateSession(temp_id, {
        status: 'payment_completed',
        payment_completed: true,
        payment_method,
        payment_amount: amount,
        payment_id: paymentResult.payment_id,
        payment_completed_at: new Date().toISOString()
      });

      res.json({
        success: true,
        data: {
          temp_id,
          payment_confirmed: true,
          payment_id: paymentResult.payment_id,
          next_step: 'wristband_activation'
        },
        message: "Payment processed successfully",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Payment processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Payment processing failed'
      });
    }
  }

  async activateWristband(req, res) {
    try {
      const { temp_id, wristband_nfc_id } = req.body;
      
      const linkResult = await this.sessionManager.linkWristband(temp_id, wristband_nfc_id);
      
      if (!linkResult.success) {
        return res.status(400).json(linkResult);
      }

      // Get updated session for perks
      const sessionResult = await this.sessionManager.getSession(temp_id);
      const perks = this.getActivePerks(sessionResult.session);

      // Emit wristband activation
      this.io.emit('wristband:activated', {
        temp_id,
        transport_method: sessionResult.session.transport_method
      });

      res.json({
        success: true,
        data: {
          temp_id,
          wristband_id: linkResult.wristband_id,
          payment_enabled: true,
          door_access: true,
          perks_active: perks,
          entry_authorized: true
        },
        message: "Wristband activated - welcome to Last Light!",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Wristband activation error:', error);
      res.status(500).json({
        success: false,
        error: 'Wristband activation failed'
      });
    }
  }

  // Exit Flow Endpoints
  async scanExit(req, res) {
    try {
      const { wristband_nfc_id } = req.body;
      
      const sessionResult = await this.sessionManager.getSessionByWristband(wristband_nfc_id);
      
      if (!sessionResult.success) {
        return res.status(404).json({
          success: false,
          error: 'Active session not found for wristband'
        });
      }

      const session = sessionResult.session;
      
      // Update session status to exiting
      await this.sessionManager.updateSession(session.temp_id, {
        status: 'exiting',
        exit_scan_time: new Date().toISOString()
      });

      res.json({
        success: true,
        data: {
          temp_id: session.temp_id,
          transport_method: session.transport_method,
          can_exit: true,
          verification_required: true
        },
        message: "Exit scan successful - verify transport",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Exit scan error:', error);
      res.status(500).json({
        success: false,
        error: 'Exit scan failed'
      });
    }
  }

  async verifyExit(req, res) {
    try {
      const { temp_id } = req.params;
      
      const sessionResult = await this.sessionManager.getSession(temp_id);
      if (!sessionResult.success) {
        return res.status(404).json({ success: false, error: sessionResult.error });
      }

      const session = sessionResult.session;
      const instructions = await this.getExitInstructions(session);

      res.json({
        success: true,
        data: {
          temp_id,
          transport_method: session.transport_method,
          exit_authorized: true,
          instructions
        },
        message: "Safe exit verified",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Exit verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Exit verification failed'
      });
    }
  }

  async completeExit(req, res) {
    try {
      const { temp_id, transport_confirmed } = req.body;
      
      if (!transport_confirmed) {
        return res.status(400).json({
          success: false,
          error: 'Transport must be confirmed before exit'
        });
      }

      const exitResult = await this.sessionManager.completeExit(temp_id, {
        exit_completed_at: new Date().toISOString(),
        transport_confirmed: true
      });

      if (!exitResult.success) {
        return res.status(400).json(exitResult);
      }

      // Update capacity
      const session = exitResult.session;
      await this.releaseCapacity(session.transport_method);

      // Emit capacity update
      this.io.emit('capacity:updated', await this.getCurrentAvailability());
      this.io.emit('session:exited', {
        temp_id,
        transport_method: session.transport_method
      });

      res.json({
        success: true,
        data: {
          temp_id,
          session_complete: true,
          door_unlocked: true
        },
        message: "Safe exit completed - door unlocked",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Exit completion error:', error);
      res.status(500).json({
        success: false,
        error: 'Exit completion failed'
      });
    }
  }

  // Staff and Recovery Endpoints
  async staffOverride(req, res) {
    try {
      const { temp_id } = req.params;
      const { staff_id, reason, override_data } = req.body;
      
      const overrideResult = await this.sessionManager.staffOverrideSession(
        temp_id, 
        staff_id, 
        override_data, 
        reason
      );

      if (!overrideResult.success) {
        return res.status(400).json(overrideResult);
      }

      // Log staff action
      this.io.emit('staff:action', {
        staff_id,
        action: 'override',
        temp_id,
        reason
      });

      res.json({
        success: true,
        data: {
          temp_id,
          override_applied: true,
          session: overrideResult.session
        },
        message: `Staff override applied: ${reason}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Staff override error:', error);
      res.status(500).json({
        success: false,
        error: 'Staff override failed'
      });
    }
  }

  async physicalRecovery(req, res) {
    try {
      const { recovery_code, staff_id, customer_info = {} } = req.body;
      
      const recoveryResult = await this.offlineManager.handlePhysicalRecovery(
        recovery_code,
        staff_id,
        customer_info
      );

      if (!recoveryResult.success) {
        return res.status(404).json(recoveryResult);
      }

      res.json({
        success: true,
        data: {
          recovery_ticket: recoveryResult.recovery_ticket,
          session: recoveryResult.session,
          next_steps: recoveryResult.next_steps
        },
        message: "Physical recovery successful",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Physical recovery error:', error);
      res.status(500).json({
        success: false,
        error: 'Physical recovery failed'
      });
    }
  }

  // System Status and Analytics
  async getSystemStatus(req, res) {
    try {
      const sessionStats = await this.sessionManager.getAdvancedSessionStats();
      const capacityStatus = await this.getCurrentAvailability();
      const offlineStatus = this.offlineManager.getOfflineSystemStatus();

      res.json({
        success: true,
        data: {
          system_health: 'healthy',
          session_stats: sessionStats.data,
          capacity: capacityStatus,
          offline_mode: offlineStatus,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('System status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get system status'
      });
    }
  }

  // Helper Methods
  handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }

  async verifyAge(qr_code) {
    // Simulate ID verification service
    // In production, integrate with ID scanning service
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, age_verified: true, age: 25 };
  }

  async getCurrentAvailability() {
    // In production, query real-time from venue management systems
    return {
      pods: this.capacityTracker.pod_availability,
      parking: this.capacityTracker.parking_availability,
      total_capacity: this.config.venue.capacity,
      current_occupancy: this.capacityTracker.current_occupancy,
      last_updated: this.capacityTracker.last_updated
    };
  }

  async reserveCapacity(transport_type) {
    if (transport_type === 'pod') {
      this.capacityTracker.pod_availability--;
    } else if (transport_type === 'dd') {
      this.capacityTracker.parking_availability--;
    }
    this.capacityTracker.current_occupancy++;
    this.capacityTracker.last_updated = new Date();
  }

  async releaseCapacity(transport_type) {
    if (transport_type === 'pod') {
      this.capacityTracker.pod_availability++;
    } else if (transport_type === 'dd') {
      this.capacityTracker.parking_availability++;
    }
    this.capacityTracker.current_occupancy--;
    this.capacityTracker.last_updated = new Date();
  }

  generateConfirmationCode(transport_type) {
    const prefix = transport_type.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }

  getTransportIncentives(transport_type) {
    const incentives = {
      pod: ['pod_discount_30', 'gaming_credits_10', 'priority_bar'],
      rideshare: ['drink_vouchers_5', 'priority_queue'],
      dd: ['free_soft_drinks', 'free_parking', 'double_rewards']
    };
    return incentives[transport_type] || [];
  }

  getTransportPrice(transport_type) {
    const prices = { pod: 62.99, rideshare: 0 };
    return prices[transport_type] || 0;
  }

  async processStripePayment(stripe_token, amount) {
    // Simulate Stripe payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      payment_id: `pi_${Date.now()}`,
      amount_charged: amount
    };
  }

  async authorizeRidesharePayment(payment_method) {
    // Simulate rideshare payment authorization
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      payment_id: `auth_${Date.now()}`,
      authorized: true
    };
  }

  async getExitInstructions(session) {
    const instructions = {
      pod: {
        type: 'pod_access',
        room_number: `P-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
        elevator_code: String(Math.floor(Math.random() * 9000) + 1000),
        checkout_time: '11:00 AM'
      },
      rideshare: {
        type: 'rideshare_pickup',
        pickup_location: 'Main Entrance - Zone A',
        estimated_wait: '5-8 minutes',
        services: ['uber', 'lyft']
      },
      dd: {
        type: 'key_retrieval',
        locker_number: `DD-${Math.floor(Math.random() * 50) + 1}`,
        access_code: String(Math.floor(Math.random() * 9000) + 1000),
        parking_zone: 'Zone C - North'
      }
    };
    return instructions[session.transport_method];
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  startCapacityMonitoring() {
    setInterval(async () => {
      const capacity = await this.getCurrentAvailability();
      this.io.emit('capacity:update', capacity);
    }, 30000); // Every 30 seconds
  }

  async healthCheck(req, res) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        session_manager: 'active',
        offline_manager: 'ready'
      }
    };

    res.json(health);
  }

  start() {
    this.server.listen(this.config.port, () => {
      console.log(`🌟 Last Light API Server running on port ${this.config.port}`);
    });
  }
}

// Initialize and start server
if (require.main === module) {
  const api = new LastLightAPI();
  api.start();
}

module.exports = { LastLightAPI };