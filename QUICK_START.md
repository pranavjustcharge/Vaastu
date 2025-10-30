# ⚡ Quick Start - Vaidik Vastu (With Toaster Notifications)

## ✨ What's New
- ✅ Professional toaster notifications (no more pop-ups!)
- ✅ User-friendly error messages
- ✅ Improved atomicity in registration
- ✅ Mobile responsive design
- ✅ Auto-dismiss with progress bar

## 🚀 Start the Project (2 Steps)

### Step 1: Start Backend (Terminal 1)
```bash
npm run dev
```
✅ Backend runs on: **http://localhost:3000**

### Step 2: Start Frontend (Terminal 2)
```bash
http-server -p 5000 -c-1
```
✅ Frontend runs on: **http://localhost:5000**

---

## 🌐 Access the Application

### Login Page
```
http://localhost:5000/login.html
```

### Admin Credentials
```
Email:    admin@example.com
Password: ChangeMe123!
```

---

## 📊 Dashboards

### Admin Dashboard
```
http://localhost:5000/admin-dashboard.html
```
- View statistics
- Approve/Reject BAs
- Manage bookings
- Process withdrawals

### BA Dashboard
```
http://localhost:5000/ba-dashboard.html
```
- View earnings
- Track referrals
- Request withdrawals
- View coupons

---

## 🔧 Common Commands

### Build Backend
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Seed Database
```bash
npm run seed
```

### Check Linting
```bash
npm run lint
```

---

## 📝 API Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"ChangeMe123!"}'
```

### Get Dashboard
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <token>"
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "serviceType":"BUSINESS_VASTU",
    "clientName":"John",
    "clientEmail":"john@example.com",
    "clientPhone":"+919876543210",
    "bookingDate":"2025-11-15T10:00:00Z",
    "bookingTime":"10:00 AM"
  }'
```

---

## 🗄️ Database

**Provider**: MongoDB Atlas (Cloud)  
**URL**: mongodb+srv://vaidik_vaastu:JCT2025@vaastu.sxjlbge.mongodb.net/vastu_db  
**Collections**: 9 (users, bookings, baprofiles, etc.)

---

## 📁 Project Structure

```
.
├── src/                    # Backend source
│   ├── controllers/        # API handlers
│   ├── services/           # Business logic
│   ├── routes/             # API routes
│   └── utils/              # Utilities
├── dist/                   # Compiled backend
├── *.html                  # Frontend pages
├── assets/                 # CSS, images, fonts
├── script.js               # Frontend logic
└── package.json            # Dependencies
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript config |
| `src/index.ts` | Backend entry point |
| `login.html` | Login page |
| `admin-dashboard.html` | Admin panel |
| `ba-dashboard.html` | BA panel |

---

## 🧪 Test Workflow

1. **Open Login Page**
   ```
   http://localhost:5000/login.html
   ```

2. **Login with Admin**
   ```
   Email: admin@example.com
   Password: ChangeMe123!
   ```

3. **Access Admin Dashboard**
   ```
   http://localhost:5000/admin-dashboard.html
   ```

4. **View Statistics**
   - Total bookings
   - Pending BAs
   - Total revenue
   - Pending withdrawals

---

## 🚨 Troubleshooting

### Backend not starting?
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F
```

### Frontend not loading?
```bash
# Restart http-server
http-server -p 5000 -c-1
```

### Login not working?
- Check backend is running
- Verify `.env` has correct DATABASE_URL
- Check MongoDB Atlas connection

### CORS errors?
- Backend has CORS enabled for localhost:5000
- Check browser console for details

---

## 📊 API Endpoints (Quick Reference)

### Auth (3)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh-token`

### Admin (11)
- `GET /api/admin/dashboard`
- `GET /api/admin/pending-bas`
- `POST /api/admin/approve-ba/:id`
- `POST /api/admin/reject-ba/:id`
- `GET /api/admin/pending-withdrawals`
- `POST /api/admin/approve-withdrawal/:id`
- `POST /api/admin/reject-withdrawal/:id`
- `POST /api/admin/set-commission`
- `GET /api/admin/commission-settings`
- `POST /api/admin/create-coupon`
- `POST /api/admin/assign-coupon-to-ba`

### BA (7)
- `GET /api/ba/profile`
- `PUT /api/ba/profile`
- `GET /api/ba/referral-stats`
- `GET /api/ba/bookings`
- `GET /api/ba/withdrawal-history`
- `POST /api/ba/request-withdrawal`
- `GET /api/ba/assigned-coupons`

### Bookings (6)
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`
- `GET /api/bookings/stats`

---

## ✨ Features

✅ JWT Authentication  
✅ Admin Dashboard  
✅ BA Dashboard  
✅ Booking System  
✅ Commission Tracking  
✅ Withdrawal Management  
✅ Coupon System  
✅ MongoDB Atlas  
✅ API Documentation  
✅ Error Handling  

---

## 📞 Quick Links

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5000
- **Login**: http://localhost:5000/login.html
- **Admin**: http://localhost:5000/admin-dashboard.html
- **BA**: http://localhost:5000/ba-dashboard.html

---

## 🎉 You're All Set!

Your Vaidik Vastu project is ready to use. Start with the login page and explore the dashboards!

**Happy coding! 🚀**

