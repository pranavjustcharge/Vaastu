# Business Logic Analysis - Vaidik Vastu

## 🎯 Core Business Model

**Vaidik Vastu** is a Vastu Shastra (ancient Indian architecture science) consulting business offering energy healing and space optimization services.

### Primary Services:
1. **Business Vastu Consultation** - Land & workplace energy correction
2. **Residential Vastu Healing** - Home energy alignment
3. **Sidha Energy Healing Sessions** - One-on-one personal healing
4. **Land Energy Diagnosis & Correction** - Pre/post-construction land analysis

---

## 💼 Business Associate (BA) Program

### BA Role:
- **Referral Partners** who bring clients to the business
- Earn **commissions** on successful referrals
- Manage their own **referral codes** and **tracking**
- Request **withdrawals** of earned commissions
- Use **coupon codes** to offer discounts to clients

### BA Workflow:
1. **Registration** → Awaits admin approval
2. **KYC Verification** → Bank details + identity documents
3. **Approval** → Gets referral code + dashboard access
4. **Referral** → Shares code with potential clients
5. **Tracking** → Monitors conversions and earnings
6. **Withdrawal** → Requests payout (admin approves)

---

## 💰 Commission Structure

### Types:
- **Percentage-based**: 10-20% of service value
- **Fixed amount**: Flat fee per referral

### Levels:
- **Global Commission**: Default for all BAs
- **Per-BA Commission**: Custom rates for top performers

### Calculation:
```
Commission = Service Price × Commission Rate
OR
Commission = Fixed Amount per Referral
```

---

## 🎟️ Coupon Management

### Admin Creates Coupons:
- Discount percentage or fixed amount
- Global usage limit
- Expiry date
- Specific BA assignments

### BA Uses Coupons:
- Share with referred clients
- Track usage per client
- Per-user usage limits

### Client Benefits:
- Discount on services
- Incentive to book

---

## 📅 Booking System

### Service Booking Flow:
1. **Client selects service** (Business/Residential/Healing/Land)
2. **Chooses date & time slot**
3. **Enters contact details**
4. **Applies coupon code** (optional)
5. **Submits booking**

### Booking Data:
- Name, Email, Phone
- Service type
- Preferred date & time
- Issue description
- Coupon applied (if any)

---

## 👥 User Roles

### Admin:
- Approve/reject BA registrations
- Set commission rates
- Create & manage coupons
- Approve/reject withdrawals
- View all statistics

### BA (Business Associate):
- Register & get approved
- View referral stats
- Request withdrawals
- Share referral codes
- Use assigned coupons

### Client:
- Book services
- Apply coupon codes
- Provide contact info

---

## 📊 Key Metrics

### For BA:
- Total referrals
- Successful conversions
- Total earnings
- Pending earnings
- Approved earnings
- Withdrawal history

### For Admin:
- Total BAs
- Pending KYC approvals
- Pending withdrawals
- Total payout processed
- Commission rates

---

## 🔄 Data Flow

```
Client Books Service
    ↓
Referral Code Captured
    ↓
Referral Transaction Created
    ↓
Commission Calculated
    ↓
BA Earnings Updated
    ↓
BA Requests Withdrawal
    ↓
Admin Approves/Rejects
    ↓
Payout Processed
```

---

## 🗄️ Database Entities

### Core:
- **User** - Admin/BA accounts
- **BAProfile** - BA details (bank, KYC)
- **ReferralCode** - Auto-generated codes
- **ReferralTransaction** - Earnings records

### Configuration:
- **CommissionSetting** - Rates (global/per-BA)
- **CouponCode** - Discount codes
- **CouponAssignment** - BA-specific coupons

### Operations:
- **WithdrawalRequest** - Payout requests
- **Booking** - Service bookings (future)

---

## 🎯 Key Features

### BA Panel:
✓ Dashboard with earnings overview
✓ Referral code & link
✓ Referral statistics
✓ Withdrawal requests
✓ Coupon management
✓ Profile management (bank, KYC)

### Admin Panel:
✓ BA management (approve/reject)
✓ Commission settings
✓ Coupon management
✓ Withdrawal management
✓ Dashboard statistics
✓ KYC tracking

### API Endpoints:
✓ Authentication (register, login)
✓ BA profile management
✓ Referral tracking
✓ Withdrawal workflow
✓ Coupon management
✓ Admin controls

---

## 💡 Business Logic Rules

1. **BA Registration**: Requires admin approval before access
2. **KYC**: Must be verified before withdrawal requests
3. **Commission**: Calculated on booking confirmation
4. **Withdrawal**: Only from approved earnings
5. **Coupons**: Can be assigned to specific BAs
6. **Referral Code**: Auto-generated, unique per BA
7. **Earnings**: Tracked as pending → approved → withdrawn

---

## 🔐 Security & Compliance

- JWT authentication
- Role-based access control
- Bank details encryption
- KYC document storage
- Audit trail for withdrawals
- Commission rate versioning

---

## 📈 Growth Opportunities

- Tiered commission rates
- Performance bonuses
- Referral leaderboards
- Automated payouts
- Multi-currency support
- API for BA integrations

