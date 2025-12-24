# Last Light Platform

> **A complete gaming venue management ecosystem with 4 interconnected React Native applications, real-time synchronization, and comprehensive safety systems.**

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

---

## 📖 Overview

**Last Light** is a production-ready mobile platform designed for comprehensive venue management. Built for **The Lantern Social House**, a Japanese-themed gaming arcade and karaoke venue, the platform provides real-time operational control through four specialized mobile applications.

**Built by:** JaQuan Earls  
**Development Timeline:** 8 weeks of intensive full-stack development  
**Status:** Beta-ready with full feature implementation

---

## 🎯 The Problem It Solves

Entertainment venues require sophisticated systems that can:
- Track patron sessions and activity in real-time
- Implement safety protocols and interventions
- Manage staff operations and emergency response
- Provide management oversight across all activities
- Enable owner-level control over system operations

**Last Light addresses these challenges with a unified, real-time platform.**

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
- AsyncStorage for offline-first architecture
- Socket.io Client for real-time communication
- Custom hooks for state management

**Backend (API Server)**
- Node.js 18+
- Express.js framework
- Socket.io for WebSocket connections
- JWT authentication
- bcrypt for password security

**Database**
- PostgreSQL 15+
- Supabase for managed hosting
- Row-level security policies
- Real-time subscriptions
- Optimized indexes for performance

**Infrastructure**
- Railway (backend deployment)
- Vercel (frontend hosting capability)
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
- Safety verification system
- Real-time notifications
- Offline mode support

**Tech Highlights:**
- Cyberpunk Tokyo aesthetic with sunset neon colors
- Geofencing for time verification
- Biometric authentication support
- Session state persistence

---

### 2. Staff App 👔
**Purpose:** Frontline operations management

**Key Features:**
- Real-time session monitoring
- Task assignment and completion tracking
- Emergency SOS system
- Live floor status dashboard
- Order management
- Clock in/out functionality

**Tech Highlights:**
- Emerald green color scheme
- Push notifications for urgent tasks
- Offline functionality for critical operations
- Role-based access controls

---

### 3. Management App 📊
**Purpose:** Oversight and analytics

**Key Features:**
- Live operations dashboard
- Staff performance metrics
- Revenue tracking and analytics
- Safety intervention controls
- Inventory management
- Shift scheduling

**Tech Highlights:**
- Cyber blue/cyan aesthetic
- Real-time data visualization
- Export capabilities for reporting
- Advanced filtering and search

---

### 4. Owner App 👑
**Purpose:** System-wide control and oversight

**Key Features:**
- Complete system oversight
- Financial analytics and projections
- Multi-location management capability
- Emergency broadcast system
- System-wide configuration controls
- Comprehensive audit log access

**Tech Highlights:**
- Platinum and black design
- Highest security clearance level
- Direct database query capabilities
- System health monitoring

---

## 🔥 Key Features

### Real-Time Synchronization
All four applications sync instantly via WebSockets:
- Session status updates propagate in real-time
- Staff tasks appear immediately across devices
- Financial data updates live
- Emergency alerts broadcast system-wide

### Safety System
Implements patron safety protocols through:
- Time-based session tracking
- Geofenced check-in verification
- Mandatory safety acknowledgments
- Staff intervention workflows
- Automated safety threshold monitoring

### Offline-First Architecture
Critical functions operate without internet connectivity:
- Session check-ins stored locally
- Staff operations continue uninterrupted
- Automatic synchronization when reconnected
- Conflict resolution strategies

### Security & Authentication
- JWT token-based authentication
- Role-based access control (4 permission levels)
- Encrypted data transmission
- Biometric login support
- Automatic session timeout management

### Payment Integration
- Stripe payment processing
- Credit-based transaction system
- Webhook handling for reconciliation
- Refund management
- Comprehensive financial reporting

---

## 💾 Database Architecture

**30+ Interconnected Tables:**
- User management (patrons, staff, managers, owners)
- Session tracking (active, historical, safety logs)
- Financial transactions (purchases, refunds, credits)
- Inventory systems (games, rooms, menu items)
- Staff operations (shifts, tasks, performance metrics)
- Analytics (aggregated metrics, trends, forecasts)

**Key Design Decisions:**
- Multi-tenant architecture for venue isolation
- Soft deletes for comprehensive audit trails
- Optimistic locking for concurrency control
- Materialized views for performance optimization
- Scheduled aggregation jobs for analytics

---

## 🚀 Technical Highlights

### Full-Stack Mobile Development
- Built 4 complete React Native applications from scratch
- Implemented complex navigation flows and state management
- Created reusable component libraries
- Designed intuitive UX for different user roles

### Backend Architecture
- 109 REST API endpoints across 12 resource types
- WebSocket server handling 20+ real-time event types
- Real-time state synchronization across multiple clients
- Horizontal scaling strategy for production deployment

