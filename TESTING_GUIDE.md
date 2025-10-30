# 🧪 Testing Guide - Vaidik Vastu

## ✅ Demo Data Loaded Successfully!

Your database now contains complete demo data for testing both Admin and BA panels.

---

## 🔐 TEST CREDENTIALS

### Admin Account
```
Email:    admin@example.com
Password: ChangeMe123!
Role:     ADMIN
```

### BA (Business Associate) Account
```
Email:    ba@example.com
Password: BA123456!
Role:     BA
```

---

## 📊 DEMO DATA CREATED

### Users (2)
- ✅ Admin User (admin@example.com)
- ✅ BA User - Rajesh Kumar (ba@example.com)

### BA Profile (1)
- ✅ KYC Status: APPROVED
- ✅ Total Earnings: ₹15,000
- ✅ Approved Earnings: ₹10,000
- ✅ Referral Code: REF-RAJESH-001

### Bookings (3)
1. **Amit Sharma** - Business Vastu
   - Status: CONFIRMED
   - Amount: ₹5,000
   - Commission: ₹500

2. **Priya Patel** - Residential Vastu
   - Status: PENDING
   - Amount: ₹3,000
   - Commission: ₹300

3. **Vikram Singh** - Healing Session
   - Status: COMPLETED
   - Amount: ₹2,000
   - Commission: ₹200

### Referral Transactions (2)
- ✅ ₹500 (APPROVED)
- ✅ ₹300 (PENDING)

### Coupons (2)
- ✅ VASTU10 - 10% discount
- ✅ HEALING20 - 20% discount

### Coupon Assignments (2)
- ✅ VASTU10 assigned to BA
- ✅ HEALING20 assigned to BA

### Withdrawal Requests (2)
- ✅ ₹5,000 (APPROVED)
- ✅ ₹3,000 (PENDING)

---

## 🌐 ACCESS URLS

```
Frontend:  http://localhost:5000
Backend:   http://localhost:3000
Login:     http://localhost:5000/login.html
```

---

## 🧪 TESTING WORKFLOW

### Step 1: Test Admin Panel

1. **Open Login Page**
   ```
   http://localhost:5000/login.html
   ```

2. **Login as Admin**
   ```
   Email: admin@example.com
   Password: ChangeMe123!
   ```

3. **Verify Admin Dashboard**
   - ✅ Dashboard statistics should show:
     - Total Bookings: 3
     - Pending BAs: 0 (BA is already approved)
     - Total Revenue: ₹10,000
     - Pending Withdrawals: 1 (₹3,000)

4. **Test Admin Features**
   - [ ] View pending BA approvals
   - [ ] View recent bookings
   - [ ] View pending withdrawals
   - [ ] Approve/Reject withdrawals
   - [ ] Manage commission settings
   - [ ] Create and assign coupons

---

### Step 2: Test BA Panel

1. **Logout from Admin**
   - Click logout button

2. **Login as BA**
   ```
   Email: ba@example.com
   Password: BA123456!
   ```

3. **Verify BA Dashboard**
   - ✅ Dashboard should show:
     - Total Earnings: ₹15,000
     - Approved Earnings: ₹10,000
     - KYC Status: APPROVED
     - Referral Bookings: 3

4. **Test BA Features**
   - [ ] View earnings statistics
   - [ ] View referral bookings
   - [ ] View withdrawal history
   - [ ] Request new withdrawal
   - [ ] View assigned coupons
   - [ ] Check referral code

---

## 🔧 API TESTING

### Test Admin APIs

#### Get Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <admin_token>"
```

#### Get Pending BAs
```bash
curl -X GET http://localhost:3000/api/admin/pending-bas \
  -H "Authorization: Bearer <admin_token>"
```

#### Get Pending Withdrawals
```bash
curl -X GET http://localhost:3000/api/admin/pending-withdrawals \
  -H "Authorization: Bearer <admin_token>"
```

#### Approve Withdrawal
```bash
curl -X POST http://localhost:3000/api/admin/approve-withdrawal/<withdrawal_id> \
  -H "Authorization: Bearer <admin_token>"
