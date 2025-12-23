# Last Light Platform - System Architecture

## System Overview

Last Light is a distributed system consisting of 4 mobile applications, a REST API server, a WebSocket server for real-time communication, and a PostgreSQL database. All components work together to provide comprehensive venue management.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────┐│
│  │ Patron App   │  │ Staff App    │  │ Management   │  │Owner ││
│  │              │  │              │  │ App          │  │App   ││
│  │ React Native │  │ React Native │  │ React Native │  │React ││
│  │ Offline-first│  │ Push Notifs  │  │ Analytics    │  │Native││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───┬──┘│
│         │                 │                  │               │   │
│         └─────────────────┴──────────────────┴───────────────┘   │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
        ┌───────────▼───────┐   ┌────────▼──────────┐
        │   REST API        │   │  WebSocket Server │
        │   (HTTP/HTTPS)    │   │  (Socket.io)      │
        │                   │   │                   │
        │ 109 Endpoints     │   │ 20+ Event Types   │
        │ JWT Auth          │   │ Room-based        │
        │ Rate Limiting     │   │ Broadcasting      │
        └───────────┬───────┘   └────────┬──────────┘
                    │                    │
                    └──────────┬─────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                    INTEGRATION LAYER                              │
├──────────────────────────────┼───────────────────────────────────┤
│                              │                                   │
│  ┌────────────┐  ┌──────────▼─────────┐  ┌──────────────────┐  │
│  │   Stripe   │  │  Business Logic    │  │  External APIs   │  │
│  │  Payments  │◄─┤  Layer             │──►  Geolocation     │  │
│  │  Webhooks  │  │                    │  │  Push Notifs     │  │
│  └────────────┘  │  - Session Manager │  │  Email/SMS       │  │
│                  │  - Safety System   │  └──────────────────┘  │
│                  │  - Auth Service    │                        │
│                  │  - Payment Handler │                        │
│                  └──────────┬─────────┘                        │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────┼───────────────────────────────────┤
│                             │                                   │
│                   ┌─────────▼──────────┐                        │
│                   │   PostgreSQL DB    │                        │
│                   │   (Supabase)       │                        │
│                   │                    │                        │
│                   │  30+ Tables        │                        │
│                   │  Row-level security│                        │
│                   │  Real-time subs    │                        │
│                   │  Optimized indexes │                        │
│                   └────────────────────┘                        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Client Layer (Mobile Apps)

#### Patron App
- **Purpose:** Customer-facing session management
- **Tech:** React Native with offline-first architecture
- **Key Features:**
  - QR code check-in/check-out
  - Credit purchases via Stripe
  - Activity tracking
  - Safety verification
- **State Management:** React Context + AsyncStorage
- **Color Scheme:** Sunset neon (cyberpunk Tokyo aesthetic)

#### Staff App
- **Purpose:** Frontline operations
- **Tech:** React Native with push notifications
- **Key Features:**
  - Session monitoring
  - Task management
  - Emergency SOS
  - Clock in/out
- **State Management:** React Context + Real-time sync
- **Color Scheme:** Emerald green

#### Management App
- **Purpose:** Oversight and analytics
- **Tech:** React Native with data visualization
- **Key Features:**
  - Live dashboard
  - Staff performance
  - Revenue analytics
  - Safety controls
- **State Management:** React Context + Real-time data
- **Color Scheme:** Cyber blue/cyan

#### Owner App
- **Purpose:** God-mode system control
- **Tech:** React Native with highest permissions
- **Key Features:**
  - Complete oversight
  - Financial projections
  - System settings
  - Audit logs
- **State Management:** React Context + Full database access
- **Color Scheme:** Platinum & black

---

### 2. API Layer

#### REST API Server
- **Technology:** Node.js + Express.js
- **Port:** 3000 (configurable)
- **Authentication:** JWT with refresh tokens
- **Rate Limiting:** 100 requests/15 minutes per IP
- **CORS:** Configured for mobile app origins

