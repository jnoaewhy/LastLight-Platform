// Last Light Payment Webhook & Reconciliation System
// Handles Stripe webhooks, payment failures, refunds, and reconciliation

const express = require('express');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

class PaymentWebhookManager {
  constructor(sessionManager, hardwareManager, loadManager) {
    this.sessions = sessionManager;
    this.hardware = hardwareManager;
    this.loadManager = loadManager;
    
    this.config = {
      stripe: {
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        webhook_tolerance: 300, // 5 minutes
        retry_attempts: 3,
        retry_delay: 5000
      },
      reconciliation: {
        check_interval: 300000, // 5 minutes
        max_payment_age: 1800000, // 30 minutes
        auto_suspend_threshold: 600000 // 10 minutes
      },
      notifications: {
        slack_webhook: process.env.SLACK_WEBHOOK_URL,
        email_alerts: process.env.PAYMENT_ALERT_EMAILS?.split(',') || [],
        sms_alerts: process.env.PAYMENT_ALERT_PHONES?.split(',') || []
      }
    };

    // Payment state tracking
    this.pendingPayments = new Map(); // payment_intent_id -> session data
    this.failedPayments = new Map(); // session_id -> failure info
    this.processedWebhooks = new Set(); // idempotency tracking
    this.reconciliationQueue = [];

    this.initializeWebhookHandler();
    this.startReconciliationProcess();
  }

  initializeWebhookHandler() {
    this.router = express.Router();
    
    // Stripe webhook endpoint (needs raw body for signature verification)
    this.router.post('/webhooks/stripe', 
      express.raw({ type: 'application/json' }),
      this.handleStripeWebhook.bind(this)
    );

    // Manual payment resolution endpoints
    this.router.post('/payments/resolve/:session_id', this.resolvePaymentManually.bind(this));
    this.router.post('/payments/refund/:session_id', this.processRefund.bind(this));
    this.router.post('/payments/reconcile', this.forceReconciliation.bind(this));
    
    // Payment status endpoints
    this.router.get('/payments/status/:session_id', this.getPaymentStatus.bind(this));
    this.router.get('/payments/failed', this.getFailedPayments.bind(this));
    this.router.get('/payments/pending', this.getPendingPayments.bind(this));

    console.log('💳 Payment webhook system initialized');
  }

