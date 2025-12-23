# Getting Started with Last Light Platform

This guide will help you set up the Last Light Platform for local development.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### For Mobile Development
- **React Native CLI** - `npm install -g react-native-cli`
- **iOS Development:**
  - macOS required
  - Xcode 14+ 
  - CocoaPods - `sudo gem install cocoapods`
- **Android Development:**
  - Android Studio
  - Android SDK (API 33+)
  - Java Development Kit (JDK 11)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/LastLight-Platform.git
cd LastLight-Platform
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Each Mobile App
```bash
# Patron App
cd ../apps/patron
npm install

# Staff App
cd ../staff
npm install

# Management App
cd ../management
npm install

# Owner App
cd ../owner
npm install
```

---

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lastlight;

# Create user (optional)
CREATE USER lastlight_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE lastlight TO lastlight_user;

\q
```

### 2. Run Migrations

```bash
cd backend
npm run migrate
```

### 3. Seed Data (Optional)

```bash
npm run seed
```

---

## Environment Configuration

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://lastlight_user:your_secure_password@localhost:5432/lastlight

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Supabase (if using)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Mobile Apps

Each app needs its own configuration. Create `config.js` in each app directory:

```javascript
// apps/patron/config.js
export const API_URL = 'http://localhost:3000';
export const WEBSOCKET_URL = 'ws://localhost:3000';

// For physical devices, use your machine's local IP:
// export const API_URL = 'http://192.168.1.100:3000';
```

---

## Running the Applications

### Start the Backend

```bash
cd backend
npm run dev
```

The API server will start on `http://localhost:3000`

### Start Mobile Apps

#### Option 1: Using Expo (Recommended for Development)

```bash
cd apps/patron
npm start
```

This opens the Expo Dev Tools. You can:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

#### Option 2: Native Build

```bash
# iOS
cd apps/patron
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Mobile App Tests

```bash
cd apps/patron
npm test
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### Database Connection Failed
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l`

#### React Native Metro Bundler Issues
```bash
# Clear cache
npx react-native start --reset-cache

# Clean build
cd ios && pod install && cd ..
npx react-native run-ios
```

#### iOS Simulator Not Found
```bash
# List available simulators
xcrun simctl list devices

# Boot a simulator
xcrun simctl boot "iPhone 14"
```

---

## Development Workflow

### Making Changes

1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test thoroughly

4. Commit with descriptive message
```bash
git add .
git commit -m "Add: Description of changes"
```

5. Push to your fork
```bash
git push origin feature/your-feature-name
```

---

## Project Structure

```
LastLight-Platform/
├── apps/                    # Mobile applications
│   ├── patron/             # Customer-facing app
│   ├── staff/              # Staff operations app
│   ├── management/         # Management dashboard
│   └── owner/              # Owner control center
├── backend/                # API server
│   ├── api/               # Express routes & controllers
│   ├── services/          # Business logic
│   ├── middleware/        # Auth, validation, etc.
│   └── config/            # Configuration files
├── database/              # Database-related files
│   ├── schemas/          # Schema definitions
│   └── migrations/       # Migration scripts
├── docs/                 # Documentation
└── README.md            # This file
```

---

## Next Steps

- Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design details
- Check [BUILD_SUMMARY.md](./docs/BUILD_SUMMARY.md) for feature overview
- Review [TECH_STACK.md](./docs/TECH_STACK.md) for technology decisions

---

## Need Help?

- **Issues:** Create an issue on GitHub
- **Email:** jaquan.earls@thelanternsocial.house
- **Documentation:** See `/docs` directory

---

Happy coding! 🚀
