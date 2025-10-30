# Quick Start - Deploy to Render & Vercel

## 🚀 5-Minute Quick Start

### Prerequisites
- GitHub account with code pushed
- Render.com account
- Vercel account
- MongoDB Atlas connection string

---

## Step 1: Backend to Render (5 minutes)

### 1.1 Go to Render
```
https://render.com → Sign in with GitHub
```

### 1.2 Create Web Service
```
New → Web Service → Select your repository
```

### 1.3 Configure
```
Name: vastu-backend
Environment: Node
Build: npm install && npm run build
Start: npm start
Plan: Standard ($7/month)
```

### 1.4 Set Environment Variables
Copy-paste these into Render dashboard (Settings → Environment):

```
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb+srv://vaidik_vaastu:XYYmdD1JgA50pdKA@vaastu.sxjlbge.mongodb.net/vastu_db?retryWrites=true&w=majority
DATABASE_NAME=vastu_db
DB_MAX_POOL_SIZE=20
DB_MIN_POOL_SIZE=5
DB_MAX_IDLE_TIME_MS=60000
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=https://vastu-frontend.vercel.app,https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=info
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
DEFAULT_COMMISSION_TYPE=PERCENTAGE
DEFAULT_COMMISSION_VALUE=10
DEFAULT_GST_PERCENTAGE=18
DEFAULT_EXCLUDE_GST_FROM_BASE=false
REFERRAL_CODE_PREFIX=BA
REFERRAL_CODE_LENGTH=12
MAX_FILE_SIZE=5242880
```

### 1.5 Deploy
```
Click "Create Web Service"
Wait for deployment (2-3 minutes)
Get URL: https://vastu-backend.onrender.com
```

### 1.6 Verify
```bash
curl https://vastu-backend.onrender.com/health
# Should return: {"status":"OK","timestamp":"..."}
```

---

## Step 2: Frontend to Vercel (3 minutes)

### 2.1 Go to Vercel
```
https://vercel.com → Sign in with GitHub
```

### 2.2 Import Project
```
Add New → Project → Import Git Repository
Select your repository
```

### 2.3 Configure
```
Project Name: vastu-frontend
Framework: Other (static)
Root Directory: .
Build Command: (leave empty)
Output Directory: .
```

### 2.4 Set Environment Variable
```
REACT_APP_API_URL=https://vastu-backend.onrender.com/api
```

### 2.5 Deploy
```
Click "Deploy"
Wait for deployment (1-2 minutes)
Get URL: https://vastu-frontend.vercel.app
```

### 2.6 Verify
```
Open https://vastu-frontend.vercel.app
Should see login page
```

---

## Step 3: Test Integration (2 minutes)

### 3.1 Test Login
```
1. Go to https://vastu-frontend.vercel.app
2. Enter: admin@yourdomain.com
3. Enter password you set
4. Should login successfully
```

### 3.2 Check Console
```
1. Open DevTools (F12)
2. Go to Console tab
3. Should see: 🔧 APP Configuration: {...}
4. Should see: 📡 API Base URL: https://vastu-backend.onrender.com/api
```

### 3.3 Test API
```
In Console, run:
fetch(APP_CONFIG.API_BASE_URL + '/health')
  .then(r => r.json())
  .then(d => console.log(d))

Should return: {status: "OK", timestamp: "..."}
```

---

## Step 4: Custom Domain (Optional, 10 minutes)

### 4.1 Add Domain to Vercel
```
Vercel Dashboard → Settings → Domains
Add Domain: yourdomain.com
```

### 4.2 Update DNS
Add these records to your domain provider:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.132
```

### 4.3 Update Backend CORS
```
Render Dashboard → vastu-backend → Environment
Update CORS_ORIGIN:
https://yourdomain.com,https://www.yourdomain.com,https://vastu-frontend.vercel.app

Save → Service redeploys automatically
```

### 4.4 Verify
```
Wait 5-48 hours for DNS propagation
Visit https://yourdomain.com
Should work!
```

---

## 🔑 Generate Strong Secrets

### Using OpenSSL
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32
```

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using Python
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] Health endpoint working
- [ ] Login working
- [ ] API connectivity verified
- [ ] No console errors
- [ ] Custom domain configured (optional)

---

## 🆘 Troubleshooting

### Backend Won't Deploy
```
Check Render logs:
Render Dashboard → vastu-backend → Logs
Look for error messages
```

### Frontend Won't Load
```
Check Vercel logs:
Vercel Dashboard → Deployments → View logs
Look for build errors
```

### API Connection Error
```
1. Check CORS_ORIGIN in Render
2. Verify REACT_APP_API_URL in Vercel
3. Check browser console for errors
4. Verify backend is running
```

### Login Fails
```
1. Check admin credentials
2. Verify database connection
3. Check backend logs
4. Verify JWT_SECRET is set
```

---

## 📊 URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | https://vastu-frontend.vercel.app |
| Backend | https://vastu-backend.onrender.com |
| API | https://vastu-backend.onrender.com/api |
| Health | https://vastu-backend.onrender.com/health |

---

## 💰 Cost Estimation

| Service | Cost |
|---------|------|
| Render (Backend) | $7/month |
| Vercel (Frontend) | Free or $20/month |
| MongoDB Atlas | Free or paid |
| **Total** | **~$7-27/month** |

---

## 🎯 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ⏭️ Configure custom domain
4. ⏭️ Setup monitoring
5. ⏭️ Configure backups
6. ⏭️ Train team

---

## 📚 Full Documentation

For detailed information, see:
- `ENV_SETUP_GUIDE.md` - Environment variables
- `RENDER_DEPLOYMENT.md` - Backend deployment
- `VERCEL_DEPLOYMENT.md` - Frontend deployment
- `DEPLOYMENT_CHECKLIST.md` - Complete checklist

---

## ⏱️ Total Time

- Backend: 5 minutes
- Frontend: 3 minutes
- Testing: 2 minutes
- Custom Domain: 10 minutes (optional)
- **Total: 10-20 minutes**

---

**Status**: ✅ Ready to Deploy  
**Last Updated**: 2025-10-29

