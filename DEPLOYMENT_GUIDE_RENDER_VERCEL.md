# 🚀 Deployment Guide: Render + Vercel

Deploy your **Backend** to Render and **Frontend** to Vercel for production.

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (Vercel)          Backend (Render)               │
│  ├─ index.html              ├─ Node.js API                │
│  ├─ login.html              ├─ Express Server             │
│  ├─ admin-dashboard.html    ├─ MongoDB Atlas              │
│  ├─ ba-dashboard.html       └─ Prisma ORM                 │
│  └─ assets/                                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 PART 1: BACKEND DEPLOYMENT (Render)

### Prerequisites
- GitHub account with your repo pushed
- MongoDB Atlas account (free tier available)
- Render account (render.com)

### Step 1: Setup MongoDB Atlas

1. Go to **mongodb.com/cloud/atlas**
2. Create free cluster
3. Create database user (save credentials)
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
5. Add your Render IP to whitelist (or use 0.0.0.0/0 for testing)

### Step 2: Deploy Backend to Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to render.com → Dashboard → New → Web Service**

3. **Connect GitHub repo**
   - Select your repository
   - Branch: `main`

4. **Configure Service**
   - **Name**: `vastu-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for production)

5. **Add Environment Variables** (click "Advanced")
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/vastu_db
   JWT_SECRET=<generate-random-string>
   JWT_REFRESH_SECRET=<generate-random-string>
   CORS_ORIGIN=https://vastu-frontend.vercel.app,https://yourdomain.com
   FRONTEND_URL=https://vastu-frontend.vercel.app
   LOG_LEVEL=info
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=<strong-password>
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (~5 min)
   - Get your backend URL: `https://vastu-backend.onrender.com`

### Step 3: Run Database Migrations

After deployment, run migrations:

```bash
# SSH into Render shell (from dashboard)
npm run migrate
npm run seed
```

Or use Render's one-off job:
- Dashboard → Service → "Run Command"
- Command: `npm run migrate && npm run seed`

---

## 🎨 PART 2: FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Frontend

Your `vercel.json` is already configured. Verify it:

```json
{
  "version": 2,
  "name": "vastu-frontend",
  "public": true,
  "buildCommand": "echo 'Frontend is static HTML'",
  "outputDirectory": ".",
  "env": {
    "REACT_APP_API_URL": "https://vastu-backend.onrender.com/api"
  },
  "headers": [...],
  "rewrites": [...]
}
```

### Step 2: Update Frontend API URL

Edit `assets/js/config.js`:

```javascript
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const isDev = window.location.hostname === 'localhost';
    return isDev 
      ? 'http://localhost:3000/api'
      : 'https://vastu-backend.onrender.com/api';
  }
  return 'https://vastu-backend.onrender.com/api';
};
```

### Step 3: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

2. **Go to vercel.com → Import Project**

3. **Select GitHub repo**
   - Framework: None (static)
   - Root Directory: `.`

4. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://vastu-backend.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (~2 min)
   - Get your frontend URL: `https://vastu-frontend.vercel.app`

### Step 4: Update Backend CORS

Go back to Render dashboard:
1. Service → Settings → Environment
2. Update `CORS_ORIGIN`:
   ```
   https://vastu-frontend.vercel.app,https://yourdomain.com
   ```
3. Redeploy

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Database migrations ran successfully
- [ ] Admin user seeded
- [ ] Frontend can reach backend API
- [ ] Login page works
- [ ] Admin dashboard loads
- [ ] BA dashboard loads
- [ ] CORS errors resolved

### Test API Connection

```bash
# From browser console
fetch('https://vastu-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🔐 PRODUCTION CHECKLIST

- [ ] Change admin password immediately
- [ ] Rotate JWT secrets
- [ ] Enable MongoDB IP whitelist (not 0.0.0.0/0)
- [ ] Setup SSL certificate (Vercel auto, Render auto)
- [ ] Configure custom domain
- [ ] Setup monitoring/alerts
- [ ] Enable database backups
- [ ] Test error handling
- [ ] Load test the API

---

## 📱 Custom Domain Setup

### Vercel
1. Settings → Domains
2. Add domain
3. Update DNS records (Vercel provides them)

### Render
1. Settings → Custom Domain
2. Add domain
3. Update DNS records

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Update `CORS_ORIGIN` in Render env vars |
| 502 Bad Gateway | Check backend logs in Render dashboard |
| Database connection failed | Verify MongoDB IP whitelist |
| Frontend blank page | Check browser console for API errors |
| Migrations failed | Run manually via Render shell |

---

## 📞 Support

- **Render Docs**: render.com/docs
- **Vercel Docs**: vercel.com/docs
- **MongoDB Docs**: mongodb.com/docs


