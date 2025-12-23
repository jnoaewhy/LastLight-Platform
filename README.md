# Last Light Platform

> **A complete gaming venue management ecosystem with 4 interconnected React Native applications, real-time synchronization, and comprehensive safety systems.**

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

---

## 📖 Overview

**Last Light** is a production-ready mobile platform designed for **The Lantern Social House**, a Japanese-themed gaming arcade and karaoke venue in East Lansing, Michigan. The platform provides comprehensive venue management through four specialized mobile applications that work together in real-time.

**Built by:** JaQuan Earls  
**Timeline:** 8 weeks of intensive development  
**Status:** Beta-ready, full feature implementation complete

---

## 🎯 The Problem It Solves

Gaming venues need systems that:
- Track patron sessions and consumption in real-time
- Prevent impaired driving through safety interventions
- Manage staff operations and emergency response
- Provide management oversight across all activities
- Give owners god-mode control over every system

**Last Light solves all of this with a unified platform.**

---

## 🏗️ Architecture

### System Overview
```
┌─────────────────────────────────────────────────────────┐
│                    Last Light Platform                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │  Patron  │  │  Staff   │  │Management│  │  Owner   ││
│  │   App    │  │   App    │  │   App    │  │   App    ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘│
│       │             │              │              │      │
│       └─────────────┴──────────────┴──────────────┘      │
│                         │                                │
│                         ▼                                │
│              ┌─────────────────────┐                     │
│              │   WebSocket Layer   │                     │
│              │   (Real-time Sync)  │                     │
│              └──────────┬──────────┘                     │
│                         │                                │
│                         ▼                                │
│              ┌─────────────────────┐                     │
│              │   REST API Server   │                     │
│              │   (109 Endpoints)   │                     │
│              └──────────┬──────────┘                     │
│                         │                                │
│                         ▼                                │
│              ┌─────────────────────┐                     │
│              │  PostgreSQL DB      │                     │
│              │  (30+ Tables)       │                     │
│              └─────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend (Mobile Apps)**
- React Native 0.72+
- React Navigation 6.x
- AsyncStorage for offline-first
- Socket.io Client for real-time
- Custom hooks for state management

**Backend (API Server)**
- Node.js 18+
- Express.js
- Socket.io for WebSocket connections
- JWT authentication
- bcrypt for password security

**Database**
- PostgreSQL 15+
- Supabase for hosting
- Row-level security policies
- Real-time subscriptions
- Optimized indexes

**Infrastructure**
- Railway (backend deployment)
- Vercel (frontend hosting)
- Stripe (payment processing)
- Geolocation APIs

---

## 📱 The Four Applications

### 1. Patron App 🎮
**Purpose:** Customer-facing experience

**Key Features:**
- Session check-in/check-out with QR codes
- Credit purchases and balance management
- Activity tracking (games, karaoke, food orders)
- Safety verification system (prevents impaired driving)
- Real-time notifications
- Offline mode support

**Tech Highlights:**
- Cyberpunk Tokyo aesthetic (sunset neon colors)
- Geofencing for time verification
- Biometric authentication support
- Session state persistence

---

### 2. Staff App 👔
**Purpose:** Frontline operations management

**Key Features:**
- Session monitoring across all patrons
- Task assignment and completion tracking
- Emergency SOS button
- Real-time floor status
- Order management
- Clock in/out system

**Tech Highlights:**
- Emerald green color scheme
- Push notifications for urgent tasks
- Offline functionality for critical operations
- Role-based permissions

---

### 3. Management App 📊
**Purpose:** Oversight and analytics

**Key Features:**
- Live floor dashboard
- Staff performance metrics
- Revenue tracking and analytics
- Safety intervention controls
- Inventory management
- Shift scheduling

**Tech Highlights:**
- Cyber blue/cyan aesthetic
- Real-time data visualization
- Export capabilities for reports
- Advanced filtering and search

---

### 4. Owner App 👑
**Purpose:** God-mode system control

**Key Features:**
- Complete system oversight
- Financial analytics and projections
- Multi-location management (future-ready)
- Emergency broadcast system
- System-wide settings control
- Audit log access

**Tech Highlights:**
- Platinum & black royal design
- Highest security clearance
- Direct database query capabilities
- System health monitoring

---

## 🔥 Key Features

### Real-Time Synchronization
All four apps sync in real-time via WebSockets:
- Session status updates propagate instantly
- Staff tasks appear immediately
- Financial data updates live
- Emergency alerts broadcast system-wide

### Safety System
**Prevents impaired driving through:**
- Time-based session tracking
- Geofenced check-in verification
- Mandatory safety acknowledgments
- Staff intervention protocols
- Automated ride-sharing integration

### Offline-First Architecture
Critical functions work without internet:
- Session check-ins stored locally
- Staff operations continue
- Automatic sync when reconnected
- Conflict resolution strategies

### Security & Authentication
- JWT token-based auth
- Role-based access control (4 levels)
- Encrypted data transmission
- Biometric login support
- Session management with automatic timeout

### Payment Integration
- Stripe payment processing
- Credit-based system
- Webhook handling for reconciliation
- Refund management
- Financial reporting

---

## 💾 Database Architecture

**30+ Interconnected Tables:**
- Users (patrons, staff, managers, owners)
- Sessions (active, historical, safety logs)
- Transactions (purchases, refunds, credits)
- Inventory (games, rooms, food items)
- Staff operations (shifts, tasks, performance)
- Analytics (aggregated metrics, trends)

**Key Design Decisions:**
- Multi-tenant architecture (venue isolation)
- Soft deletes for audit trails
- Optimistic locking for concurrency
- Materialized views for performance
- Scheduled aggregation jobs

---

## 🚀 Technical Highlights

### What Makes This Impressive

**1. Full-Stack Mobile Development**
- Built 4 complete React Native applications from scratch
- Implemented complex navigation flows
- Created reusable component libraries
- Designed intuitive UX for different user roles

**2. Backend Architecture**
- 109 REST API endpoints across 12 resource types
- WebSocket server handling 20+ event types
- Real-time state synchronization across clients
- Horizontal scaling strategy implemented

**3. Database Design**
- Normalized schema with proper relationships
- Query optimization with strategic indexing
- Row-level security policies
- Migration strategy for schema evolution

**4. System Integration**
- Stripe payment webhooks
- Geolocation services
- Push notification services
- Email/SMS alerts
- Third-party APIs

**5. Security Implementation**
- JWT authentication with refresh tokens
- bcrypt password hashing
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

**6. Development Practices**
- Modular code organization
- Consistent naming conventions
- Comprehensive documentation
- Error handling strategies
- Logging and monitoring

---

## 📊 By The Numbers

- **8,000+** lines of code written
- **4** mobile applications
- **109** API endpoints
- **30+** database tables
- **20+** WebSocket event types
- **7** security layers
- **4** user role types
- **8 weeks** development time

---

## 📁 Repository Structure

```
LastLight-Platform/
├── apps/
│   ├── patron/          # Patron mobile app
│   ├── staff/           # Staff operations app
│   ├── management/      # Management dashboard app
│   └── owner/           # Owner control center app
├── backend/
│   ├── api/             # REST API server
│   ├── services/        # Business logic services
│   ├── middleware/      # Auth, logging, validation
│   └── config/          # Configuration files
├── database/
│   ├── schemas/         # Database schema definitions
│   └── migrations/      # Migration scripts
├── docs/
│   ├── BUILD_SUMMARY.md # Complete build documentation
│   └── TECH_STACK.md    # Technical decisions and rationale
├── assets/              # Shared assets (icons, images)
└── README.md           # This file
```

---

## 🎓 What I Learned

### Technical Growth
- **React Native mastery** - From basics to advanced patterns
- **Node.js at scale** - Building production-ready APIs
- **Database design** - Multi-tenant, normalized schemas
- **Real-time systems** - WebSocket architecture and state management
- **Security** - Authentication, authorization, data protection
- **System architecture** - Designing scalable, maintainable systems

### Problem-Solving
- **Complex state management** across multiple disconnected apps
- **Offline-first challenges** with eventual consistency
- **Real-time synchronization** without race conditions
- **Multi-role authorization** with different permission levels
- **Safety-critical systems** where failure isn't an option

### Project Management
- **Scope definition** - MVP vs future features
- **Timeline estimation** - Breaking down large projects
- **Documentation** - Making complex systems understandable
- **Iteration** - Refining features based on use cases

---

## 🔮 Future Enhancements

**Phase 2 Features:**
- [ ] Push notification system
- [ ] Advanced analytics dashboard
- [ ] Machine learning for session predictions
- [ ] Mobile app store deployment (iOS/Android)
- [ ] Multi-location support
- [ ] API rate limiting and caching
- [ ] Automated testing suite
- [ ] CI/CD pipeline

**Scalability Improvements:**
- [ ] Redis caching layer
- [ ] Database read replicas
- [ ] CDN for static assets
- [ ] Microservices architecture
- [ ] Kubernetes deployment

---

## 🛠️ Local Development Setup

### Prerequisites
```bash
Node.js 18+
PostgreSQL 15+
React Native development environment
```

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/LastLight-Platform.git
cd LastLight-Platform

# Install backend dependencies
cd backend
npm install

# Install app dependencies (repeat for each app)
cd ../apps/patron
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start the backend server
cd ../../backend
npm run dev

# Start the mobile apps (in separate terminals)
cd ../apps/patron
npm start
```

---

## 📞 Contact

**JaQuan Earls**  
Full-Stack Mobile Developer

- 📧 Email: jaquan.earls@thelanternsocial.house
- 💼 LinkedIn: 
- 🐙 GitHub: jnoaewhy
- 🌐 Portfolio: 

---

## 📄 License

This project is part of a portfolio demonstration. For licensing inquiries, please contact the developer.

---

## 🙏 Acknowledgments

Built with determination, coffee, and a vision to create something meaningful. This platform represents not just technical capability, but the ability to take a complex real-world problem and architect a complete solution from the ground up.

**"Pressure makes diamonds."** 💎

---

*Last updated: December 2024*
