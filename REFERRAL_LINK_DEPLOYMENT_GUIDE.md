# 🚀 Referral Link Fix - Deployment Guide

**Status**: ✅ **READY TO DEPLOY**

---

## 📋 What Was Fixed

### ✅ Issue 1: Hardcoded Referral Link
- **File**: `src/services/baService.ts` (Line 175)
- **Before**: `http://localhost:5000/business_associate.html?ref=...`
- **After**: `${config.frontendUrl}/business_associate.html?ref=...`

### ✅ Issue 2: Hardcoded API URL
- **File**: `script.js` (Line 2)
- **Before**: `const API_BASE_URL = 'http://localhost:3000/api'`
- **After**: Dynamic initialization from `config.js`

---

## 🔧 Step 1: Update Environment Variables

### On Render Backend Dashboard

1. Go to: https://dashboard.render.com
2. Select your backend service
3. Click "Environment"
4. Add/Update this variable:

```
FRONTEND_URL=https://www.vaidikvaastu.com
```

**Current values** (verify these exist):
```
DATABASE_URL=<your-mongodb-url>
JWT_SECRET=<your-jwt-secret>
CORS_ORIGIN=https://www.vaidikvaastu.com,https://vaidikvaastu.com
NODE_ENV=production
```

---

## 📤 Step 2: Deploy Backend

### Option A: Auto-Deploy (Recommended)
```bash
# Commit changes
git add src/services/baService.ts
git commit -m "fix: Use dynamic FRONTEND_URL for referral links"
git push origin main
```

Render will auto-deploy in 2-3 minutes.

### Option B: Manual Deploy
1. Go to Render dashboard
2. Select backend service
3. Click "Manual Deploy"
4. Wait for deployment to complete

---

## 📤 Step 3: Deploy Frontend

### Option A: Auto-Deploy (Recommended)
```bash
# Commit changes
git add script.js
git commit -m "fix: Use dynamic API_BASE_URL from config.js"
git push origin main
```

Vercel will auto-deploy in 1-2 minutes.

### Option B: Manual Deploy
1. Go to Vercel dashboard
2. Select frontend project
3. Click "Redeploy"
4. Wait for deployment to complete

---

## ✅ Step 4: Verify Deployment

### Test 1: Check Referral Link
1. Login to BA dashboard: https://www.vaidikvaastu.com/ba-dashboard.html
2. Scroll to "Your Referral Link" section
3. Verify link shows: `https://www.vaidikvaastu.com/business_associate.html?ref=...`
4. ✅ Should NOT show `localhost`

### Test 2: Copy Referral Link
1. Click "📋 Copy Link" button
2. Paste in notepad
3. Verify it's the correct production URL
4. ✅ Should work

### Test 3: Test Referral Link
1. Open referral link in new tab
2. Should open BA registration form
3. Referral code should be pre-filled
4. ✅ Should work

### Test 4: Check API Calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Check API calls
5. ✅ Should call `https://vaastu.onrender.com/api`

---

## 🧪 Quick Test Commands

### Test Backend
```bash
# Check if backend is running
curl https://vaastu.onrender.com/health

# Should return:
# {"status":"ok"}
```

### Test Frontend
```bash
# Check if frontend is running
curl https://www.vaidikvaastu.com/

# Should return HTML content
```

### Test Referral Link
```bash
# Get referral info (requires auth token)
curl -H "Authorization: Bearer <token>" \
  https://vaastu.onrender.com/api/ba/referral-info

# Should return referral link with production domain
```

---

## 🔍 Troubleshooting

### Issue: Referral link still shows localhost
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check if backend deployment completed
4. Verify FRONTEND_URL is set on Render

### Issue: API calls still fail
**Solution**:
1. Check if frontend deployment completed
2. Clear browser cache
3. Hard refresh page
4. Check browser console for errors

### Issue: Deployment stuck
**Solution**:
1. Check Render/Vercel dashboard for errors
2. Check git logs for commit issues
3. Try manual deploy
4. Contact support if needed

---

## 📊 Deployment Checklist

### Before Deployment
- [ ] Read this guide
- [ ] Backup current environment variables
- [ ] Test locally if possible

### During Deployment
- [ ] Update FRONTEND_URL on Render
- [ ] Push backend changes to GitHub
- [ ] Push frontend changes to GitHub
- [ ] Wait for auto-deploy to complete

### After Deployment
- [ ] Clear browser cache
- [ ] Test referral link
- [ ] Test API calls
- [ ] Test copy button
- [ ] Verify on production domain

---

## ⏱️ Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Update env vars | 1 min | ✅ |
| Push backend | 1 min | ✅ |
| Backend deploy | 2-3 min | ⏳ |
| Push frontend | 1 min | ✅ |
| Frontend deploy | 1-2 min | ⏳ |
| **Total** | **~8 min** | ⏳ |

---

## 🎯 Success Criteria

✅ Referral link shows production domain  
✅ Copy button works  
✅ Referral code is captured  
✅ API calls use production backend  
✅ No console errors  

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Check Render/Vercel deployment logs
4. Verify environment variables are set

---

## ✨ Summary

**What changed**: 2 files  
**What's fixed**: Hardcoded URLs  
**Deployment time**: ~8 minutes  
**Risk level**: Low (no breaking changes)  
**Rollback**: Easy (revert commits)  

**Status**: 🚀 **READY TO DEPLOY**