**Endpoint Categories:**
1. **Auth** (7 endpoints) - Login, register, logout, token refresh
2. **Sessions** (15 endpoints) - CRUD + status management
3. **Users** (12 endpoints) - Profiles, roles, permissions
4. **Transactions** (18 endpoints) - Credits, purchases, refunds
5. **Staff** (14 endpoints) - Tasks, schedules, performance
6. **Inventory** (10 endpoints) - Games, rooms, items
7. **Analytics** (8 endpoints) - Metrics, reports, trends
8. **Safety** (9 endpoints) - Interventions, logs, alerts
9. **Payments** (8 endpoints) - Stripe integration, webhooks
10. **Admin** (8 endpoints) - System settings, audit logs

#### WebSocket Server
- **Technology:** Socket.io
- **Connection:** Persistent bidirectional
- **Rooms:** Organized by role and venue
- **Events:** 20+ types for real-time updates

**Event Types:**
- Session updates (check-in, check-out, status changes)
- Staff tasks (assignments, completions)
- Emergency alerts (SOS, broadcasts)
- Financial updates (transactions, revenue ticks)
- System notifications

---

### 3. Integration Layer

#### Business Logic Services

**Session Manager**
- Tracks active patron sessions
- Calculates session duration and consumption
- Enforces safety thresholds
- Handles check-in/check-out workflows

**Safety System**
- Monitors patron behavior patterns
- Triggers interventions when needed
- Coordinates with staff for response
- Logs all safety events for compliance

**Authentication Service**
- JWT token generation and validation
- Password hashing with bcrypt
- Role-based access control
- Session management

**Payment Handler**
- Stripe integration for credit purchases
- Webhook processing for payment events
- Refund management
- Transaction reconciliation

#### External Integrations

**Stripe**
- Payment processing
- Webhook handlers for async events
- Subscription management (future)

**Geolocation APIs**
- Check-in verification
- Location-based features
- Geofencing for time accuracy

**Push Notifications**
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNS)
- Critical alerts and updates

---

### 4. Data Layer

#### PostgreSQL Database

**Schema Design Principles:**
- Normalized to 3NF
- Multi-tenant architecture (venue isolation)
- Soft deletes for audit trails
- Optimistic locking for concurrency
- Strategic indexing for performance

**Core Tables:**

**Users & Auth:**
- `users` - User accounts across all roles
- `user_roles` - Role assignments
- `sessions_auth` - Active JWT sessions
- `user_preferences` - App settings

**Venue Operations:**
- `venues` - Multi-location support
- `sessions` - Active patron sessions
- `session_history` - Historical data
- `safety_logs` - Intervention records

**Financial:**
- `transactions` - All financial activity
- `credits` - User credit balances
- `purchases` - Item purchases
- `refunds` - Refund records

**Staff Management:**
- `staff_shifts` - Clock in/out records
- `staff_tasks` - Task assignments
- `staff_performance` - Metrics

**Inventory:**
- `games` - Arcade machines
- `karaoke_rooms` - Room details
- `menu_items` - Food & beverage
- `inventory_levels` - Stock tracking

**Analytics:**
- `daily_metrics` - Aggregated data
- `revenue_projections` - Forecasts
- `patron_analytics` - Behavior patterns

---

## Data Flow Examples

### Example 1: Patron Check-In

```
1. Patron scans QR code in venue
2. Patron App → POST /api/sessions/checkin
   - Includes: user_id, venue_id, location coords
3. API validates:
   - User exists and is authorized
   - Venue is operational
   - No existing active session
   - Location is within geofence
4. API creates session record in DB
5. API broadcasts via WebSocket:
   - Staff App: "New patron checked in"
   - Management App: Update floor count
6. API returns session_id to Patron App
7. Patron App stores session locally (offline backup)
8. Patron App displays active session UI
```

### Example 2: Emergency SOS

