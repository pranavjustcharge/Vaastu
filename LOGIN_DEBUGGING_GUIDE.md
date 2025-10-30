# 🔍 Login Debugging Guide

## 🔴 Current Issue

**Symptom**: No network requests or console logs when clicking login button
**Frontend**: https://www.vaidikvaastu.com/login
**Backend**: https://vaastu.onrender.com

---

## 🧪 Step-by-Step Debugging

### Step 1: Check if config.js is Loading

**In Browser Console**:
```javascript
// Check if APP_CONFIG exists
console.log(typeof APP_CONFIG);
// Should show: "object"

// Check API URL
console.log(APP_CONFIG.API_BASE_URL);
// Should show: https://vaastu.onrender.com/api

// Check environment
console.log(APP_CONFIG.ENVIRONMENT);
// Should show: "production"
```

**If you see errors**:
- config.js might not be loading
- Check Network tab for 404 on config.js
- Check browser console for syntax errors

---

### Step 2: Check if login.html Script is Running

**In Browser Console**:
```javascript
// Check if API_BASE_URL variable exists
console.log(typeof API_BASE_URL);
// Should show: "string"

// Check the value
console.log(API_BASE_URL);
// Should show: https://vaastu.onrender.com/api
```

**If undefined**:
- login.html script might not be running
- Check for JavaScript errors in console
- Check Network tab for failed requests

---

### Step 3: Check Backend Health

**In Browser Console**:
```javascript
// Test backend directly
fetch('https://vaastu.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Error:', e));

// Should show: Backend: {status: "OK", timestamp: "..."}
```

**If error**:
- Backend might be down
- Check Render dashboard
- Check backend logs

---

### Step 4: Test Login Endpoint

**In Browser Console**:
```javascript
// Test login endpoint
fetch('https://vaastu.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'ChangeMe123!'
  })
})
  .then(r => r.json())
  .then(d => console.log('Response:', d))
  .catch(e => console.error('Error:', e));
```

**Expected responses**:
- Success (200): `{token: "...", refreshToken: "...", user: {...}}`
- Invalid credentials (401): `{error: "Invalid email/username or password"}`
- Server error (500): `{error: "..."}`

---

### Step 5: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click Login button
4. Look for requests to:
   - `https://vaastu.onrender.com/api/auth/login`
   - Check Status (should be 200, 401, or 500)
   - Check Response body

**If no requests appear**:
- JavaScript might not be running
- Form submission might be blocked
- Check console for errors

---

### Step 6: Check Console for Errors

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Common errors:
   - `Uncaught ReferenceError: API_BASE_URL is not defined`
   - `Uncaught ReferenceError: APP_CONFIG is not defined`
   - `CORS error`
   - `Network error`

---

## 🔧 Common Issues & Solutions

### Issue 1: "API_BASE_URL is not defined"
**Cause**: login.html script not running
**Solution**:
1. Check if config.js loaded (Network tab)
2. Check for JavaScript errors (Console tab)
3. Verify login.html has the line: `const API_BASE_URL = APP_CONFIG.API_BASE_URL;`

### Issue 2: "APP_CONFIG is not defined"
**Cause**: config.js not loading
**Solution**:
1. Check Network tab for config.js (should be 200)
2. Check for syntax errors in config.js
3. Verify script tag: `<script src="assets/js/config.js"></script>`

### Issue 3: CORS Error
**Cause**: Backend CORS not configured for your domain
**Solution**:
1. Check backend CORS_ORIGIN env var
2. Should include: `https://www.vaidikvaastu.com`
3. Update Render environment variables

### Issue 4: Network Error / No Response
**Cause**: Backend might be down or unreachable
**Solution**:
1. Test: `curl https://vaastu.onrender.com/health`
2. Check Render dashboard for errors
3. Check backend logs

---

## 📋 Debugging Checklist

- [ ] config.js loads (Network tab shows 200)
- [ ] APP_CONFIG exists (Console: `typeof APP_CONFIG === 'object'`)
- [ ] API_BASE_URL defined (Console: `typeof API_BASE_URL === 'string'`)
- [ ] Backend health check passes (Console: fetch health endpoint)
- [ ] Login endpoint responds (Console: fetch login endpoint)
- [ ] No JavaScript errors (Console tab is clean)
- [ ] Network requests appear (Network tab shows requests)
- [ ] Response status is correct (200, 401, or 500)

---

## 📞 Information to Share

If you need help, provide:
1. Screenshot of Console tab (with errors)
2. Screenshot of Network tab (showing requests)
3. Output of: `console.log(APP_CONFIG.API_BASE_URL)`
4. Output of: `console.log(API_BASE_URL)`
5. Output of backend health check

---

## 🚀 Quick Test Commands

**Copy-paste these in browser console**:

```javascript
// Test 1: Check config
console.log('Config loaded:', typeof APP_CONFIG === 'object');
console.log('API URL:', APP_CONFIG?.API_BASE_URL);

// Test 2: Check backend
fetch('https://vaastu.onrender.com/health').then(r => r.json()).then(d => console.log('Backend:', d));

// Test 3: Test login
fetch('https://vaastu.onrender.com/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'admin@example.com', password: 'ChangeMe123!'})
}).then(r => r.json()).then(d => console.log('Login:', d));
```

---

## ✨ Next Steps

1. Run the debugging steps above
2. Check all console outputs
3. Share any errors you find
4. We'll fix the issue based on the error


