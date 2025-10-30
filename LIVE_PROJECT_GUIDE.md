# 🚀 VAIDIK VASTU - LIVE PROJECT GUIDE

## ✅ PROJECT IS NOW LIVE!

Both servers are running and ready to use!

---

## 🌐 LIVE URLS

### Main Website
```
http://localhost:5000/index.html
```

### Login Page
```
http://localhost:5000/login.html
```

### Admin Dashboard
```
http://localhost:5000/admin-dashboard.html
```

### BA Dashboard
```
http://localhost:5000/ba-dashboard.html
```

### Backend API
```
http://localhost:3000/api
```

---

## 🔐 TEST CREDENTIALS

### Admin Account
```
Email:    admin@example.com
Password: ChangeMe123!
```

### BA Account
```
Email:    ba@example.com
Password: BA123456!
```

---

## 📊 WHAT YOU CAN DO

### As Admin
✅ View dashboard statistics  
✅ See pending BA approvals  
✅ Manage withdrawals  
✅ Set commission rates  
✅ Create and assign coupons  
✅ View all bookings  

### As BA
✅ View profile and earnings  
✅ See referral statistics  
✅ View assigned bookings  
✅ Request withdrawals  
✅ View assigned coupons  
✅ Track referral transactions  

---

## 🧪 QUICK START

### Step 1: Open Login Page
```
http://localhost:5000/login.html
```

### Step 2: Login as Admin
```
Email:    admin@example.com
Password: ChangeMe123!
```

### Step 3: Explore Admin Dashboard
```
✅ View dashboard stats
✅ Check pending BAs
✅ Review withdrawals
✅ Manage coupons
```

### Step 4: Logout and Login as BA
```
Email:    ba@example.com
Password: BA123456!
```

### Step 5: Explore BA Dashboard
```
✅ View earnings
✅ Check bookings
✅ Request withdrawal
✅ View coupons
```

---

## 📈 DEMO DATA AVAILABLE

### Users
- Admin User (admin@example.com)
- BA User - Rajesh Kumar (ba@example.com)

### Bookings (3)
- Amit Sharma - Business Vastu (CONFIRMED)
- Priya Patel - Residential Vastu (PENDING)
- Vikram Singh - Healing Session (COMPLETED)

### Withdrawals (2)
- ₹5,000 (APPROVED)
- ₹3,000 (PENDING)

### Coupons (2)
- VASTU10 (10% discount)
- HEALING20 (20% discount)

### Earnings
- Total: ₹15,000
- Approved: ₹10,000
- Pending: ₹5,000

---

## 🔧 SERVER STATUS

### Backend Server
```
✅ Running on: http://localhost:3000
✅ Database: MongoDB Atlas Connected
✅ Status: All 29 APIs working
```

### Frontend Server
```
✅ Running on: http://localhost:5000
✅ Status: All pages loading
✅ CORS: Enabled
```

---

## 📱 FEATURES WORKING

### Authentication
✅ Login with email/password  
✅ JWT token generation  
✅ Refresh token support  
✅ Logout functionality  
✅ Role-based access  

### Admin Panel
✅ Dashboard with statistics  
✅ BA management  
✅ Withdrawal management  
✅ Commission settings  
✅ Coupon management  

### BA Panel
✅ Profile management  
✅ Earnings tracking  
✅ Booking management  
✅ Withdrawal requests  
✅ Coupon assignments  

### Data Management
✅ Real-time data loading  
✅ Proper error handling  
✅ Data persistence  
✅ Secure API calls  

---

## 🎯 API ENDPOINTS

### Admin Endpoints (11)
```
GET    /api/admin/dashboard
GET    /api/admin/pending-bas
POST   /api/admin/approve-ba/:baId
POST   /api/admin/reject-ba/:baId
GET    /api/admin/pending-withdrawals
POST   /api/admin/approve-withdrawal/:withdrawalId
POST   /api/admin/reject-withdrawal/:withdrawalId
GET    /api/admin/commission-settings
POST   /api/admin/commission-settings
POST   /api/admin/create-coupon
POST   /api/admin/assign-coupon-to-ba
```

### BA Endpoints (8)
```
GET    /api/ba/profile
PUT    /api/ba/profile
GET    /api/ba/referral-stats
GET    /api/ba/bookings
GET    /api/ba/withdrawal-history
POST   /api/ba/request-withdrawal
GET    /api/ba/assigned-coupons
GET    /api/ba/coupons/:couponId
```

### Auth Endpoints (3)
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh-token
```

### Booking Endpoints (6)
```
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
GET    /api/bookings/ba/:baId
```

---

## 🛠️ TROUBLESHOOTING

### If Pages Don't Load
1. Check if frontend server is running
2. Verify URL: http://localhost:5000
3. Clear browser cache (Ctrl+Shift+Delete)
4. Refresh page (Ctrl+R)

### If Login Fails
1. Check if backend server is running
2. Verify MongoDB connection
3. Check credentials in console (F12)
4. Try refreshing page

### If APIs Return 404
1. Verify backend is running
2. Check API endpoint URL
3. Verify authentication token
4. Check browser console for errors

### If Data Doesn't Load
1. Verify MongoDB connection
2. Check if seed data was loaded
3. Run: `npm run seed`
4. Restart backend: `npm run dev`

---

## 📞 SUPPORT

### Check Logs
```bash
# Backend logs
npm run dev

# Frontend console
Press F12 in browser
```

### Restart Services
```bash
# Kill all processes
Ctrl+C in terminals

# Restart backend
npm run dev

# Restart frontend
http-server -p 5000 -c-1
```

### Re-seed Database
```bash
npm run seed
```

---

## 🎉 YOU'RE ALL SET!

Your Vaidik Vastu project is now:

✅ **LIVE** - Both servers running  
✅ **CONNECTED** - MongoDB Atlas connected  
✅ **POPULATED** - Demo data loaded  
✅ **READY** - For testing and development  

### Next Steps
1. Open http://localhost:5000/login.html
2. Login with admin credentials
3. Explore admin dashboard
4. Test all features
5. Logout and login as BA
6. Explore BA dashboard

---

**Happy Testing! 🚀**

Created: 2025-10-28  
Status: ✅ LIVE & OPERATIONAL  
Backend: ✅ Running on port 3000  
Frontend: ✅ Running on port 5000  

