# Vaidik Vastu - API Documentation

## 🎯 Overview

Complete REST API for Vaidik Vastu - a Vastu Shastra consulting platform with Business Associate (BA) referral program.

**Base URL**: `http://localhost:3000/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Booking System](#booking-system)
3. [BA Panel APIs](#ba-panel-apis)
4. [Admin Panel APIs](#admin-panel-apis)
5. [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register
**POST** `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "role": "BA"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "BA"
  }
}
```

### Login
**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "BA"
    }
  }
}
```

---

## 📅 Booking System

### Create Booking (Public)
**POST** `/bookings`

```json
{
  "clientName": "Rajesh Kumar",
  "clientEmail": "rajesh@example.com",
  "clientPhone": "+919876543210",
  "serviceType": "BUSINESS_VASTU",
  "description": "Business is slow, need energy scan",
  "preferredDate": "2024-12-15",
  "preferredTime": "10:00 AM",
  "referralCode": "BA_REF_CODE_123",
  "couponCode": "SAVE20"
}
```

**Service Types**:
- `BUSINESS_VASTU` - Business consultation
- `RESIDENTIAL_VASTU` - Home healing
- `HEALING_SESSION` - Personal energy healing
- `LAND_ENERGY` - Land diagnosis

**Response** (201):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking_id",
    "clientName": "Rajesh Kumar",
    "serviceType": "BUSINESS_VASTU",
    "preferredDate": "2024-12-15",
    "preferredTime": "10:00 AM",
    "status": "PENDING",
    "discountApplied": 20,
    "createdAt": "2024-10-23T10:00:00Z"
  }
}
```

### Get Booking Details
**GET** `/bookings/:id`

**Response** (200):
```json
{
  "success": true,
  "message": "Booking retrieved successfully",
  "data": {
    "id": "booking_id",
    "clientName": "Rajesh Kumar",
    "clientEmail": "rajesh@example.com",
    "serviceType": "BUSINESS_VASTU",
    "status": "PENDING",
    "preferredDate": "2024-12-15",
    "preferredTime": "10:00 AM",
    "discountApplied": 20
  }
}
```

---

## 👥 BA Panel APIs

### Get BA Dashboard
**GET** `/ba/dashboard`
**Auth**: Required (BA role)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "profile": {
      "totalEarnings": 50000,
      "pendingEarnings": 10000,
      "approvedEarnings": 40000
    },
    "referralCode": "BA_REF_CODE_123",
    "referralLink": "https://vastu.com?ref=BA_REF_CODE_123",
    "stats": {
      "totalReferrals": 25,
      "successfulConversions": 15,
      "conversionRate": "60%"
    }
  }
}
```

### Get BA Bookings
**GET** `/bookings/ba/my-bookings`
**Auth**: Required (BA role)

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "booking_id",
      "clientName": "Rajesh Kumar",
      "serviceType": "BUSINESS_VASTU",
      "status": "CONFIRMED",
      "preferredDate": "2024-12-15"
    }
  ],
  "count": 1
}
```

### Request Withdrawal
**POST** `/ba/withdrawals`
**Auth**: Required (BA role)

```json
{
  "amount": 10000
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Withdrawal request created",
  "data": {
    "id": "withdrawal_id",
    "amount": 10000,
    "status": "PENDING",
    "requestedAt": "2024-10-23T10:00:00Z"
  }
}
```

### Get BA Profile
**GET** `/ba/profile`
**Auth**: Required (BA role)

### Update BA Profile
**PATCH** `/ba/profile`
**Auth**: Required (BA role)

```json
{
  "companyName": "My Vastu Services",
  "bankName": "HDFC Bank",
  "accountNumber": "1234567890",
  "ifscCode": "HDFC0001234",
  "accountHolderName": "John Doe"
}
```

---

## 🛠️ Admin Panel APIs

### Get All Bookings
**GET** `/bookings/admin/all?serviceType=BUSINESS_VASTU&status=PENDING`
**Auth**: Required (Admin role)

**Query Parameters**:
- `serviceType` - Filter by service type
- `status` - Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- `startDate` - Filter from date
- `endDate` - Filter to date

### Update Booking Status
**PATCH** `/bookings/admin/:id`
**Auth**: Required (Admin role)

```json
{
  "status": "CONFIRMED",
  "adminNotes": "Scheduled for Dec 15"
}
```

### Get Booking Statistics
**GET** `/bookings/admin/stats`
**Auth**: Required (Admin role)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": [
      { "status": "PENDING", "_count": 30 },
      { "status": "CONFIRMED", "_count": 80 },
      { "status": "COMPLETED", "_count": 40 }
    ],
    "byService": [
      { "serviceType": "BUSINESS_VASTU", "_count": 60 },
      { "serviceType": "RESIDENTIAL_VASTU", "_count": 50 }
    ]
  }
}
```

### Approve BA Registration
**POST** `/admin/approve-ba/:baId`
**Auth**: Required (Admin role)

### Set Commission Rate
**POST** `/admin/commission`
**Auth**: Required (Admin role)

```json
{
  "baId": "ba_user_id",
  "commissionType": "PERCENTAGE",
  "commissionValue": 15
}
```

### Create Coupon
**POST** `/admin/coupons`
**Auth**: Required (Admin role)

```json
{
  "code": "SAVE20",
  "discountPercentage": 20,
  "globalUsageLimit": 100,
  "expiryDate": "2024-12-31"
}
```

### Approve Withdrawal
**PATCH** `/admin/withdrawals/:withdrawalId`
**Auth**: Required (Admin role)

```json
{
  "status": "APPROVED",
  "adminNotes": "Processed"
}
```

---

## ❌ Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

**Common Status Codes**:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## 🔑 Authentication Headers

Include JWT token in all protected endpoints:

```
Authorization: Bearer <access_token>
```

---

## 📊 Data Models

### Booking
- `id` - Unique identifier
- `clientName` - Client name
- `clientEmail` - Client email
- `clientPhone` - Client phone
- `serviceType` - Type of service
- `preferredDate` - Booking date
- `preferredTime` - Booking time (HH:MM AM/PM)
- `referralCode` - BA referral code (optional)
- `couponCode` - Discount coupon (optional)
- `status` - PENDING, CONFIRMED, COMPLETED, CANCELLED
- `discountApplied` - Discount amount

### BA Profile
- `totalEarnings` - Total commission earned
- `pendingEarnings` - Pending commission
- `approvedEarnings` - Approved commission
- `kycStatus` - PENDING, APPROVED, REJECTED
- `bankDetails` - Bank account info

---

## 🚀 Example Workflows

### BA Referral Flow
1. BA registers and gets approved
2. BA gets referral code
3. BA shares referral link with clients
4. Client books service using referral code
5. Admin confirms booking
6. Commission calculated and added to BA earnings
7. BA requests withdrawal
8. Admin approves withdrawal

### Client Booking Flow
1. Client visits website
2. Selects service type
3. Chooses date and time
4. Enters contact details
5. Applies coupon code (optional)
6. Submits booking
7. Booking status: PENDING
8. Admin reviews and confirms
9. Booking status: CONFIRMED

---

## 📞 Support

For API issues, contact: `support@vaidikvaastu.com`

