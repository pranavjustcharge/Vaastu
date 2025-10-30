# 📋 Step-by-Step Deployment Guide

## Phase 1: Preparation (5 minutes)

### Step 1.1: Push Code to GitHub
```bash
cd c:\Users\Pranav\Desktop\Vastu-website-UI-Newpage\Vastu-website-UI-Newpage

git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 1.2: Create MongoDB Atlas Account
1. Go to **mongodb.com/cloud/atlas**
2. Sign up (free)
3. Create organization
4. Create project
5. Create cluster (free tier)
6. Wait for cluster to be ready (~5 min)

### Step 1.3: Create MongoDB Database User
1. In MongoDB Atlas → Database Access
2. Click "Add Database User"
3. Username: `vastu_user`
4. Password: Generate strong password (save it!)
5. Database User Privileges: Read and write to any database
6. Click "Add User"

### Step 1.4: Get MongoDB Connection String
1. In MongoDB Atlas → Clusters
2. Click "Connect"
3. Choose "Drivers"
4. Copy connection string
5. Replace `<username>` with `vastu_user`
6. Replace `<password>` with your password
7. Replace `<dbname>` with `vastu_db`

**Example**:
```
mongodb+srv://vastu_user:MyPassword123@cluster0.abc123.mongodb.net/vastu_db?retryWrites=true&w=majority
```

### Step 1.5: Whitelist MongoDB IPs
1. In MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. For testing: Add `0.0.0.0/0` (allow all)
4. For production: Add only Render's IP
5. Click "Confirm"

---

## Phase 2: Deploy Backend to Render (10 minutes)

### Step 2.1: Create Render Account
1. Go to **render.com**
2. Sign up with GitHub
3. Authorize GitHub access

### Step 2.2: Create Web Service
1. Dashboard → "New +" → "Web Service"
2. Select your GitHub repository
3. Click "Connect"

### Step 2.3: Configure Service
```
Name:              vastu-backend
Environment:       Node
Build Command:     npm install && npm run build
Start Command:     npm start
Plan:              Free (or Starter for production)
```

### Step 2.4: Add Environment Variables
Click "Advanced" and add these variables:

```
NODE_ENV                 = production
PORT                     = 3000
DATABASE_URL             = mongodb+srv://vastu_user:PASSWORD@cluster.mongodb.net/vastu_db
JWT_SECRET               = <generate-random-string>
JWT_REFRESH_SECRET       = <generate-random-string>
CORS_ORIGIN              = https://vastu-frontend.vercel.app
FRONTEND_URL             = https://vastu-frontend.vercel.app
LOG_LEVEL                = info
ADMIN_EMAIL              = admin@yourdomain.com
ADMIN_PASSWORD           = <strong-password>
DEFAULT_COMMISSION_TYPE  = PERCENTAGE
DEFAULT_COMMISSION_VALUE = 10
DEFAULT_GST_PERCENTAGE   = 18
REFERRAL_CODE_PREFIX     = BA
REFERRAL_CODE_LENGTH     = 12
```

### Step 2.5: Deploy
1. Click "Create Web Service"
2. Wait for build to complete (~5 minutes)
3. You'll see: "Your service is live at: https://vastu-backend.onrender.com"
4. **Copy this URL** - you'll need it for frontend

### Step 2.6: Run Database Migrations
1. In Render Dashboard → Service → "Shell"
2. Run these commands:
   ```bash
   npm run migrate
   npm run seed
   ```
3. Wait for completion

### Step 2.7: Verify Backend
1. Open browser
2. Go to: `https://vastu-backend.onrender.com/api/health`
3. You should see: `{"status":"ok"}`

---

## Phase 3: Deploy Frontend to Vercel (5 minutes)

### Step 3.1: Create Vercel Account
1. Go to **vercel.com**
2. Sign up with GitHub
3. Authorize GitHub access

### Step 3.2: Import Project
1. Dashboard → "Add New..." → "Project"
2. Select your GitHub repository
3. Click "Import"

### Step 3.3: Configure Project
```
Framework Preset:  Other
Root Directory:    .
```

### Step 3.4: Add Environment Variables
```
REACT_APP_API_URL = https://vastu-backend.onrender.com/api
```

### Step 3.5: Deploy
1. Click "Deploy"
2. Wait for build (~2 minutes)
3. You'll see: "Congratulations! Your project has been successfully deployed"
4. **Copy your frontend URL** - looks like: `https://vastu-frontend.vercel.app`

### Step 3.6: Verify Frontend
1. Open browser
2. Go to your frontend URL
3. You should see the login page
4. Check browser console (F12) for any errors

---

## Phase 4: Final Configuration (5 minutes)

### Step 4.1: Update Backend CORS
1. Go back to Render Dashboard
2. Service → Settings → Environment
3. Update `CORS_ORIGIN`:
   ```
   https://vastu-frontend.vercel.app,https://yourdomain.com
   ```
4. Click "Save"
5. Service will auto-redeploy

### Step 4.2: Test End-to-End
1. Open frontend: `https://vastu-frontend.vercel.app`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Paste this:
   ```javascript
   fetch('https://vastu-backend.onrender.com/api/health')
     .then(r => r.json())
     .then(d => console.log('✅ Backend OK:', d))
     .catch(e => console.error('❌ Error:', e))
   ```
5. You should see: `✅ Backend OK: {status: 'ok'}`

### Step 4.3: Test Login
1. On frontend, try logging in with:
   - Email: `admin@yourdomain.com`
   - Password: (the password you set in env vars)
2. You should be redirected to admin dashboard

### Step 4.4: Change Admin Password
1. After successful login
2. Go to admin dashboard
3. Change password immediately
4. Update `ADMIN_PASSWORD` in Render env vars

---

## ✅ Verification Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB cluster created
- [ ] MongoDB user created
- [ ] MongoDB whitelist configured
- [ ] Backend deployed to Render
- [ ] Backend migrations ran
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] API connection works
- [ ] Login works
- [ ] Admin dashboard accessible
- [ ] BA dashboard accessible
- [ ] CORS configured
- [ ] Admin password changed

---

## 🎉 You're Live!

Your application is now deployed:

```
Frontend:  https://vastu-frontend.vercel.app
Backend:   https://vastu-backend.onrender.com
API:       https://vastu-backend.onrender.com/api
```

---

## 🔐 Production Security Checklist

- [ ] Change admin password
- [ ] Rotate JWT secrets
- [ ] Whitelist MongoDB IPs (not 0.0.0.0/0)
- [ ] Enable HTTPS (auto on both)
- [ ] Setup custom domain
- [ ] Enable monitoring
- [ ] Setup backups
- [ ] Enable 2FA on accounts

---

## 🆘 Troubleshooting

See: **DEPLOYMENT_TROUBLESHOOTING.md**


