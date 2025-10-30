# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register BA
```
POST /auth/register
Content-Type: application/json

{
  "email": "ba@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "id": "user-id",
  "email": "ba@example.com",
  "role": "BA",
  "message": "Registration successful. Awaiting admin approval."
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "ba@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user-id",
    "email": "ba@example.com",
    "role": "BA",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "token": "eyJhbGc..."
}
```

---

## BA Panel Endpoints

### Get Profile
```
GET /ba/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "profile-id",
  "userId": "user-id",
  "companyName": "My Company",
  "gstNumber": "18AABCT1234H1Z0",
  "bankName": "HDFC Bank",
  "accountNumber": "1234567890",
  "ifscCode": "HDFC0001234",
  "accountHolderName": "John Doe",
  "kycStatus": "PENDING",
  "totalEarnings": 5000,
  "pendingEarnings": 1000,
  "approvedEarnings": 4000
}
```

### Update Profile
```
PUT /ba/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "My Company",
  "gstNumber": "18AABCT1234H1Z0",
  "bankName": "HDFC Bank",
  "accountNumber": "1234567890",
  "ifscCode": "HDFC0001234",
  "accountHolderName": "John Doe"
}

Response: 200 OK
{ ... updated profile ... }
```

### Get Referral Stats
```
GET /ba/referrals
Authorization: Bearer <token>

Response: 200 OK
{
  "referralCode": "REF-1234567890-ABC123",
  "referralLink": "http://localhost:3000/referral/REF-1234567890-ABC123",
  "totalReferrals": 10,
  "successfulConversions": 8,
  "totalEarnings": 5000,
  "completedTransactions": 8,
  "pendingTransactions": 2
}
```

### Get Withdrawal History
```
GET /ba/withdrawals?limit=10&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "withdrawals": [
    {
      "id": "withdrawal-id",
      "baId": "user-id",
      "amount": 1000,
      "status": "APPROVED",
      "requestedAt": "2024-01-15T10:00:00Z",
      "approvedAt": "2024-01-15T11:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

### Request Withdrawal
```
POST /ba/withdrawals
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}

Response: 201 Created
{
  "id": "withdrawal-id",
  "baId": "user-id",
  "amount": 1000,
  "status": "PENDING",
  "requestedAt": "2024-01-15T10:00:00Z"
}
```

### Get Assigned Coupons
```
GET /ba/coupons
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "assignment-id",
    "couponId": "coupon-id",
    "baId": "user-id",
    "perUserUsageLimit": 5,
    "usageCount": 2,
    "coupon": {
      "code": "SUMMER20",
      "discountPercentage": 20,
      "status": "ACTIVE"
    }
  }
]
```

---

## Admin Panel Endpoints

### Get Pending BAs
```
GET /admin/bas/pending
Authorization: Bearer <admin-token>

Response: 200 OK
[
  {
    "id": "user-id",
    "email": "ba@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "baProfile": {
      "kycStatus": "PENDING",
      "kycDocumentUrl": "..."
    }
  }
]
```

### Approve BA
```
POST /admin/bas/:baId/approve
Authorization: Bearer <admin-token>

Response: 200 OK
{ ... updated profile ... }
```

### Set Commission
```
POST /admin/commission
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "baId": null
}

Response: 200 OK
{
  "id": "setting-id",
  "baId": null,
  "commissionType": "PERCENTAGE",
  "commissionValue": 10,
  "isActive": true
}
```

### Create Coupon
```
POST /admin/coupons
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "code": "SUMMER20",
  "discountPercentage": 20,
  "discountAmount": null,
  "globalUsageLimit": 100,
  "expiryDate": "2024-12-31T23:59:59Z"
}

Response: 201 Created
{ ... coupon ... }
```

### Get Pending Withdrawals
```
GET /admin/withdrawals/pending
Authorization: Bearer <admin-token>

Response: 200 OK
[
  {
    "id": "withdrawal-id",
    "baId": "user-id",
    "amount": 1000,
    "status": "PENDING",
    "ba": {
      "email": "ba@example.com",
      "firstName": "John"
    }
  }
]
```

### Approve Withdrawal
```
POST /admin/withdrawals/:withdrawalId/approve
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "adminNotes": "Approved for processing"
}

Response: 200 OK
{ ... updated withdrawal ... }
```

### Get Dashboard Stats
```
GET /admin/dashboard/stats
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "totalBAs": 50,
  "pendingKYC": 5,
  "pendingWithdrawals": 3,
  "totalPayoutProcessed": 50000
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

