# 🔧 CORS Error - Fix Guide

## 🔴 Problem

**Error**: CORS error when frontend tries to call backend
**Frontend**: https://www.vaidikvaastu.com
**Backend**: https://vaastu.onrender.com

**Error Message in Console**:
```
Access to XMLHttpRequest at 'https://vaastu.onrender.com/api/auth/login' 
from origin 'https://www.vaidikvaastu.com' has been blocked by CORS policy
```

---

## 🔍 Root Cause

The backend's `CORS_ORIGIN` environment variable on Render doesn't include your frontend domain.

**Current CORS_ORIGIN** (default):
```
http://localhost:5000,http://localhost:3000
```

**Should be**:
```
https://www.vaidikvaastu.com,http://localhost:5000,http://localhost:3000
```

---

## ✅ Solution: Update Render Environment Variables

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Click on your backend service: `vaastu` (or similar name)
3. Go to **Settings** tab

### Step 2: Update Environment Variables
1. Scroll down to **Environment** section
2. Find or create `CORS_ORIGIN` variable
3. Set value to:
```
https://www.vaidikvaastu.com,http://localhost:5000,http://localhost:3000
```

### Step 3: Save & Redeploy
1. Click **Save Changes**
2. Backend will auto-redeploy (~2 minutes)
3. Wait for "Live" status

### Step 4: Test
1. Go to https://www.vaidikvaastu.com/login
2. Open DevTools (F12)
3. Go to Console tab
4. Try login
5. Should see network request succeed (no CORS error)

---

## 📋 Environment Variables to Set

| Variable | Value | Purpose |
|----------|-------|---------|
| `CORS_ORIGIN` | `https://www.vaidikvaastu.com,http://localhost:5000,http://localhost:3000` | Allow frontend to call backend |
| `DATABASE_URL` | Your MongoDB Atlas URL | Database connection |
| `JWT_SECRET` | Your secret key | JWT token signing |
| `JWT_REFRESH_SECRET` | Your secret key | Refresh token signing |
| `NODE_ENV` | `production` | Production mode |

---

## 🔍 How CORS Works

**CORS (Cross-Origin Resource Sharing)** is a security feature:

1. Frontend on `https://www.vaidikvaastu.com` makes request
2. Browser checks: "Is this origin allowed?"
3. Backend responds with `Access-Control-Allow-Origin` header
4. If frontend domain is in `CORS_ORIGIN`, request succeeds
5. If not, browser blocks request (CORS error)

---

## 🧪 Verify CORS is Working

**In Browser Console**:
```javascript
// Test CORS
fetch('https://vaastu.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ CORS working:', d))
  .catch(e => console.error('❌ CORS error:', e));
```

**Expected Output**:
```
✅ CORS working: {status: "OK", timestamp: "..."}
```

**If you see CORS error**:
```
❌ CORS error: TypeError: Failed to fetch
```

Then the environment variable hasn't been updated yet.

---

## 📊 CORS Configuration in Code

**File**: `src/config/env.ts` (lines 20-24)

```typescript
cors: {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5000,http://localhost:3000')
    .split(',')
    .map((origin: string) => origin.trim()),
},
```

**File**: `src/index.ts` (lines 31-36)

```typescript
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 🚀 Step-by-Step Fix

### Step 1: Update Render (5 minutes)
1. Go to https://dashboard.render.com
2. Click your backend service
3. Go to Settings → Environment
4. Add/Update `CORS_ORIGIN`:
   ```
   https://www.vaidikvaastu.com,http://localhost:5000,http://localhost:3000
   ```
5. Click Save
6. Wait for redeploy (shows "Live")

### Step 2: Clear Frontend Cache (1 minute)
1. Go to https://www.vaidikvaastu.com/login
2. Press Ctrl+Shift+Delete (clear cache)
3. Reload page

### Step 3: Test Login (2 minutes)
1. Open DevTools (F12)
2. Go to Console tab
3. Try login with:
   - Email: `admin@example.com`
   - Password: `ChangeMe123!`
4. Should see network request succeed

### Step 4: Verify Success
You should see:
```
✅ API_BASE_URL initialized: https://vaastu.onrender.com/api
✅ Form submitted
API_BASE_URL: https://vaastu.onrender.com/api
Login endpoint: https://vaastu.onrender.com/api/auth/login
Response status: 200
Login successful! Redirecting...
```

---

## ❌ Common CORS Errors

### Error 1: "Access to XMLHttpRequest has been blocked by CORS policy"
**Cause**: Frontend domain not in `CORS_ORIGIN`
**Fix**: Add domain to `CORS_ORIGIN` environment variable

### Error 2: "No 'Access-Control-Allow-Origin' header"
**Cause**: CORS not configured on backend
**Fix**: Check `CORS_ORIGIN` is set correctly

### Error 3: "Credentials mode is 'include' but Access-Control-Allow-Credentials is missing"
**Cause**: CORS credentials not enabled
**Fix**: Already enabled in code (`credentials: true`)

---

## 📞 Debugging

**Check 1: Is CORS_ORIGIN set?**
```bash
# On Render dashboard, check Environment section
# Should show: CORS_ORIGIN = https://www.vaidikvaastu.com,...
```

**Check 2: Is backend redeployed?**
```bash
# Check Render dashboard
# Should show "Live" status (not "Building" or "Failed")
```

**Check 3: Test CORS directly**
```javascript
// In browser console
fetch('https://vaastu.onrender.com/health')
  .then(r => {
    console.log('Headers:', r.headers.get('Access-Control-Allow-Origin'));
    return r.json();
  })
  .then(d => console.log('Response:', d));
```

---

## ✨ Summary

✅ CORS error identified
✅ Root cause found (missing domain in CORS_ORIGIN)
✅ Solution provided (update environment variable)
✅ Ready to fix

**Next**: Update Render environment variables and redeploy! 🚀