```

---

### Test BA APIs

#### Get BA Profile
```bash
curl -X GET http://localhost:3000/api/ba/profile \
  -H "Authorization: Bearer <ba_token>"
```

#### Get Referral Stats
```bash
curl -X GET http://localhost:3000/api/ba/referral-stats \
  -H "Authorization: Bearer <ba_token>"
```

#### Get BA Bookings
```bash
curl -X GET http://localhost:3000/api/ba/bookings \
  -H "Authorization: Bearer <ba_token>"
```

#### Get Withdrawal History
```bash
curl -X GET http://localhost:3000/api/ba/withdrawal-history \
  -H "Authorization: Bearer <ba_token>"
```

#### Request Withdrawal
```bash
curl -X POST http://localhost:3000/api/ba/request-withdrawal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ba_token>" \
  -d '{
    "amount": 2000
  }'
```

#### Get Assigned Coupons
```bash
curl -X GET http://localhost:3000/api/ba/assigned-coupons \
  -H "Authorization: Bearer <ba_token>"
```

---

## 📝 TESTING CHECKLIST

### Admin Panel Tests
- [ ] Login with admin credentials
- [ ] Dashboard loads with correct statistics
- [ ] View pending BA approvals
- [ ] View recent bookings (3 bookings visible)
- [ ] View pending withdrawals (1 pending)
- [ ] Approve withdrawal request
- [ ] Reject withdrawal request
- [ ] View commission settings
- [ ] Create new coupon
- [ ] Assign coupon to BA
- [ ] Logout successfully

### BA Panel Tests
- [ ] Login with BA credentials
- [ ] Dashboard loads with correct earnings
- [ ] View referral bookings (3 bookings visible)
- [ ] View withdrawal history (2 withdrawals visible)
- [ ] Request new withdrawal
- [ ] View assigned coupons (2 coupons visible)
- [ ] View referral code
- [ ] Logout successfully

### API Tests
- [ ] Admin login returns token
- [ ] BA login returns token
- [ ] Admin dashboard API returns data
- [ ] BA profile API returns data
- [ ] Booking creation works
- [ ] Withdrawal request works
- [ ] Token refresh works
- [ ] Invalid token returns 401

---

## 🐛 TROUBLESHOOTING

### Login Not Working
- [ ] Check backend is running on port 3000
- [ ] Check frontend is running on port 5000
- [ ] Check CORS is enabled in .env
- [ ] Check MongoDB connection

### Dashboard Not Loading
- [ ] Check browser console for errors
- [ ] Check network tab for failed requests
- [ ] Verify token is stored in localStorage
- [ ] Check backend logs for errors

### Data Not Showing
- [ ] Run seed script again: `npm run seed`
- [ ] Check MongoDB collections exist
- [ ] Verify user has correct role
- [ ] Check API endpoints return data

### CORS Errors
- [ ] Verify CORS_ORIGIN in .env includes localhost:5000
- [ ] Restart backend after changing .env
- [ ] Check browser console for specific error

---

## 📊 DATABASE VERIFICATION

### Check Users
```bash
# In MongoDB Atlas or local MongoDB
db.users.find()
```

### Check Bookings
```bash
db.bookings.find()
```

### Check BA Profiles
```bash
db.baprofiles.find()
```

### Check Withdrawals
```bash
db.withdrawalrequests.find()
```

---

## 🎯 NEXT STEPS

1. ✅ Test Admin Panel
2. ✅ Test BA Panel
3. ✅ Test API Endpoints
4. ✅ Verify Data Persistence
5. ✅ Test Error Handling
6. ✅ Performance Testing
7. ✅ Security Testing

---

## 📞 SUPPORT

If you encounter any issues:

1. Check the backend logs: `npm run dev`
2. Check browser console (F12)
3. Verify MongoDB connection
4. Re-run seed script: `npm run seed`
5. Restart both servers

---

**Happy Testing! 🚀**

Created: 2025-10-24  
Status: Ready for Testing  
Demo Data: Loaded ✅

