# ⚡ Quick Reference - Vaidik Vastu Backend

## 🚀 Server Status

```
✅ RUNNING on http://localhost:3000
✅ MongoDB Connected
✅ All Systems Operational
```

---

## 🔐 Admin Login

**Email**: `admin@example.com`  
**Password**: `ChangeMe123!`

### Login Command

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "ChangeMe123!"
  }'
```

---

## 📊 Key Endpoints

### Health Check
```bash
GET http://localhost:3000/health
```

### Create Booking
```bash
POST http://localhost:3000/api/bookings
Content-Type: application/json

{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "+919876543210",
  "serviceType": "BUSINESS_VASTU",
  "preferredDate": "2024-12-15",
  "preferredTime": "10:00 AM"
}
```

### Get All Bookings (Admin)
```bash
GET http://localhost:3000/api/bookings/admin/all
Authorization: Bearer {ACCESS_TOKEN}
```

### Update Booking (Admin)
```bash
PATCH http://localhost:3000/api/bookings/admin/{BOOKING_ID}
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "status": "CONFIRMED",
  "adminNotes": "Approved"
}
```

---

## 🎯 Service Types

- `BUSINESS_VASTU` - Business Vastu Consultation
- `RESIDENTIAL_VASTU` - Residential Vastu Healing
- `HEALING_SESSION` - Sidha Energy Healing Sessions
- `LAND_ENERGY` - Land Energy Diagnosis & Correction

---

## 📋 Booking Statuses

- `PENDING` - Awaiting admin review
- `CONFIRMED` - Approved by admin
- `COMPLETED` - Service completed
- `CANCELLED` - Booking cancelled

---

## 🔑 JWT Token

After login, you'll receive:
- `accessToken` - Use in Authorization header (expires in 24h)
- `refreshToken` - Use to get new access token (expires in 7d)

### Using Token

```bash
Authorization: Bearer {accessToken}
```

---

## 📁 Database

**Type**: MongoDB  
**URL**: `mongodb://localhost:27017/vastu_db`  
**Collections**: 9 (users, bookings, referrals, etc.)

---

## 🛠️ Commands

```bash
# Start server
npm run dev

# Build
npm run build

# Start production
npm start

# Tests
npm test

# Lint
npm run lint
```

---

## 📞 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

---

## 🎓 Common HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📊 Admin Dashboard Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/bas` | GET | List all BAs |
| `/api/admin/dashboard` | GET | Dashboard stats |
| `/api/admin/withdrawals` | GET | Withdrawal requests |
| `/api/admin/coupons` | GET | Coupon codes |
| `/api/admin/commission` | GET | Commission settings |

---

## 🎯 BA Dashboard Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ba/dashboard` | GET | BA dashboard |
| `/api/ba/profile` | GET | BA profile |
| `/api/ba/referrals` | GET | Referral stats |
| `/api/ba/withdrawals` | GET | Withdrawal history |

---

## 🚀 Testing Workflow

1. **Login as Admin**
   ```bash
   POST /api/auth/login
   ```

2. **Create a Booking**
   ```bash
   POST /api/bookings
   ```

3. **View Booking**
   ```bash
   GET /api/bookings/{id}
   ```

4. **Approve Booking (Admin)**
   ```bash
   PATCH /api/bookings/admin/{id}
   ```

5. **Check Stats (Admin)**
   ```bash
   GET /api/bookings/admin/stats
   ```

---

## 💡 Tips

- All dates should be in ISO8601 format: `YYYY-MM-DD`
- All times should be in format: `HH:MM AM/PM`
- Phone numbers should include country code: `+91...`
- Keep JWT tokens secure
- Refresh tokens before they expire

---

## 🔗 Useful Links

- **API Docs**: See `VASTU_API_DOCUMENTATION.md`
- **Business Logic**: See `BUSINESS_LOGIC_ANALYSIS.md`
- **Full Credentials**: See `ADMIN_CREDENTIALS.md`
- **Implementation**: See `IMPLEMENTATION_STATUS.md`

---

**Last Updated**: 2024-10-24  
**Status**: ✅ LIVE & RUNNING

