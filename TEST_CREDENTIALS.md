# 🔐 TEST CREDENTIALS & DEMO DATA

## 🌐 Quick Access

| Item | URL |
|------|-----|
| **Login Page** | http://localhost:5000/login.html |
| **Admin Dashboard** | http://localhost:5000/admin-dashboard.html |
| **BA Dashboard** | http://localhost:5000/ba-dashboard.html |
| **Backend API** | http://localhost:3000 |

---

## 👤 ADMIN ACCOUNT

```
Email:    admin@example.com
Password: ChangeMe123!
Role:     ADMIN
```

**Dashboard Access**: http://localhost:5000/admin-dashboard.html

**Features**:
- View all bookings
- Approve/Reject BAs
- Process withdrawals
- Manage commissions
- Create coupons
- View statistics

---

## 👥 BA (BUSINESS ASSOCIATE) ACCOUNT

```
Email:    ba@example.com
Password: BA123456!
Role:     BA
Name:     Rajesh Kumar
```

**Dashboard Access**: http://localhost:5000/ba-dashboard.html

**Features**:
- View earnings (₹15,000 total)
- View referral bookings (3 bookings)
- Request withdrawals
- View assigned coupons
- Track referral code

---

## 📊 DEMO DATA SUMMARY

### Bookings (3)
| Client | Service | Status | Amount | Commission |
|--------|---------|--------|--------|------------|
| Amit Sharma | Business Vastu | CONFIRMED | ₹5,000 | ₹500 |
| Priya Patel | Residential Vastu | PENDING | ₹3,000 | ₹300 |
| Vikram Singh | Healing Session | COMPLETED | ₹2,000 | ₹200 |

### Earnings
- **Total Earnings**: ₹15,000
- **Approved Earnings**: ₹10,000
- **Pending Earnings**: ₹5,000

### Withdrawals (2)
| Amount | Status |
|--------|--------|
| ₹5,000 | APPROVED |
| ₹3,000 | PENDING |

### Coupons (2)
| Code | Discount | Status |
|------|----------|--------|
| VASTU10 | 10% | Active |
| HEALING20 | 20% | Active |

### KYC Status
- **Status**: APPROVED
- **Bank Account**: 1234567890
- **IFSC Code**: SBIN0001234

---

## 🧪 QUICK TEST STEPS

### 1. Test Admin Panel
```
1. Go to http://localhost:5000/login.html
2. Enter: admin@example.com / ChangeMe123!
3. Click Login
4. View Admin Dashboard
5. Check statistics and data
```

### 2. Test BA Panel
```
1. Logout from Admin
2. Go to http://localhost:5000/login.html
3. Enter: ba@example.com / BA123456!
4. Click Login
5. View BA Dashboard
6. Check earnings and bookings
```

---

## 🔧 API TESTING

### Login (Get Token)
```bash
# Admin Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "ChangeMe123!"
  }'

# BA Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ba@example.com",
    "password": "BA123456!"
  }'
```

### Admin Endpoints
```bash
# Get Dashboard
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <token>"

# Get Pending Withdrawals
curl -X GET http://localhost:3000/api/admin/pending-withdrawals \
  -H "Authorization: Bearer <token>"

# Approve Withdrawal
curl -X POST http://localhost:3000/api/admin/approve-withdrawal/<id> \
  -H "Authorization: Bearer <token>"
```

### BA Endpoints
```bash
# Get Profile
curl -X GET http://localhost:3000/api/ba/profile \
  -H "Authorization: Bearer <token>"

# Get Bookings
curl -X GET http://localhost:3000/api/ba/bookings \
  -H "Authorization: Bearer <token>"

# Request Withdrawal
curl -X POST http://localhost:3000/api/ba/request-withdrawal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount": 2000}'
```

---

## 📋 WHAT TO TEST

### Admin Panel
- [ ] Login works
- [ ] Dashboard shows 3 bookings
- [ ] Dashboard shows 1 pending withdrawal
- [ ] Can view BA profiles
- [ ] Can approve/reject withdrawals
- [ ] Can manage commissions
- [ ] Can create coupons

### BA Panel
- [ ] Login works
- [ ] Dashboard shows ₹15,000 earnings
- [ ] Dashboard shows 3 referral bookings
- [ ] Can view withdrawal history
- [ ] Can request new withdrawal
- [ ] Can view assigned coupons
- [ ] Can see referral code

### API
- [ ] Login returns JWT token
- [ ] Admin endpoints require token
- [ ] BA endpoints require token
- [ ] Invalid token returns 401
- [ ] Bookings API works
- [ ] Withdrawal API works

---

## 🎯 EXPECTED RESULTS

### Admin Dashboard Should Show
```
Total Bookings:      3
Pending BAs:         0
Total Revenue:       ₹10,000
Pending Withdrawals: 1 (₹3,000)
```

### BA Dashboard Should Show
```
Total Earnings:      ₹15,000
Approved Earnings:   ₹10,000
KYC Status:          APPROVED
Referral Bookings:   3
Pending Withdrawals: 1 (₹3,000)
Assigned Coupons:    2
```

---

## 🚀 START TESTING NOW!

1. **Open Login**: http://localhost:5000/login.html
2. **Try Admin**: admin@example.com / ChangeMe123!
3. **Try BA**: ba@example.com / BA123456!
4. **Explore Dashboards**
5. **Test APIs**

---

## 📞 NEED HELP?

- Check backend logs: `npm run dev`
- Check browser console: F12
- Re-run seed: `npm run seed`
- Restart servers

**Happy Testing! 🎉**

