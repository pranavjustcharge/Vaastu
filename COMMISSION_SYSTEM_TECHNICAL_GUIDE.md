# 🔧 Commission System - Technical Implementation Guide

---

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Dashboard                       │
│  - Set commission type (PERCENTAGE/FIXED)               │
│  - Set commission value                                 │
│  - Configure GST percentage                             │
│  - Exclude GST from base option                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Commission API Endpoints                    │
│  - GET /api/commission/info (public)                    │
│  - GET /api/commission/settings (admin)                 │
│  - PUT /api/commission/settings (admin)                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│           CommissionService (Business Logic)            │
│  - getSettings()                                        │
│  - updateSettings()                                     │
│  - calculateCommission()                                │
│  - getCommissionInfo()                                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│         MongoDB Collections                             │
│  - commissionsettings (global/per-BA)                   │
│  - referraltransactions (commission tracking)           │
│  - baprofiles (earnings fields)                         │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              BA Dashboard                               │
│  - View commission structure                            │
│  - View total earnings                                  │
│  - View approved earnings                               │
│  - View referral transactions                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Commission Calculation Flow

### Step 1: Admin Sets Commission
```javascript
// Admin Dashboard
PUT /api/commission/settings
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "gstPercentage": 18,
  "excludeGSTFromBase": true
}
```

### Step 2: Settings Stored in DB
```javascript
// MongoDB: commissionsettings collection
{
  "_id": "uuid",
  "baId": null,  // null = global
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "gstPercentage": 18,
  "excludeGSTFromBase": true,
  "isActive": true,
  "createdAt": "2025-10-30T...",
  "updatedAt": "2025-10-30T..."
}
```

### Step 3: BA Views Commission
```javascript
// BA Dashboard
GET /api/commission/info
// Response:
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "description": "10% of booking value",
  "gstPercentage": 18,
  "excludeGSTFromBase": true
}
```

### Step 4: Booking Completed via Referral
```javascript
// Booking Service calculates commission
const baseAmount = booking.serviceAmount;  // e.g., 10,000
const settings = await commissionService.getSettings();

// Calculate commission
if (settings.commissionType === 'PERCENTAGE') {
  baseCommission = (10000 * 10) / 100 = 1000
} else {
  baseCommission = settings.commissionValue
}

// Calculate GST
if (settings.excludeGSTFromBase) {
  gst = (1000 * 18) / 100 = 180
  totalCommission = 1000 + 180 = 1180
}
```

### Step 5: Transaction Recorded
```javascript
// MongoDB: referraltransactions collection
{
  "_id": "uuid",
  "referrerId": "ba-user-id",
  "referralCode": "BA123456789",
  "customerEmail": "customer@example.com",
  "baseAmount": 10000,
  "baseCommission": 1000,
  "gstAmount": 180,
  "totalCommissionAmount": 1180,
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "gstPercentage": 18,
  "excludeGSTFromBase": true,
  "status": "COMPLETED",
  "createdAt": "2025-10-30T...",
  "updatedAt": "2025-10-30T..."
}
```

### Step 6: BA Earnings Updated
```javascript
// MongoDB: baprofiles collection
{
  "_id": "uuid",
  "userId": "ba-user-id",
  "totalEarnings": 1180,      // Updated
  "approvedEarnings": 0,      // Pending approval
  "pendingEarnings": 1180,    // Pending approval
  ...
}
```

### Step 7: BA Views Earnings
```javascript
// BA Dashboard
GET /api/ba/profile
// Response:
{
  "totalEarnings": 1180,
  "approvedEarnings": 0,
  "pendingEarnings": 1180,
  ...
}
```

---

## 💻 Code Examples

### Example 1: Calculate Commission (10% PERCENTAGE)
```javascript
const transactionAmount = 10000;
const settings = {
  commissionType: 'PERCENTAGE',
  commissionValue: 10,
  gstPercentage: 18,
  excludeGSTFromBase: true
};

// Calculate
const baseCommission = (10000 * 10) / 100 = 1000;
const gst = (1000 * 18) / 100 = 180;
const totalCommission = 1000 + 180 = 1180;

// Result: BA earns ₹1,180
```

### Example 2: Calculate Commission (₹25,000 FIXED)
```javascript
const transactionAmount = 10000;  // Ignored for FIXED
const settings = {
  commissionType: 'FIXED',
  commissionValue: 25000,
  gstPercentage: 18,
  excludeGSTFromBase: true
};

// Calculate
const baseCommission = 25000;
const gst = (25000 * 18) / 100 = 4500;
const totalCommission = 25000 + 4500 = 29500;

// Result: BA earns ₹29,500
```

### Example 3: GST Included in Commission
```javascript
const settings = {
  commissionType: 'PERCENTAGE',
  commissionValue: 10,
  gstPercentage: 18,
  excludeGSTFromBase: false  // GST included
};

// Calculate
const baseCommission = (10000 * 10) / 100 = 1000;
const gst = 0;  // Not calculated separately
const totalCommission = 1000;

// Result: BA earns ₹1,000 (GST already included)
```

---

## 🧪 Testing Commission System

### Test 1: Set Commission to 10% PERCENTAGE
```bash
curl -X PUT http://localhost:3000/api/commission/settings \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "commissionType": "PERCENTAGE",
    "commissionValue": 10,
    "gstPercentage": 18,
    "excludeGSTFromBase": true
  }'
```

### Test 2: Get Commission Info
```bash
curl http://localhost:3000/api/commission/info
```

### Test 3: Create Booking with Referral
```bash
# Booking created with referralCode
# Commission automatically calculated and stored
```

### Test 4: Check BA Earnings
```bash
curl http://localhost:3000/api/ba/profile \
  -H "Authorization: Bearer <ba-token>"
```

---

## 📊 Database Queries

### Get All Commission Settings
```javascript
db.commissionsettings.find({})
```

### Get Global Commission
```javascript
db.commissionsettings.findOne({ baId: null })
```

### Get BA-Specific Commission
```javascript
db.commissionsettings.findOne({ baId: "ba-user-id" })
```

### Get BA Referral Transactions
```javascript
db.referraltransactions.find({ referrerId: "ba-user-id" })
```

### Calculate Total BA Earnings
```javascript
db.referraltransactions.aggregate([
  { $match: { referrerId: "ba-user-id" } },
  { $group: { _id: null, total: { $sum: "$totalCommissionAmount" } } }
])
```

---

## 🚀 Deployment Checklist

- [ ] Commission settings configured in admin dashboard
- [ ] Default commission type set (PERCENTAGE or FIXED)
- [ ] Default commission value set
- [ ] GST percentage configured
- [ ] Test commission calculation with sample booking
- [ ] Verify BA sees commission structure
- [ ] Verify BA earnings display correctly
- [ ] Test withdrawal with commission earnings
- [ ] Monitor referral transactions in database