  // Stripe Webhook Handler
  async handleStripeWebhook(req, res) {
    const sig = req.get('stripe-signature');
    const webhookSecret = this.config.stripe.webhook_secret;

    let event;
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        webhookSecret,
        this.config.stripe.webhook_tolerance
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid webhook signature' 
      });
    }

    // Idempotency check
    const eventId = event.id;
    if (this.processedWebhooks.has(eventId)) {
      console.log(`⚠️ Duplicate webhook ignored: ${eventId}`);
      return res.status(200).json({ success: true, message: 'Duplicate webhook' });
    }

    this.processedWebhooks.add(eventId);

    try {
      await this.processWebhookEvent(event);
      
      res.status(200).json({ 
        success: true, 
        event_id: eventId,
        event_type: event.type 
      });
      
    } catch (error) {
      console.error(`❌ Webhook processing failed for ${eventId}:`, error);
      
      // Don't return error to Stripe (to prevent retries) but log and alert
      this.sendPaymentAlert('webhook_processing_failed', {
        event_id: eventId,
        event_type: event.type,
        error: error.message
      });
      
      res.status(200).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  async processWebhookEvent(event) {
    console.log(`🔔 Processing webhook: ${event.type} - ${event.id}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
        
      case 'payment_intent.requires_action':
        await this.handlePaymentRequiresAction(event.data.object);
        break;
        
      case 'charge.dispute.created':
        await this.handleChargeback(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object);
        break;
        
      case 'customer.source.expiring':
        await this.handleCardExpiring(event.data.object);
        break;
        
      case 'payment_method.attached':
        await this.handlePaymentMethodAttached(event.data.object);
        break;
        
      default:
        console.log(`ℹ️ Unhandled webhook type: ${event.type}`);
    }
  }

  // Payment Success Handler
  async handlePaymentSucceeded(paymentIntent) {
    console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
    
    try {
      // Extract session info from payment metadata
      const sessionId = paymentIntent.metadata.session_id;
      const transportMethod = paymentIntent.metadata.transport_method;
      
      if (!sessionId) {
        throw new Error('No session_id in payment metadata');
      }

      // Update session status
      const sessionResult = await this.sessions.getSession(sessionId);
      if (!sessionResult.success) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      // Confirm payment in session
      await this.sessions.updateSession(sessionId, {
        payment_status: 'completed',
        payment_confirmed: true,
        payment_intent_id: paymentIntent.id,
        amount_charged: paymentIntent.amount / 100, // Convert from cents
        payment_method: paymentIntent.payment_method,
        stripe_charge_id: paymentIntent.latest_charge,
        payment_confirmed_at: new Date().toISOString()
      });

      // Remove from pending payments
      this.pendingPayments.delete(paymentIntent.id);
      
      // Clear any failed payment flags
      this.failedPayments.delete(sessionId);

      // Handle transport-specific actions
      await this.handleTransportPaymentSuccess(sessionId, transportMethod, paymentIntent);

      console.log(`💰 Payment reconciled successfully: ${sessionId}`);
      
      // Emit success event
      this.emitPaymentEvent('payment:succeeded', {
        session_id: sessionId,
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        transport_method: transportMethod
      });

    } catch (error) {
      console.error('Error handling payment success:', error);
      await this.sendPaymentAlert('payment_success_processing_failed', {
        payment_intent_id: paymentIntent.id,
        error: error.message,
        metadata: paymentIntent.metadata
      });
    }
  }

  // Payment Failure Handler
  async handlePaymentFailed(paymentIntent) {
    console.error(`❌ Payment failed: ${paymentIntent.id}`);
    
    try {
      const sessionId = paymentIntent.metadata.session_id;
      const failureReason = paymentIntent.last_payment_error?.message || 'Unknown error';
      
      if (!sessionId) {
        console.error('No session_id in failed payment metadata');
        return;
      }

      // Get current session state
      const sessionResult = await this.sessions.getSession(sessionId);
      if (!sessionResult.success) {
        console.error(`Session not found for failed payment: ${sessionId}`);
        return;
      }

      const session = sessionResult.session;
      const failureInfo = {
        session_id: sessionId,
        payment_intent_id: paymentIntent.id,
        failure_reason: failureReason,
        failure_code: paymentIntent.last_payment_error?.code,
        amount_attempted: paymentIntent.amount / 100,
        transport_method: session.transport_method,
        customer_inside: session.entry_completed,
        wristband_active: !!session.wristband_id,
        failure_time: new Date().toISOString(),
        requires_manual_resolution: false
      };

      // Store failure info
      this.failedPayments.set(sessionId, failureInfo);

      // Determine response based on session state
      if (session.entry_completed && session.wristband_id) {
        // CRITICAL: Person is already inside with active wristband
        await this.handlePaymentFailureAfterEntry(sessionId, failureInfo);
      } else {
        // Person hasn't entered yet - safer scenario
        await this.handlePaymentFailureBeforeEntry(sessionId, failureInfo);
      }

      // Log for audit trail
      await this.logPaymentFailure(failureInfo);
      
      // Emit failure event
      this.emitPaymentEvent('payment:failed', failureInfo);

    } catch (error) {
      console.error('Error handling payment failure:', error);
      await this.sendPaymentAlert('payment_failure_processing_error', {
        payment_intent_id: paymentIntent.id,
        error: error.message
      });
    }
  }

  // Critical: Handle payment failure AFTER person entered venue
  async handlePaymentFailureAfterEntry(sessionId, failureInfo) {
    console.error(`🚨 CRITICAL: Payment failed for person inside venue - ${sessionId}`);
    
    failureInfo.requires_manual_resolution = true;
    
    // Update session to reflect payment failure but don't suspend immediately
    await this.sessions.updateSession(sessionId, {
      payment_status: 'failed',
      payment_failure_reason: failureInfo.failure_reason,
      payment_failure_code: failureInfo.failure_code,
      manual_resolution_required: true,
      staff_notified: true
    });

    // Send immediate high-priority alert to staff
    await this.sendPaymentAlert('critical_payment_failure_after_entry', {
      ...failureInfo,
      priority: 'CRITICAL',
      action_required: 'Immediate staff intervention needed',
      recommendations: [
        'Verify customer identity and payment method',
        'Attempt manual payment processing',
        'Consider offering alternative payment method',
        'Document resolution in session notes'
      ]
    });

    // Schedule automatic suspension if not resolved within threshold
    setTimeout(async () => {
      await this.checkUnresolvedPaymentFailure(sessionId);
    }, this.config.reconciliation.auto_suspend_threshold);

    // Add to manual resolution queue
    this.reconciliationQueue.push({
      session_id: sessionId,
      issue_type: 'payment_failed_after_entry',
      priority: 'critical',
      created_at: new Date(),
      ...failureInfo
    });
  }

  // Handle payment failure BEFORE person entered venue
  async handlePaymentFailureBeforeEntry(sessionId, failureInfo) {
    console.log(`⚠️ Payment failed before entry: ${sessionId}`);
    
    // Update session status to payment failed
    await this.sessions.updateSession(sessionId, {
      payment_status: 'failed',
      status: 'payment_failed',
      payment_failure_reason: failureInfo.failure_reason,
      payment_failure_code: failureInfo.failure_code,
      entry_blocked: true
    });

    // Release any reserved capacity
    await this.releaseReservedCapacity(sessionId, failureInfo.transport_method);

    // Send moderate priority alert
    await this.sendPaymentAlert('payment_failure_before_entry', failureInfo);

    // Customer can retry payment or select different method
    this.emitPaymentEvent('payment:retryRequired', {
      session_id: sessionId,
      failure_reason: failureInfo.failure_reason,
      retry_options: ['retry_same_card', 'different_card', 'different_transport']
    });
  }

  // Handle 3D Secure or other authentication requirements
  async handlePaymentRequiresAction(paymentIntent) {
    console.log(`🔐 Payment requires action: ${paymentIntent.id}`);
    
    const sessionId = paymentIntent.metadata.session_id;
    if (!sessionId) return;

    // Update session to reflect authentication requirement
    await this.sessions.updateSession(sessionId, {
      payment_status: 'requires_action',
      payment_action_required: true,
      client_secret: paymentIntent.client_secret
    });

    // Emit event for frontend to handle 3D Secure
    this.emitPaymentEvent('payment:requiresAction', {
      session_id: sessionId,
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      next_action: paymentIntent.next_action
    });

    // Set timeout for action completion
    setTimeout(async () => {
      await this.checkPaymentActionTimeout(paymentIntent.id, sessionId);
    }, 600000); // 10 minutes for 3D Secure
  }

  // Handle chargebacks and disputes
  async handleChargeback(dispute) {
    console.error(`⚖️ Chargeback created: ${dispute.id}`);
    
    try {
      const chargeId = dispute.charge;
      const charge = await stripe.charges.retrieve(chargeId);
      const paymentIntentId = charge.payment_intent;
      
      // Find session associated with this payment
      const sessionId = await this.findSessionByPaymentIntent(paymentIntentId);
      
      if (sessionId) {
        await this.sessions.updateSession(sessionId, {
          chargeback_created: true,
          chargeback_id: dispute.id,
          chargeback_amount: dispute.amount / 100,
          chargeback_reason: dispute.reason,
          chargeback_created_at: new Date().toISOString()
        });

        // High priority alert for chargebacks
        await this.sendPaymentAlert('chargeback_created', {
          session_id: sessionId,
          dispute_id: dispute.id,
          charge_id: chargeId,
          amount: dispute.amount / 100,
          reason: dispute.reason,
          evidence_due_by: dispute.evidence_details.due_by
        });
      }

    } catch (error) {
      console.error('Error handling chargeback:', error);
    }
  }

  // Reconciliation Process
  startReconciliationProcess() {
    setInterval(async () => {
      await this.performPaymentReconciliation();
    }, this.config.reconciliation.check_interval);

    console.log('🔄 Payment reconciliation process started');
  }

  async performPaymentReconciliation() {
    console.log('🔍 Performing payment reconciliation...');
    
    try {
      // Check for orphaned payments (payments without confirmed sessions)
      await this.checkOrphanedPayments();
      
      // Check for sessions with unconfirmed payments
      await this.checkUnconfirmedPayments();
      
      // Process manual resolution queue
      await this.processReconciliationQueue();
      
      // Check for expired payment intents
      await this.checkExpiredPaymentIntents();
      
      // Clean up old processed webhooks
      await this.cleanupProcessedWebhooks();
      
    } catch (error) {
      console.error('Reconciliation process error:', error);
    }
  }

  async checkOrphanedPayments() {
    // Find Stripe payments that succeeded but didn't update our sessions
    const recentPayments = await stripe.paymentIntents.list({
      created: { gte: Math.floor((Date.now() - this.config.reconciliation.max_payment_age) / 1000) },
      status: 'succeeded'
    });

    for (const payment of recentPayments.data) {
      if (!payment.metadata.session_id) continue;
      
      const sessionId = payment.metadata.session_id;
      const sessionResult = await this.sessions.getSession(sessionId);
      
      if (sessionResult.success) {
        const session = sessionResult.session;
        
        // Check if payment is confirmed in our system
        if (session.payment_status !== 'completed' || !session.payment_confirmed) {
          console.log(`🔧 Found orphaned payment, reconciling: ${payment.id}`);
          await this.handlePaymentSucceeded(payment);
        }
      }
    }
  }

  async checkUnconfirmedPayments() {
    // Find sessions with payment_processing status that are old
    const cutoffTime = new Date(Date.now() - this.config.reconciliation.max_payment_age);
    
    // This would typically query the database for sessions in processing state
    // For now, check our pending payments map
    for (const [paymentIntentId, sessionData] of this.pendingPayments.entries()) {
      if (new Date(sessionData.created_at) < cutoffTime) {
        console.log(`⏰ Payment processing timeout: ${paymentIntentId}`);
        
        try {
          // Check actual Stripe status
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          
          if (paymentIntent.status === 'succeeded') {
            await this.handlePaymentSucceeded(paymentIntent);
          } else if (paymentIntent.status === 'canceled' || paymentIntent.status === 'payment_failed') {
            await this.handlePaymentFailed(paymentIntent);
          }
          
        } catch (error) {
          console.error(`Error checking payment intent ${paymentIntentId}:`, error);
        }
      }
    }
  }

  async checkUnresolvedPaymentFailure(sessionId) {
    const failureInfo = this.failedPayments.get(sessionId);
    if (!failureInfo || !failureInfo.requires_manual_resolution) return;

    // Check if still unresolved
    const sessionResult = await this.sessions.getSession(sessionId);
    if (!sessionResult.success) return;

    const session = sessionResult.session;
    if (session.payment_status === 'failed' && session.manual_resolution_required) {
      console.error(`🚨 Unresolved payment failure timeout: ${sessionId}`);
      
      // Suspend wristband access
      await this.sessions.updateSession(sessionId, {
        status: 'suspended',
        suspension_reason: 'payment_failure_timeout',
        wristband_suspended: true,
        auto_suspended: true,
        suspended_at: new Date().toISOString()
      });

      // Send critical alert
      await this.sendPaymentAlert('payment_failure_auto_suspension', {
        session_id: sessionId,
        suspension_reason: 'Payment failure not resolved within time limit',
        wristband_suspended: true,
        requires_immediate_staff_action: true
      });
    }
  }

  // Manual Resolution Methods
  async resolvePaymentManually(req, res) {
    try {
      const { session_id } = req.params;
      const { 
        resolution_type, 
        staff_id, 
        notes, 
        new_payment_method,
        amount_collected 
      } = req.body;

      const failureInfo = this.failedPayments.get(session_id);
      if (!failureInfo) {
        return res.status(404).json({
          success: false,
          error: 'No payment failure found for this session'
        });
      }

      let resolutionResult;
      switch (resolution_type) {
        case 'manual_payment':
          resolutionResult = await this.processManualPayment(session_id, {
            staff_id,
            payment_method: new_payment_method,
            amount: amount_collected,
            notes
          });
          break;
          
        case 'comp_session':
          resolutionResult = await this.compSession(session_id, {
            staff_id,
            reason: notes
          });
          break;
          
        case 'refund_and_exit':
          resolutionResult = await this.refundAndExit(session_id, {
            staff_id,
            notes
          });
          break;
          
        default:
          throw new Error('Invalid resolution type');
      }

      // Remove from failed payments and reconciliation queue
      this.failedPayments.delete(session_id);
      this.reconciliationQueue = this.reconciliationQueue.filter(
        item => item.session_id !== session_id
      );

      res.json({
        success: true,
        resolution_result: resolutionResult,
        message: 'Payment failure resolved manually'
      });

    } catch (error) {
      console.error('Manual resolution error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async processManualPayment(sessionId, resolutionData) {
    // Process manual payment (cash, different card, etc.)
    await this.sessions.updateSession(sessionId, {
      payment_status: 'completed',
      payment_method: resolutionData.payment_method,
      amount_charged: resolutionData.amount,
      manual_payment: true,
      resolved_by_staff: resolutionData.staff_id,
      resolution_notes: resolutionData.notes,
      resolved_at: new Date().toISOString(),
      manual_resolution_required: false
    });

    console.log(`💰 Manual payment processed: ${sessionId} by ${resolutionData.staff_id}`);
    
    return {
      type: 'manual_payment',
      amount: resolutionData.amount,
      staff_id: resolutionData.staff_id
    };
  }

  async compSession(sessionId, resolutionData) {
    // Comp the session (house pays)
    await this.sessions.updateSession(sessionId, {
      payment_status: 'completed',
      payment_method: 'comp',
      amount_charged: 0,
      comp_session: true,
      comp_reason: resolutionData.reason,
      resolved_by_staff: resolutionData.staff_id,
      resolved_at: new Date().toISOString(),
      manual_resolution_required: false
    });

    console.log(`🎁 Session comped: ${sessionId} by ${resolutionData.staff_id}`);
    
    return {
      type: 'comp_session',
      reason: resolutionData.reason,
      staff_id: resolutionData.staff_id
    };
  }

  // Refund Processing
  async processRefund(req, res) {
    try {
      const { session_id } = req.params;
      const { reason, amount, staff_id } = req.body;

      const sessionResult = await this.sessions.getSession(session_id);
      if (!sessionResult.success) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      const session = sessionResult.session;
      
      if (!session.payment_intent_id || !session.stripe_charge_id) {
        return res.status(400).json({
          success: false,
          error: 'No Stripe payment found for this session'
        });
      }

      // Process refund with Stripe
      const refund = await stripe.refunds.create({
        charge: session.stripe_charge_id,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
        reason: reason || 'requested_by_customer',
        metadata: {
          session_id,
          staff_id,
          refund_reason: reason
        }
      });

      // Update session with refund info
      await this.sessions.updateSession(session_id, {
        refund_id: refund.id,
        refund_amount: refund.amount / 100,
        refund_reason: reason,
        refunded_by_staff: staff_id,
        refunded_at: new Date().toISOString()
      });

      console.log(`💸 Refund processed: ${refund.id} for session ${session_id}`);

      res.json({
        success: true,
        refund_id: refund.id,
        amount_refunded: refund.amount / 100,
        status: refund.status
      });

    } catch (error) {
      console.error('Refund processing error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Alert System
  async sendPaymentAlert(alertType, alertData) {
    const alert = {
      type: alertType,
      timestamp: new Date().toISOString(),
      data: alertData,
      priority: this.getAlertPriority(alertType)
    };

    console.log(`🚨 Payment Alert [${alert.priority}]: ${alertType}`);

    // Send to various channels based on priority
    if (alert.priority === 'CRITICAL') {
      await this.sendSlackAlert(alert);
      await this.sendEmailAlert(alert);
      await this.sendSMSAlert(alert);
    } else if (alert.priority === 'HIGH') {
      await this.sendSlackAlert(alert);
      await this.sendEmailAlert(alert);
    } else {
      await this.sendSlackAlert(alert);
    }

    // Store alert for dashboard
    this.emitPaymentEvent('payment:alert', alert);
  }

  getAlertPriority(alertType) {
    const priorities = {
      'critical_payment_failure_after_entry': 'CRITICAL',
      'chargeback_created': 'CRITICAL', 
      'payment_failure_auto_suspension': 'CRITICAL',
      'payment_failure_before_entry': 'HIGH',
      'payment_success_processing_failed': 'HIGH',
      'webhook_processing_failed': 'MEDIUM',
      'payment_failure_processing_error': 'MEDIUM'
    };
    
    return priorities[alertType] || 'LOW';
  }

  async sendSlackAlert(alert) {
    if (!this.config.notifications.slack_webhook) return;
    
    try {
      const axios = require('axios');
      await axios.post(this.config.notifications.slack_webhook, {
        text: `🚨 Payment Alert [${alert.priority}]`,
        attachments: [{
          color: alert.priority === 'CRITICAL' ? 'danger' : 'warning',
          fields: [
            { title: 'Alert Type', value: alert.type, short: true },
            { title: 'Priority', value: alert.priority, short: true },
            { title: 'Details', value: JSON.stringify(alert.data, null, 2), short: false }
          ],
          ts: Math.floor(Date.now() / 1000)
        }]
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  // Utility Methods
  emitPaymentEvent(eventType, eventData) {
    // Emit to load manager for dashboard updates
    if (this.loadManager) {
      this.loadManager.emit(eventType, eventData);
    }
    
    // Emit to hardware manager if relevant
    if (this.hardware && eventType.includes('suspend')) {
      this.hardware.emit('session:suspended', eventData);
    }
  }

  async findSessionByPaymentIntent(paymentIntentId) {
    // This would typically query the database
    // For now, check our pending payments map
    const sessionData = this.pendingPayments.get(paymentIntentId);
    return sessionData?.session_id || null;
  }

  async releaseReservedCapacity(sessionId, transportMethod) {
    // Release any reserved pods or parking spaces
    if (transportMethod === 'pod') {
      // Increment available pods
      console.log(`📉 Released pod capacity for failed payment: ${sessionId}`);
    } else if (transportMethod === 'dd') {
      // Increment available parking
      console.log(`📉 Released parking capacity for failed payment: ${sessionId}`);
    }
  }

  async logPaymentFailure(failureInfo) {
    // Log to audit system
    console.log('📝 Payment failure logged for audit trail:', {
      session_id: failureInfo.session_id,
      payment_intent_id: failureInfo.payment_intent_id,
      failure_reason: failureInfo.failure_reason,
      customer_inside: failureInfo.customer_inside,
      timestamp: failureInfo.failure_time
    });
  }

  cleanupProcessedWebhooks() {
    // Remove old webhook IDs to prevent memory leak
    const oneHourAgo = Date.now() - 3600000;
    // This is simplified - in production, you'd store timestamps with webhook IDs
    if (this.processedWebhooks.size > 10000) {
      this.processedWebhooks.clear();
      console.log('🧹 Cleaned up processed webhooks cache');
    }
  }

  // Status and Monitoring
  getPaymentSystemStatus() {
    return {
      timestamp: new Date().toISOString(),
      pending_payments: this.pendingPayments.size,
      failed_payments: this.failedPayments.size,
      manual_resolution_queue: this.reconciliationQueue.length,
      processed_webhooks_count: this.processedWebhooks.size,
      reconciliation_running: true
    };
  }

  async getFailedPayments(req, res) {
    const failures = Array.from(this.failedPayments.entries()).map(([sessionId, info]) => ({
      session_id: sessionId,
      ...info
    }));

    res.json({
      success: true,
      failed_payments: failures,
      count: failures.length
    });
  }

  async getPendingPayments(req, res) {
    const pending = Array.from(this.pendingPayments.entries()).map(([paymentId, data]) => ({
      payment_intent_id: paymentId,
      ...data
    }));

    res.json({
      success: true,
      pending_payments: pending,
      count: pending.length
    });
  }

  // Transport-specific payment success handling
  async handleTransportPaymentSuccess(sessionId, transportMethod, paymentIntent) {
    switch (transportMethod) {
      case 'pod':
        // Reserve specific pod room
        const roomNumber = await this.assignPodRoom(sessionId);
        await this.sessions.updateSession(sessionId, {
          pod_room_assigned: roomNumber,
          pod_room_key_active: true
        });
        console.log(`🏨 Pod room assigned: ${roomNumber} for session ${sessionId}`);
        break;
        
      case 'rideshare':
        // Pre-authorize payment method for ride
        await this.sessions.updateSession(sessionId, {
          rideshare_preauth_completed: true,
          rideshare_payment_method: paymentIntent.payment_method
        });
        console.log(`🚗 Rideshare pre-auth completed for session ${sessionId}`);
        break;
        
      case 'dd':
        // DD doesn't require payment, but this shouldn't happen
        console.warn(`⚠️ Unexpected payment for DD session: ${sessionId}`);
        break;
    }
  }

  async assignPodRoom(sessionId) {
    // Simplified room assignment - in production, integrate with pod hotel system
    const roomNumber = `P-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`;
    return roomNumber;
  }

  // Express router getter
  getRouter() {
    return this.router;
  }
}

module.exports = { PaymentWebhookManager };