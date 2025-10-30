# ⚡ CORS Error - Quick Fix

## 🔴 Problem
CORS error: Frontend can't call backend

## ✅ Solution: 3 Steps (5 minutes)

### Step 1: Go to Render Dashboard
```
https://dashboard.render.com
```

### Step 2: Update Environment Variable
1. Click your backend service
2. Go to **Settings** tab
3. Scroll to **Environment** section
4. Find or create `CORS_ORIGIN`
5. Set value to:
```
https://www.vaidikvaastu.com,http://localhost:5000,http://localhost:3000
```
6. Click **Save Changes**

### Step 3: Wait for Redeploy
- Backend will auto-redeploy (~2 minutes)
- Wait for "Live" status

---

## 🧪 Test

1. Go to: https://www.vaidikvaastu.com/login
2. Open DevTools: F12
3. Go to Console tab
4. Try login
5. Should work now! ✅

---

## 🔍 Verify CORS Fixed

**In Console**:
```javascript
fetch('https://vaastu.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ CORS working:', d))
  .catch(e => console.error('❌ CORS error:', e));
```

**Expected**:
```
✅ CORS working: {status: "OK", timestamp: "..."}
```

---

## 📋 What Changed

**Before**:
```
CORS_ORIGIN = http://localhost:5000,http://localhost:3000
```

**After**:
```
CORS_ORIGIN = https://www.vaidikvaastu.com,http://localhost:5000,http://localhost:3000
```

---

## ✨ That's It!

Update env var → Redeploy → Test → Done! 🎉


