# ✅ Action Checklist - Referral Link Fix

**Status**: 🚀 **READY TO DEPLOY**

---

## 📋 Pre-Deployment Checklist

### Code Review
- [x] Backend fix reviewed (`src/services/baService.ts`)
- [x] Frontend fix reviewed (`script.js`)
- [x] No breaking changes
- [x] Backward compatible
- [x] No TypeScript errors
- [x] No linting issues

### Testing
- [ ] Test locally (if possible)
- [ ] Verify referral link format
- [ ] Verify API URL format
- [ ] Check console for errors

---

## 🔧 Deployment Checklist

### Step 1: Update Environment Variables
**On Render Dashboard**

- [ ] Go to https://dashboard.render.com
- [ ] Select backend service
- [ ] Click "Environment"
- [ ] Add/Update: `FRONTEND_URL=https://www.vaidikvaastu.com`
- [ ] Verify other variables exist:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `CORS_ORIGIN`
  - [ ] `NODE_ENV=production`
- [ ] Save changes

### Step 2: Deploy Backend
**Option A: Auto-Deploy (Recommended)**

```bash
# In your local terminal
cd /path/to/project

# Commit changes
git add src/services/baService.ts
git commit -m "fix: Use dynamic FRONTEND_URL for referral links"

# Push to GitHub
git push origin main
```

- [ ] Changes pushed to GitHub
- [ ] Render auto-deploy started
- [ ] Wait 2-3 minutes for deployment
- [ ] Check Render dashboard for "Deploy successful"

**Option B: Manual Deploy**

- [ ] Go to Render dashboard
- [ ] Select backend service
- [ ] Click "Manual Deploy"
- [ ] Wait for deployment to complete

### Step 3: Deploy Frontend
**Option A: Auto-Deploy (Recommended)**

```bash
# In your local terminal
cd /path/to/project

# Commit changes
git add script.js
git commit -m "fix: Use dynamic API_BASE_URL from config.js"

# Push to GitHub
git push origin main
```

- [ ] Changes pushed to GitHub
- [ ] Vercel auto-deploy started
- [ ] Wait 1-2 minutes for deployment
- [ ] Check Vercel dashboard for "Deployment successful"

**Option B: Manual Deploy**

- [ ] Go to Vercel dashboard
- [ ] Select frontend project
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete

---

## ✅ Post-Deployment Verification

### Test 1: Referral Link Format
- [ ] Login to BA dashboard: https://www.vaidikvaastu.com/ba-dashboard.html
- [ ] Scroll to "Your Referral Link" section
- [ ] Verify link shows: `https://www.vaidikvaastu.com/business_associate.html?ref=...`
- [ ] ✅ Should NOT contain `localhost`

### Test 2: Copy Referral Link
- [ ] Click "📋 Copy Link" button
- [ ] Paste in notepad
- [ ] Verify format is correct
- [ ] ✅ Should be production URL

### Test 3: Test Referral Link
- [ ] Open referral link in new tab
- [ ] Should open BA registration form
- [ ] Referral code should be pre-filled
- [ ] ✅ Should work without errors

### Test 4: API Calls
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Refresh BA dashboard
- [ ] Check API calls
- [ ] ✅ Should call `https://vaastu.onrender.com/api`

### Test 5: Console Errors
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Refresh page
- [ ] ✅ Should have no errors
- [ ] ✅ Should see "✅ API_BASE_URL initialized"

---

## 🧪 Quick Test Commands

### Test Backend Health
```bash
curl https://vaastu.onrender.com/health
# Expected: {"status":"ok"}
```

### Test Frontend
```bash
curl https://www.vaidikvaastu.com/
# Expected: HTML content
```

### Test Referral Endpoint (requires auth token)
```bash
curl -H "Authorization: Bearer <your-token>" \
  https://vaastu.onrender.com/api/ba/referral-info
# Expected: referral link with production domain
```

---

## 🔍 Troubleshooting

### Issue: Referral link still shows localhost
**Solution**:
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh (Ctrl+F5)
- [ ] Check if backend deployment completed
- [ ] Verify FRONTEND_URL is set on Render
- [ ] Wait 5 minutes and try again

### Issue: API calls still fail
**Solution**:
- [ ] Check if frontend deployment completed
- [ ] Clear browser cache
- [ ] Hard refresh page
- [ ] Check browser console for errors
- [ ] Verify CORS_ORIGIN includes your domain

### Issue: Deployment stuck
**Solution**:
- [ ] Check Render/Vercel dashboard for errors
- [ ] Check git logs for commit issues
- [ ] Try manual deploy
- [ ] Contact support if needed

---

## 📊 Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Update env vars | 1 min | ⏳ |
| Push backend | 1 min | ⏳ |
| Backend deploy | 2-3 min | ⏳ |
| Push frontend | 1 min | ⏳ |
| Frontend deploy | 1-2 min | ⏳ |
| Verification | 5 min | ⏳ |
| **Total** | **~13 min** | ⏳ |

---

## 🎯 Success Criteria

All of these should be true after deployment:

- [ ] Referral link shows production domain
- [ ] Copy button works
- [ ] Referral code is captured
- [ ] API calls use production backend
- [ ] No console errors
- [ ] Works on production domain
- [ ] Works on localhost (dev)
- [ ] No broken functionality

---

## 📞 Rollback Plan

If something goes wrong:

```bash
# Revert backend
git revert <commit-hash>
git push origin main

# Revert frontend
git revert <commit-hash>
git push origin main
```

---

## 📝 Notes

- Deployment is low-risk (no breaking changes)
- Easy to rollback if needed
- No code changes needed after deployment
- Works on any domain

---

## ✨ Final Checklist

- [ ] All pre-deployment checks done
- [ ] Environment variables updated
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] All post-deployment tests passed
- [ ] No issues found
- [ ] Ready for production use

---

## 🎉 Deployment Complete!

Once all checks are done, your referral system will work on production!

**Status**: 🚀 **READY TO DEPLOY**


