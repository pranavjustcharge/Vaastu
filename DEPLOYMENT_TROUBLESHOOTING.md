# 🔧 Deployment Troubleshooting Guide

## 🔴 Backend Issues (Render)

### 1. Build Fails

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Locally, try:
npm install --legacy-peer-deps

# Push to GitHub
git add package-lock.json
git commit -m "Fix dependencies"
git push

# Render will auto-redeploy
```

---

### 2. 502 Bad Gateway

**Cause**: Backend crashed or not responding

**Fix**:
1. Go to Render Dashboard → Service → Logs
2. Check error messages
3. Common causes:
   - Database connection failed
   - Missing environment variables
   - Port not listening

**Check logs**:
```bash
# In Render shell
tail -f logs/error.log
```

---

### 3. Database Connection Failed

**Error**: `MongooseError: connect ECONNREFUSED`

**Solution**:
1. Verify `DATABASE_URL` is correct
   ```
   mongodb+srv://user:password@cluster.mongodb.net/vastu_db
   ```
2. Check MongoDB whitelist:
   - mongodb.com → Network Access
   - Add Render's IP or 0.0.0.0/0
3. Test connection:
   ```bash
   # In Render shell
   npm run test:db
   ```

---

### 4. Migrations Failed

**Error**: `Prisma migration error`

**Solution**:
```bash
# In Render shell
npm run migrate:reset --force
npm run seed
```

Or manually:
1. Render Dashboard → Service → "Run Command"
2. Command: `npm run migrate && npm run seed`

---

### 5. Environment Variables Not Loaded

**Error**: `JWT_SECRET is undefined`

**Solution**:
1. Render Dashboard → Settings → Environment
2. Verify all vars are set
3. Redeploy:
   ```bash
   # In Render shell
   npm start
   ```

---

## 🔵 Frontend Issues (Vercel)

### 1. Blank Page

**Cause**: API not reachable or JavaScript error

**Fix**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify API URL in `assets/js/config.js`

---

### 2. CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Go to Render Dashboard
2. Settings → Environment
3. Update `CORS_ORIGIN`:
   ```
   https://vastu-frontend.vercel.app,https://yourdomain.com
   ```
4. Redeploy backend

---

### 3. 404 on Routes

**Error**: `Cannot GET /admin-dashboard`

**Solution**:
- Vercel's `rewrites` should handle this
- Check `vercel.json` has:
  ```json
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/login.html"
    }
  ]
  ```

---

### 4. API Calls Timeout

**Error**: `Failed to fetch` or `Network timeout`

**Solution**:
1. Check backend is running:
   ```bash
   curl https://vastu-backend.onrender.com/api/health
   ```
2. Increase timeout in `assets/js/config.js`:
   ```javascript
   API_TIMEOUT: 60000 // 60 seconds
   ```
3. Check Render logs for slow queries

---

## 🔗 API Connection Issues

### Test Backend Health

```bash
# From terminal
curl https://vastu-backend.onrender.com/api/health

# Expected response
{"status":"ok","timestamp":"2024-01-15T10:30:00Z"}
```

### Test from Browser Console

```javascript
// Open DevTools → Console
fetch('https://vastu-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```

### Test Login Endpoint

```javascript
fetch('https://vastu-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'your-password'
  })
})
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

---

## 📊 Monitoring & Debugging

### View Render Logs

1. Dashboard → Service → Logs
2. Filter by:
   - All logs
   - Build logs
   - Deploy logs
   - Runtime logs

### View Vercel Logs

1. Dashboard → Project → Deployments
2. Click deployment
3. View build logs and runtime logs

### Enable Debug Mode

In Render environment:
```
LOG_LEVEL=debug
```

Then redeploy and check logs.

---

## 🔐 Authentication Issues

### Admin Login Fails

**Check**:
1. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
2. Database seeded: `npm run seed`
3. User exists in database

**Reset admin**:
```bash
# In Render shell
npm run seed
```

### JWT Token Errors

**Error**: `Invalid token` or `Token expired`

**Solution**:
1. Check `JWT_SECRET` is set
2. Check token expiry: `JWT_EXPIRY=24h`
3. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```

---

## 🚀 Performance Issues

### Slow API Responses

**Check**:
1. Database query performance
2. Network latency
3. Render instance size (upgrade if needed)

**Optimize**:
```bash
# Add indexes to database
npm run prisma:studio
# Check query performance
```

### High Memory Usage

**Solution**:
1. Render Dashboard → Settings → Plan
2. Upgrade to higher tier
3. Or optimize code (check for memory leaks)

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Database migrations ran
- [ ] Admin user seeded
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Health check passes
- [ ] Login works
- [ ] Admin dashboard loads
- [ ] BA dashboard loads
- [ ] No console errors

---

## 🆘 Still Stuck?

1. **Check logs first** (Render/Vercel dashboard)
2. **Test API manually** (curl or browser console)
3. **Verify environment variables** (all set?)
4. **Check database connection** (MongoDB whitelist?)
5. **Review error messages** (specific error?)

### Get Help
- Render Support: render.com/support
- Vercel Support: vercel.com/support
- MongoDB Support: mongodb.com/support


