// Last Light Session Management System
// Handles anonymous temporary sessions with 24-hour expiration

const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class SessionManager {
  constructor(redisClient, dbClient) {
    this.redis = redisClient;
    this.db = dbClient;
    this.SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.CLEANUP_INTERVAL = 60 * 60 * 1000; // Cleanup every hour
    
    // Start the cleanup job
    this.startCleanupJob();
  }

  // Create a new anonymous session
  async createSession(ageVerified = false, venueId = 'lantern_001') {
    const temp_id = uuidv4();
    const created_at = new Date();
    const expires_at = new Date(Date.now() + this.SESSION_EXPIRY);
    
    const sessionData = {
      temp_id,
      venue_id: venueId,
      age_verified: ageVerified,
      status: 'pending', // pending, transport_selected, payment_completed, active, exited
      transport_method: null,
      wristband_id: null,
      created_at: created_at.toISOString(),
      expires_at: expires_at.toISOString(),
      last_activity: created_at.toISOString(),
      incentives_applied: [],
      payment_completed: false,
      entry_completed: false
    };

    try {
      // Store in Redis for fast access (with TTL)
      const redisKey = `session:${temp_id}`;
      await this.redis.setex(redisKey, 24 * 60 * 60, JSON.stringify(sessionData));
      
      // Store in database for persistence and analytics
      await this.db.query(`
        INSERT INTO sessions (
          temp_id, venue_id, age_verified, status, created_at, expires_at, last_activity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [temp_id, venueId, ageVerified, 'pending', created_at, expires_at, created_at]);

      console.log(`Session created: ${temp_id}, expires: ${expires_at}`);
      return { success: true, temp_id, expires_at };
      
    } catch (error) {
      console.error('Error creating session:', error);
      return { success: false, error: 'Failed to create session' };
    }
  }

  // Get session data (checks Redis first, then DB)
  async getSession(temp_id) {
    try {
      // Try Redis first (fastest)
      const redisKey = `session:${temp_id}`;
      const redisData = await this.redis.get(redisKey);
      
      if (redisData) {
        const session = JSON.parse(redisData);
        
        // Check if session is expired
        if (new Date(session.expires_at) < new Date()) {
          await this.expireSession(temp_id);
          return { success: false, error: 'Session expired' };
        }
        
        // Update last activity
        await this.updateLastActivity(temp_id);
        return { success: true, session };
      }

      // Fallback to database
      const dbResult = await this.db.query(
        'SELECT * FROM sessions WHERE temp_id = $1 AND expires_at > NOW()',
        [temp_id]
      );

      if (dbResult.rows.length === 0) {
        return { success: false, error: 'Session not found or expired' };
      }

      const session = dbResult.rows[0];
      
      // Restore to Redis
      await this.redis.setex(redisKey, 24 * 60 * 60, JSON.stringify(session));
      await this.updateLastActivity(temp_id);
      
      return { success: true, session };
      
    } catch (error) {
      console.error('Error getting session:', error);
      return { success: false, error: 'Failed to retrieve session' };
    }
  }

  // Update session data
  async updateSession(temp_id, updates) {
    try {
      const sessionResult = await this.getSession(temp_id);
      if (!sessionResult.success) {
        return sessionResult;
      }

      const session = { ...sessionResult.session, ...updates };
      session.last_activity = new Date().toISOString();

      // Update Redis
      const redisKey = `session:${temp_id}`;
      await this.redis.setex(redisKey, 24 * 60 * 60, JSON.stringify(session));

      // Update database with only the changed fields
      const updateFields = [];
      const updateValues = [];
      let paramCounter = 1;

      Object.keys(updates).forEach(key => {
        if (key !== 'temp_id' && key !== 'created_at') {
          updateFields.push(`${key} = $${paramCounter}`);
          updateValues.push(updates[key]);
          paramCounter++;
        }
      });

      if (updateFields.length > 0) {
        updateFields.push(`last_activity = $${paramCounter}`);
        updateValues.push(session.last_activity);
        updateValues.push(temp_id); // for WHERE clause

        const query = `
          UPDATE sessions 
          SET ${updateFields.join(', ')}
          WHERE temp_id = $${paramCounter + 1}
        `;

        await this.db.query(query, updateValues);
      }

      console.log(`Session updated: ${temp_id}`);
      return { success: true, session };
      
    } catch (error) {
      console.error('Error updating session:', error);
      return { success: false, error: 'Failed to update session' };
    }
  }

  // Link wristband to session
  async linkWristband(temp_id, wristband_nfc_id) {
    // Hash the physical wristband ID for privacy
    const wristband_id = crypto.createHash('sha256')
      .update(wristband_nfc_id + process.env.WRISTBAND_SALT)
      .digest('hex');

    try {
      // Check if wristband is already in use
      const existingWristband = await this.db.query(
        'SELECT temp_id FROM sessions WHERE wristband_id = $1 AND status != $2',
        [wristband_id, 'exited']
      );

      if (existingWristband.rows.length > 0) {
        return { success: false, error: 'Wristband already in use' };
      }

      const updateResult = await this.updateSession(temp_id, {
        wristband_id,
        status: 'active',
        entry_completed: true
      });

      if (updateResult.success) {
        console.log(`Wristband linked: ${temp_id} -> ${wristband_id.substring(0, 8)}...`);
        return { success: true, wristband_id };
      }

      return updateResult;
      
    } catch (error) {
      console.error('Error linking wristband:', error);
      return { success: false, error: 'Failed to link wristband' };
    }
  }

  // Get session by wristband (for exit flow)
  async getSessionByWristband(wristband_nfc_id) {
    const wristband_id = crypto.createHash('sha256')
      .update(wristband_nfc_id + process.env.WRISTBAND_SALT)
      .digest('hex');

    try {
      const result = await this.db.query(
        'SELECT * FROM sessions WHERE wristband_id = $1 AND expires_at > NOW() AND status = $2',
        [wristband_id, 'active']
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Active session not found for wristband' };
      }

      const session = result.rows[0];
      await this.updateLastActivity(session.temp_id);
      
      return { success: true, session };
      
    } catch (error) {
      console.error('Error getting session by wristband:', error);
      return { success: false, error: 'Failed to retrieve session' };
    }
  }

  // Complete exit process
  async completeExit(temp_id, exitData = {}) {
    try {
      const updateResult = await this.updateSession(temp_id, {
        status: 'exited',
        exit_time: new Date().toISOString(),
        safe_departure_confirmed: true,
        ...exitData
      });

      if (updateResult.success) {
        console.log(`Exit completed: ${temp_id}`);
        
        // Schedule data deletion (compliance with 24-hour policy)
        setTimeout(() => {
          this.scheduleDataDeletion(temp_id);
        }, this.SESSION_EXPIRY);
      }

      return updateResult;
      
    } catch (error) {
      console.error('Error completing exit:', error);
      return { success: false, error: 'Failed to complete exit' };
    }
  }

  // Update last activity timestamp
  async updateLastActivity(temp_id) {
    const now = new Date().toISOString();
    
    try {
      // Update Redis
      const redisKey = `session:${temp_id}`;
      const sessionData = await this.redis.get(redisKey);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.last_activity = now;
        await this.redis.setex(redisKey, 24 * 60 * 60, JSON.stringify(session));
      }

      // Update database
      await this.db.query(
        'UPDATE sessions SET last_activity = $1 WHERE temp_id = $2',
        [now, temp_id]
      );
      
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  }

  // Expire a session immediately
  async expireSession(temp_id) {
    try {
      // Remove from Redis
      await this.redis.del(`session:${temp_id}`);
      
      // Mark as expired in database
      await this.db.query(
        'UPDATE sessions SET status = $1, expires_at = NOW() WHERE temp_id = $2',
        ['expired', temp_id]
      );

      console.log(`Session expired: ${temp_id}`);
      return { success: true };
      
    } catch (error) {
      console.error('Error expiring session:', error);
      return { success: false, error: 'Failed to expire session' };
    }
  }

  // Get active session stats (for monitoring)
  async getSessionStats() {
    try {
      const stats = await this.db.query(`
        SELECT 
          status,
          transport_method,
          COUNT(*) as count
        FROM sessions 
        WHERE expires_at > NOW() AND created_at > NOW() - INTERVAL '24 hours'
        GROUP BY status, transport_method
        ORDER BY status, transport_method
      `);

      return { success: true, stats: stats.rows };
      
    } catch (error) {
      console.error('Error getting session stats:', error);
      return { success: false, error: 'Failed to get session stats' };
    }
  }

  // Cleanup job - runs every hour
  startCleanupJob() {
    setInterval(async () => {
      try {
        console.log('Running session cleanup...');
        
        // Delete expired sessions from database
        const result = await this.db.query(`
          DELETE FROM sessions 
          WHERE expires_at < NOW() - INTERVAL '1 hour'
        `);

        console.log(`Cleaned up ${result.rowCount} expired sessions`);
        
        // Clean up orphaned Redis keys (this is more complex, skipping for now)
        
      } catch (error) {
        console.error('Error in cleanup job:', error);
      }
    }, this.CLEANUP_INTERVAL);
  }

  // Schedule data deletion (for compliance)
  async scheduleDataDeletion(temp_id) {
    // This would integrate with a job queue in production
    console.log(`Scheduling data deletion for session: ${temp_id}`);
    
    // For now, just delete after the session expires
    setTimeout(async () => {
      try {
        await this.db.query('DELETE FROM sessions WHERE temp_id = $1', [temp_id]);
        console.log(`Data deleted for compliance: ${temp_id}`);
      } catch (error) {
        console.error('Error deleting session data:', error);
      }
    }, 1000); // In production, this would be handled by a proper job queue
  }

  // Validate session before critical operations
  async validateSession(temp_id, requiredStatus = null) {
    const sessionResult = await this.getSession(temp_id);
    
    if (!sessionResult.success) {
      return { valid: false, error: sessionResult.error };
    }

    const session = sessionResult.session;
    
    // Check expiration
    if (new Date(session.expires_at) < new Date()) {
      await this.expireSession(temp_id);
      return { valid: false, error: 'Session expired' };
    }

    // Check required status
    if (requiredStatus && session.status !== requiredStatus) {
      return { valid: false, error: `Invalid session status. Expected: ${requiredStatus}, Got: ${session.status}` };
    }

    return { valid: true, session };
  }
}

// Database schema for sessions table
const SESSION_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    temp_id UUID UNIQUE NOT NULL,
    venue_id VARCHAR(50) NOT NULL,
    age_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    transport_method VARCHAR(20),
    wristband_id VARCHAR(64), -- SHA256 hash
    payment_completed BOOLEAN DEFAULT FALSE,
    entry_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP,
    safe_departure_confirmed BOOLEAN DEFAULT FALSE,
    incentives_applied JSONB DEFAULT '[]'::jsonb,
    
    -- Indexes for performance
    INDEX idx_sessions_temp_id (temp_id),
    INDEX idx_sessions_wristband (wristband_id),
    INDEX idx_sessions_expires (expires_at),
    INDEX idx_sessions_status (status),
    INDEX idx_sessions_venue (venue_id)
);

-- Auto-cleanup trigger (runs daily)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Schedule the cleanup to run daily
-- This would be set up as a cron job or scheduled task in production
`;

module.exports = { SessionManager, SESSION_TABLE_SCHEMA };
