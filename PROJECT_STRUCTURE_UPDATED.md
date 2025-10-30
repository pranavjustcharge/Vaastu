# Project Structure - Vaidik Vastu

## 📁 Directory Layout

```
vaidik-vastu/
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment configuration
│   ├── controllers/
│   │   ├── authController.ts      # Auth endpoints
│   │   ├── baController.ts        # BA panel endpoints
│   │   ├── adminController.ts     # Admin panel endpoints
│   │   └── bookingController.ts   # Booking endpoints (NEW)
│   ├── middleware/
│   │   ├── auth.ts                # JWT & role-based auth
│   │   ├── errorHandler.ts        # Global error handler
│   │   └── validation.ts          # Express-validator middleware (NEW)
│   ├── routes/
│   │   ├── auth.ts                # Auth routes
│   │   ├── ba.ts                  # BA routes
│   │   ├── admin.ts               # Admin routes
│   │   └── bookings.ts            # Booking routes (NEW)
│   ├── services/
│   │   ├── authService.ts         # Auth business logic
│   │   ├── baService.ts           # BA business logic
│   │   ├── adminService.ts        # Admin business logic
│   │   └── bookingService.ts      # Booking business logic (NEW)
│   ├── utils/
│   │   ├── auth.ts                # JWT, password hashing
│   │   ├── db.ts                  # Prisma client
│   │   ├── logger.ts              # Winston logger
│   │   └── asyncHandler.ts        # Async error wrapper (NEW)
│   └── index.ts                   # Express app setup
├── prisma/
│   ├── schema.prisma              # Database schema (UPDATED)
│   └── seed.ts                    # Database seeding
├── src/__tests__/
│   ├── auth.test.ts
│   ├── ba.test.ts
│   ├── admin.test.ts
│   └── bookings.test.ts           # Booking tests (NEW)
├── .github/workflows/
│   └── ci.yml                     # CI/CD pipeline
├── Dockerfile                     # Docker image
├── docker-compose.yml             # Docker services
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── jest.config.js                 # Jest config
├── .env.example                   # Environment template
├── .eslintrc.json                 # ESLint config
├── .prettierrc.json               # Prettier config
├── .gitignore                     # Git ignore
├── README.md                      # Main documentation
├── BUSINESS_LOGIC_ANALYSIS.md     # Business model (NEW)
├── VASTU_API_DOCUMENTATION.md     # API docs (NEW)
├── FRONTEND_INTEGRATION_GUIDE.md  # Frontend guide (NEW)
└── PROJECT_STRUCTURE_UPDATED.md   # This file (NEW)

# Frontend Files (Existing)
├── index.html                     # Landing page
├── business_associate.html        # BA program page
├── services.html                  # Services page
├── elite_services.html            # Elite services page
├── contact.html                   # Contact page
├── script.js                      # Frontend JS (to be updated)
└── assets/
    ├── css/
    │   ├── bootstrap.css
    │   ├── font.css
    │   └── style.css
    ├── images/
    │   ├── vastu_logo.png
    │   ├── vastu_chakra.png
    │   ├── hand.png
    │   └── ... (other images)
    └── js/
        ├── plugin/
        │   ├── slick/
        │   ├── select2/
        │   └── airdatepicker/
        └── ... (other JS files)
```

---

## 🗄️ Database Schema

### Core Models

**User**
- id, email, password, role (ADMIN/BA)
- firstName, lastName, phone
- createdAt, updatedAt

**BAProfile**
- id, userId (FK)
- companyName, gstNumber
- bankName, accountNumber, ifscCode, accountHolderName
- kycStatus (PENDING/APPROVED/REJECTED)
- totalEarnings, pendingEarnings, approvedEarnings

**ReferralCode**
- id, userId (FK)
- code (unique), referralLink (unique)
- isActive, totalReferrals, successfulConversions

**ReferralTransaction**
- id, referrerId (FK), referralCode
- customerEmail, commissionAmount
- commissionType, commissionValue, status

**CommissionSetting**
- id, baId (FK, nullable)
- commissionType, commissionValue, isActive

**CouponCode**
- id, code (unique)
- discountPercentage, discountAmount
- status (ACTIVE/INACTIVE/EXPIRED)
- globalUsageLimit, globalUsageCount, expiryDate

**CouponAssignment**
- id, couponId (FK), baId (FK)
- perUserUsageLimit, usageCount

**WithdrawalRequest**
- id, baId (FK)
- amount, status (PENDING/APPROVED/REJECTED/COMPLETED)
- requestedAt, approvedAt, completedAt, adminNotes

**Booking** (NEW)
- id, clientName, clientEmail, clientPhone
- serviceType (BUSINESS_VASTU/RESIDENTIAL_VASTU/HEALING_SESSION/LAND_ENERGY)
- description, preferredDate, preferredTime
- referralCode, referrerId, couponCode
- discountApplied, status (PENDING/CONFIRMED/COMPLETED/CANCELLED)
- adminNotes, createdAt, updatedAt

