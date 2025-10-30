# ⚡ Quick Deploy Checklist

## 🎯 5-Minute Deployment Summary

### BEFORE YOU START
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Render account created
- [ ] Vercel account created

---

## 🔴 STEP 1: Deploy Backend (Render) - 5 min

```
1. render.com → New Web Service
2. Connect GitHub repo
3. Name: vastu-backend
4. Build: npm install && npm run build
5. Start: npm start
6. Add env vars (see below)
7. Deploy
8. Copy backend URL
```

### Required Env Vars for Render
```
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/vastu_db
JWT_SECRET=<random-string>
JWT_REFRESH_SECRET=<random-string>
CORS_ORIGIN=https://vastu-frontend.vercel.app
FRONTEND_URL=https://vastu-frontend.vercel.app
LOG_LEVEL=info
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<strong-password>
```

### After Deploy
```bash
# Run migrations (Render Dashboard → Run Command)
npm run migrate && npm run seed
```

---

## 🔵 STEP 2: Deploy Frontend (Vercel) - 3 min

```
1. vercel.com → Import Project
2. Select GitHub repo
3. Framework: None
4. Deploy
5. Copy frontend URL
```

### Update Backend CORS
Go back to Render:
```
CORS_ORIGIN=https://vastu-frontend.vercel.app
```
Redeploy backend.

---

## ✅ VERIFY DEPLOYMENT

### Test Backend
```bash
curl https://vastu-backend.onrender.com/api/health
```

### Test Frontend
```
Open: https://vastu-frontend.vercel.app
Try login with admin credentials
```

### Check API Connection
```javascript
// Browser console
fetch('https://vastu-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🔐 IMMEDIATE ACTIONS

- [ ] Change admin password
- [ ] Rotate JWT secrets
- [ ] Whitelist MongoDB IPs
- [ ] Setup custom domain (optional)
- [ ] Enable monitoring

---

## 📊 Your URLs

```
Backend:  https://vastu-backend.onrender.com
Frontend: https://vastu-frontend.vercel.app
API:      https://vastu-backend.onrender.com/api
```

---

## 🆘 Common Issues

| Problem | Fix |
|---------|-----|
| CORS error | Update CORS_ORIGIN in Render |
| 502 error | Check Render logs |
| DB connection failed | Check MongoDB whitelist |
| Blank page | Check browser console |

---

## 📞 Need Help?

- Render Docs: render.com/docs
- Vercel Docs: vercel.com/docs
- Full guide: See DEPLOYMENT_GUIDE_RENDER_VERCEL.md