```
1. Staff member presses SOS button
2. Staff App → POST /api/emergency/sos
   - Includes: staff_id, location, severity
3. API logs emergency event
4. API broadcasts IMMEDIATELY via WebSocket:
   - All Management Apps: Critical alert
   - All Staff Apps: Assist colleague
   - Owner App: Emergency notification
5. System tracks response times
6. Management/Staff confirm response
7. Incident logged for compliance
```

### Example 3: Real-Time Revenue Update

```
1. Patron completes purchase
2. Patron App → POST /api/transactions/purchase
3. API processes transaction
4. API updates database (transaction + credits)
5. Stripe processes payment (async webhook)
6. API broadcasts via WebSocket:
   - Owner App: Revenue ticker updates
   - Management App: Transaction log
   - Patron App: Updated credit balance
7. Analytics aggregation job runs (scheduled)
8. Dashboard metrics update automatically
```

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. API validates against database
3. If valid:
   - Generate JWT access token (15min expiry)
   - Generate refresh token (7 day expiry)
   - Store refresh token in DB
   - Return both tokens to client
4. Client stores tokens securely
5. Client includes access token in requests
6. API validates token on each request
7. When access token expires:
   - Client uses refresh token
   - API generates new access token
   - Process continues
```

### Authorization Levels

**Level 1: Patron**
- Own session data only
- Purchase credits
- View own history
- Cannot access other patrons

**Level 2: Staff**
- Read all sessions
- Update task status
- Clock in/out
- Cannot modify financial data

**Level 3: Management**
- All staff permissions
- View analytics
- Manage staff
- Safety interventions
- Cannot change system settings

**Level 4: Owner**
- All permissions
- System configuration
- Financial data
- Multi-venue management
- Audit log access

---

## Scalability Considerations

### Current Capacity
- **Single venue:** 500 concurrent patrons
- **API throughput:** 1000 req/sec
- **WebSocket connections:** 2000 simultaneous
- **Database:** 10GB with room for growth

### Scaling Strategy

**Horizontal Scaling:**
- Load balancer for API servers
- Redis for session storage (shared state)
- Database read replicas
- CDN for static assets

**Vertical Scaling:**
- Increase server resources
- Database connection pooling
- Optimize queries with caching
- Index optimization

**Future Architecture:**
- Microservices for major features
- Event-driven architecture
- Message queue (RabbitMQ/Kafka)
- Kubernetes orchestration

---

## Deployment Architecture

### Current Setup
- **Backend:** Railway (Node.js hosting)
- **Database:** Supabase (managed PostgreSQL)
- **Frontend:** Vercel (potential web versions)
- **Mobile:** Direct distribution (TestFlight/internal)

### Production Recommendations
- **Backend:** AWS ECS or Kubernetes
- **Database:** AWS RDS or managed PostgreSQL
- **Cache:** Redis cluster
- **CDN:** Cloudflare or AWS CloudFront
- **Monitoring:** Datadog or New Relic
- **Logging:** ELK stack or CloudWatch

---

## Monitoring & Observability

### Key Metrics
- API response times (p50, p95, p99)
- WebSocket connection stability
- Database query performance
- Error rates by endpoint
- Active sessions count
- Revenue per hour
- Staff response times

### Logging Strategy
- Structured JSON logs
- Log levels: ERROR, WARN, INFO, DEBUG
- Request/response logging
- Audit trail for sensitive operations
- Retention: 30 days operational, 7 years audit

### Alerting
- API downtime > 1 minute
- Database connection failures
- Payment processing errors
- Safety system failures
- Unusual traffic patterns

---

## Disaster Recovery

### Backup Strategy
- **Database:** Daily full backups, hourly incrementals
- **Retention:** 30 days operational, 1 year compliance
- **Testing:** Monthly restore verification

### Failover Plans
- **API:** Load balancer auto-routes to healthy instances
- **Database:** Automatic failover to standby replica
- **WebSocket:** Reconnection logic in clients

### Business Continuity
- Offline mode for critical functions
- Manual override capabilities
- Emergency contact procedures
- Incident response playbook

---

*This architecture supports current operations while being designed for future growth and complexity.*