### Database Design
- Normalized schema with proper relational design
- Strategic query optimization through indexing
- Row-level security policies for data isolation
- Comprehensive migration strategy for schema evolution

### System Integration
- Stripe payment webhook processing
- Geolocation service integration
- Push notification infrastructure
- Email/SMS alert systems
- Third-party API integrations

### Security Implementation
- JWT authentication with refresh token rotation
- bcrypt password hashing (10 rounds)
- SQL injection prevention through parameterized queries
- XSS protection mechanisms
- CORS configuration for API security
- Rate limiting for API endpoints

### Development Practices
- Modular code organization
- Consistent naming conventions
- Comprehensive inline documentation
- Strategic error handling
- Centralized logging system

---

## 📊 By The Numbers

- **8,000+** lines of production code
- **4** complete mobile applications
- **109** REST API endpoints
- **30+** database tables
- **20+** WebSocket event types
- **7** security implementation layers
- **4** distinct user role types
- **8 weeks** intensive development timeline

---

## 📁 Repository Structure

```
LastLight-Platform/
├── apps/
│   ├── patron/          # Customer-facing mobile app
│   ├── staff/           # Staff operations app
│   ├── management/      # Management dashboard app
│   └── owner/           # Owner control center app
├── backend/
│   ├── api/             # REST API server implementation
│   ├── services/        # Business logic layer
│   ├── middleware/      # Authentication, logging, validation
│   └── config/          # Configuration management
├── database/
│   ├── schemas/         # Database schema definitions
│   └── migrations/      # Schema migration scripts
├── docs/
│   ├── ARCHITECTURE.md  # System architecture deep dive
│   ├── BUILD_SUMMARY.md # Feature overview and statistics
│   └── TECH_STACK.md    # Technology decisions and rationale
├── assets/              # Shared assets and resources
└── README.md           # Project documentation
```

---

## 🎓 Technical Learnings

### Skills Developed
- **React Native Mastery** - Advanced patterns and performance optimization
- **Node.js at Scale** - Production-ready API architecture
- **Database Design** - Multi-tenant normalized schemas
- **Real-Time Systems** - WebSocket architecture and state synchronization
- **Security Engineering** - Authentication, authorization, data protection
- **System Architecture** - Designing scalable, maintainable platforms

### Complex Problems Solved
- **Multi-App State Management** - Synchronizing state across disconnected applications
- **Offline-First Architecture** - Implementing eventual consistency patterns
- **Real-Time Synchronization** - Preventing race conditions in concurrent updates
- **Multi-Role Authorization** - Granular permission systems with role inheritance
- **Safety-Critical Systems** - Building reliable intervention mechanisms

### Project Management
- **Scope Definition** - Distinguishing MVP features from future enhancements
- **Timeline Estimation** - Breaking complex projects into achievable milestones
- **Technical Documentation** - Making sophisticated systems accessible
- **Iterative Development** - Continuous refinement based on use case analysis

---

## 🔮 Future Enhancements

**Planned Features:**
- [ ] Native mobile app deployment (iOS App Store, Google Play)
- [ ] Push notification infrastructure
- [ ] Advanced analytics dashboard with ML predictions
- [ ] Multi-location support and franchise management
- [ ] Automated testing suite (unit, integration, e2e)
- [ ] CI/CD pipeline implementation

**Scalability Improvements:**
- [ ] Redis caching layer for session management
- [ ] Database read replicas for query optimization
- [ ] CDN integration for static asset delivery
- [ ] Microservices architecture transition
- [ ] Kubernetes orchestration for deployment

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
git clone https://github.com/jnoaewhy/LastLight-Platform.git
cd LastLight-Platform

# Install backend dependencies
cd backend
npm install

# Install app dependencies (repeat for each app)
cd ../apps/patron
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start the backend server
cd ../../backend
npm run dev

# Start mobile apps (in separate terminals)
cd ../apps/patron
npm start
```

For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)

---

## 📞 Contact

**JaQuan Earls**  
Full-Stack Mobile Developer

- 📧 Email: jaquan.earls@thelanternsocial.house
- 💼 LinkedIn: [linkedin.com/in/jaquan-earls-6130423a1](https://www.linkedin.com/in/jaquan-earls-6130423a1/)
- 🐙 GitHub: [@jnoaewhy](https://github.com/jnoaewhy)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏢 Project Context

This platform was developed to address real-world operational challenges in the entertainment venue industry. It demonstrates end-to-end system architecture, from database design through mobile deployment, with production-ready code quality and comprehensive documentation.

**Note:** This is a portfolio project showcasing full-stack mobile development capabilities. Production deployments incorporate additional security measures and proprietary business logic not included in this public repository.

---

*Built with modern web technologies and best practices in software architecture*

*Last updated: December 2024*
