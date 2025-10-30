# BA & Admin Dashboard Backend

Production-ready Node.js/TypeScript backend for Business Associate (BA) and Admin Dashboard system with referral management, commission tracking, and withdrawal processing.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database:**
```bash
npm run migrate:dev
npm run seed
```

4. **Start development server:**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Docker Deployment

```bash
docker-compose up -d
```

This starts PostgreSQL and the application with automatic migrations and seeding.

## 📋 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new BA
- `POST /login` - Login (BA or Admin)
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user (requires auth)

### BA Panel (`/api/ba`)
- `GET /profile` - Get BA profile
- `PUT /profile` - Update profile (bank, KYC details)
- `GET /referrals` - Get referral stats
- `GET /withdrawals` - Get withdrawal history
- `POST /withdrawals` - Request withdrawal
- `GET /coupons` - Get assigned coupons
- `GET /coupons/:couponId` - Get coupon details

### Admin Panel (`/api/admin`)
- `GET /bas/pending` - Get pending BA approvals
- `POST /bas/:baId/approve` - Approve BA
- `POST /bas/:baId/reject` - Reject BA
- `POST /commission` - Set commission (global or per-BA)
- `GET /commission` - Get commission settings
- `POST /coupons` - Create coupon
- `POST /coupons/assign` - Assign coupon to BA
- `GET /withdrawals/pending` - Get pending withdrawals
- `POST /withdrawals/:withdrawalId/approve` - Approve withdrawal
- `POST /withdrawals/:withdrawalId/reject` - Reject withdrawal
- `GET /dashboard/stats` - Get dashboard statistics

## 🏗️ Architecture

```
src/
├── config/          # Configuration management
├── controllers/     # Request handlers
├── middleware/      # Auth, error handling
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helpers (auth, db, logger)
└── __tests__/       # Unit tests
```

## 🗄️ Database Schema

### Core Models
- **User** - Base user model (Admin/BA)
- **BAProfile** - Extended BA info (bank, KYC)
- **ReferralCode** - Auto-generated referral codes
- **ReferralTransaction** - Referral earnings tracking
- **CommissionSetting** - Global/per-BA commission rates
- **CouponCode** - Coupon management
- **CouponAssignment** - BA-specific coupon assignments
- **WithdrawalRequest** - Withdrawal request tracking

## 🔐 Authentication

JWT-based authentication with:
- Access tokens (24h expiry)
- Refresh tokens (7d expiry)
- Role-based access control (ADMIN/BA)

**Example Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ba@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user-id",
    "email": "ba@example.com",
    "role": "BA"
  }
}
```

## 📊 Key Features

### BA Features
- Auto-generated referral codes and links
- Real-time referral stats (conversions, earnings)
- Commission tracking (percentage or fixed)
- Profile management (personal, bank, KYC)
- Withdrawal requests with approval workflow
- Assigned coupon management

### Admin Features
- BA registration approval/rejection
- Commission settings (global or per-BA)
- Coupon creation and assignment
- Withdrawal request management
- Dashboard with key metrics
- KYC document tracking

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

## 📦 Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm start                # Run production build
npm run migrate          # Run migrations
npm run migrate:dev      # Create new migration
npm run seed             # Seed database
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run prisma:studio    # Open Prisma Studio
```

## 🔧 Configuration

Key environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing key
- `JWT_REFRESH_SECRET` - Refresh token signing key
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origins

## 📝 Default Admin Credentials

After seeding:
- Email: `admin@example.com`
- Password: `ChangeMe123!`

**⚠️ Change these immediately in production!**

## 🚀 Production Deployment

See `PRODUCTION_CHECKLIST.md` for pre-deployment tasks.

### Key Steps:
1. Set strong JWT secrets
2. Configure PostgreSQL with SSL
3. Enable HTTPS
4. Setup monitoring and logging
5. Configure backup strategy
6. Run security audit
7. Load test the system

## 📚 API Documentation

Full OpenAPI/Swagger spec available at `/api/docs` (when enabled).

## 🤝 Contributing

Follow these conventions:
- Use TypeScript strict mode
- Write tests for new features
- Follow SOLID principles
- Use meaningful commit messages

## 📄 License

MIT

