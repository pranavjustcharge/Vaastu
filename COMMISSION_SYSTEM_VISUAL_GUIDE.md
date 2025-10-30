# 📊 Commission System - Visual Guide

---

## 🎨 Admin Dashboard - Commission Settings

```
┌─────────────────────────────────────────────────────────┐
│  ⚙️ Commission Settings                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Current Commission Structure                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 10% of booking value                             │  │
│  │ GST (18%) is calculated on top of commission     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Commission Type *                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Percentage (%)                                   │  │
│  │ Fixed Amount (₹)                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Commission Value *                                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 10                                               │ % │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  GST Percentage (%)                                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 18                                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ☑ Exclude GST from base commission                     │
│  If checked, GST is calculated on top of commission    │
│                                                          │
│  [💾 Save Settings]  [↻ Reset]                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 BA Dashboard - Commission & Earnings

```
┌─────────────────────────────────────────────────────────┐
│  BA Dashboard                                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Stats                                                  │
│  ┌──────────────┬──────────────┬──────────────┐        │
│  │ Total        │ Approved     │ Total        │        │
│  │ Earnings     │ Earnings     │ Referrals    │        │
│  │              │              │              │        │
│  │ ₹1,180       │ ₹500         │ 5            │        │
│  └──────────────┴──────────────┴──────────────┘        │
│                                                          │
│  💰 Commission Structure                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ You earn 10% of the booking value for each       │  │
│  │ successful referral.                             │  │
│  │                                                  │  │
│  │ GST (18%) is calculated on top of your          │  │
│  │ commission.                                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  🔗 Your Referral Link                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ https://www.vaidikvaastu.com/business_associate │  │
│  │ .html?ref=BA123456789                            │  │
│  └──────────────────────────────────────────────────┘  │
│  [📋 Copy Link]                                         │
│  Referral Code: BA123456789                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Commission Calculation Flow

### PERCENTAGE-Based (10%)

```
Booking Amount: ₹10,000
Commission Type: PERCENTAGE
Commission Value: 10%
GST Percentage: 18%
Exclude GST from Base: true

CALCULATION:
┌─────────────────────────────────────────┐
│ Base Commission = 10,000 × (10 / 100)   │
│                = ₹1,000                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ GST = 1,000 × (18 / 100)                │
│     = ₹180                              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Total Commission = 1,000 + 180          │
│                 = ₹1,180                │
└─────────────────────────────────────────┘

RESULT: BA earns ₹1,180
```

### FIXED-Amount (₹25,000)

```
Booking Amount: ₹10,000 (ignored)
Commission Type: FIXED
Commission Value: ₹25,000
GST Percentage: 18%
Exclude GST from Base: true

CALCULATION:
┌─────────────────────────────────────────┐
│ Base Commission = ₹25,000               │
│ (Fixed amount, booking amount ignored)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ GST = 25,000 × (18 / 100)               │
│     = ₹4,500                            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ Total Commission = 25,000 + 4,500       │
│                 = ₹29,500               │
└─────────────────────────────────────────┘

RESULT: BA earns ₹29,500
```

---

## 📊 Data Flow Diagram

```
ADMIN SIDE                          BA SIDE
─────────────────────────────────────────────────

Admin Dashboard                     BA Dashboard
      │                                  │
      │ Sets Commission                  │ Views Commission
      │ (10% PERCENTAGE)                 │
      │                                  │
      ▼                                  ▼
PUT /api/commission/settings    GET /api/commission/info
      │                                  │
      └──────────────┬───────────────────┘
                     │
                     ▼
            CommissionService
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    getSettings  calculateCommission  getCommissionInfo
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
            MongoDB Collections
        ┌─────────────────────────┐
        │ commissionsettings      │
        │ referraltransactions    │
        │ baprofiles              │
        └─────────────────────────┘
```

---

## 💾 Database Structure

### CommissionSetting Collection
```
{
  _id: "uuid",
  baId: null,                    ← null = global
  commissionType: "PERCENTAGE",  ← or "FIXED"
  commissionValue: 10,           ← percentage or amount
  isActive: true,
  createdAt: Date,
  updatedAt: Date
}
```

### ReferralTransaction Collection
```
{
  _id: "uuid",
  referrerId: "ba-user-id",
  referralCode: "BA123456789",
  customerEmail: "customer@example.com",
  baseAmount: 10000,
  baseCommission: 1000,
  gstAmount: 180,
  totalCommissionAmount: 1180,
  commissionType: "PERCENTAGE",
  commissionValue: 10,
  gstPercentage: 18,
  excludeGSTFromBase: true,
  status: "COMPLETED",
  createdAt: Date,
  updatedAt: Date
}
```

### BAProfile Collection (Earnings)
```
{
  _id: "uuid",
  userId: "ba-user-id",
  totalEarnings: 1180,      ← All earnings
  approvedEarnings: 500,    ← Approved for withdrawal
  pendingEarnings: 680,     ← Pending approval
  ...
}
```

---

## 🔌 API Endpoints

### 1. Get Commission Info (Public)
```
GET /api/commission/info

Response:
{
  "data": {
    "commissionType": "PERCENTAGE",
    "commissionValue": 10,
    "description": "10% of booking value",
    "gstPercentage": 18,
    "excludeGSTFromBase": true
  }
}
```

### 2. Get Commission Settings (Admin)
```
GET /api/commission/settings
Authorization: Bearer <admin-token>

Response: Same as above
```

### 3. Update Commission Settings (Admin)
```
PUT /api/commission/settings
Authorization: Bearer <admin-token>
Content-Type: application/json

Request:
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "gstPercentage": 18,
  "excludeGSTFromBase": true
}

Response: Updated settings
```

### 4. Set Commission for BA (Admin)
```
POST /api/admin/commission-settings
Authorization: Bearer <admin-token>
Content-Type: application/json

Request:
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "baId": null  ← null = global, or BA user ID
}

Response: Created/Updated setting
```

---

## ✅ Status Indicators

### Commission Types
```
✅ PERCENTAGE  - Percentage of booking value
✅ FIXED       - Fixed amount per referral
```

### GST Options
```
✅ Exclude GST from Base
   └─ GST calculated on top of commission
   └─ Example: ₹1,000 + ₹180 GST = ₹1,180

✅ Include GST in Base
   └─ GST already included in commission
   └─ Example: ₹1,000 (GST included)
```

### Transaction Status
```
✅ PENDING    - Awaiting approval
✅ COMPLETED  - Approved and recorded
✅ FAILED     - Transaction failed
```

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| Default Commission Type | PERCENTAGE |
| Default Commission Value | 10% |
| Default GST | 18% |
| Exclude GST from Base | true |
| Min Commission Value | 0 |
| Max Commission % | 100 |
| Min GST % | 0 |
| Max GST % | 100 |