---

## 🔄 API Endpoints

### Authentication (5 endpoints)
- POST `/auth/register` - Register user
- POST `/auth/login` - Login user
- POST `/auth/refresh` - Refresh token
- POST `/auth/logout` - Logout user
- GET `/auth/me` - Get current user

### Bookings (6 endpoints) - NEW
- POST `/bookings` - Create booking (public)
- GET `/bookings/:id` - Get booking details
- GET `/bookings/ba/my-bookings` - BA's bookings
- GET `/bookings/admin/all` - All bookings (admin)
- PATCH `/bookings/admin/:id` - Update booking (admin)
- GET `/bookings/admin/stats` - Booking stats (admin)

### BA Panel (7 endpoints)
- GET `/ba/dashboard` - Dashboard overview
- GET `/ba/profile` - Get BA profile
- PATCH `/ba/profile` - Update BA profile
- GET `/ba/referrals` - Referral stats
- POST `/ba/withdrawals` - Request withdrawal
- GET `/ba/withdrawals` - Withdrawal history
- GET `/ba/coupons` - Assigned coupons

### Admin Panel (11 endpoints)
- GET `/admin/bas` - List all BAs
- POST `/admin/approve-ba/:baId` - Approve BA
- PATCH `/admin/ba/:baId` - Update BA status
- POST `/admin/commission` - Set commission
- GET `/admin/commission` - Get commission settings
- POST `/admin/coupons` - Create coupon
- GET `/admin/coupons` - List coupons
- PATCH `/admin/coupons/:id` - Update coupon
- GET `/admin/withdrawals` - Pending withdrawals
- PATCH `/admin/withdrawals/:id` - Approve/reject withdrawal
- GET `/admin/dashboard` - Admin dashboard stats

**Total: 29 endpoints**

---

## 🔐 Authentication Flow

1. User registers with email/password
2. Password hashed with bcryptjs
3. User created with role (ADMIN/BA)
4. Login generates JWT tokens:
   - Access token (24h expiry)
   - Refresh token (7d expiry)
5. Protected routes check JWT in Authorization header
6. Role-based middleware enforces permissions

---

## 🏗️ Architecture Layers

### Controllers
- Handle HTTP requests/responses
- Validate input
- Call services
- Return formatted responses

### Services
- Business logic
- Database operations via Prisma
- Error handling
- Data transformation

### Middleware
- Authentication (JWT verification)
- Authorization (role checks)
- Validation (express-validator)
- Error handling (global)

### Routes
- Define endpoints
- Apply middleware
- Call controllers

### Utils
- Database client (Prisma)
- Logger (Winston)
- Auth helpers (JWT, password)
- Async handler wrapper

---

## 📊 Key Features

### BA Program
✓ Registration & approval workflow
✓ KYC verification
✓ Unique referral codes
✓ Commission tracking
✓ Withdrawal requests
✓ Coupon assignments

### Booking System
✓ Service type selection
✓ Date & time slots
✓ Referral code tracking
✓ Coupon code application
✓ Status management
✓ Admin confirmation

### Admin Controls
✓ BA management
✓ Commission settings
✓ Coupon management
✓ Withdrawal approvals
✓ Booking management
✓ Statistics & reports

---

## 🚀 Deployment

### Docker
- Multi-stage build
- Non-root user
- Health checks
- Graceful shutdown

### CI/CD
- GitHub Actions
- Lint & format checks
- Unit & integration tests
- Security scans
- Build & push to registry

### Database
- PostgreSQL
- Prisma migrations
- Connection pooling
- Query logging

---

## 📝 Configuration

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@localhost:5432/vastu
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

---

## 🧪 Testing

### Unit Tests
- Service layer logic
- Utility functions
- Error handling

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### Coverage
- Minimum 50% threshold
- Focus on critical paths
- Mock external services

---

## 📚 Documentation

- **README.md** - Setup & overview
- **BUSINESS_LOGIC_ANALYSIS.md** - Business model
- **VASTU_API_DOCUMENTATION.md** - API reference
- **FRONTEND_INTEGRATION_GUIDE.md** - Frontend setup
- **PROJECT_STRUCTURE_UPDATED.md** - This file
- **PRODUCTION_CHECKLIST.md** - Pre-deployment tasks

---

## ✅ Status

- [x] Backend structure created
- [x] Database schema designed
- [x] Authentication implemented
- [x] BA panel APIs created
- [x] Admin panel APIs created
- [x] Booking system added (NEW)
- [x] Docker setup configured
- [x] CI/CD pipeline created
- [x] Documentation completed
- [ ] Frontend integration (in progress)
- [ ] Testing & QA
- [ ] Production deployment

