# Backend Deployment to Render.com

## Prerequisites

- Render.com account (free tier available)
- GitHub repository with code pushed
- MongoDB Atlas account (already configured)
- Environment variables ready

## Step 1: Prepare Repository

### 1.1 Ensure render.yaml exists
```bash
# File should be in root directory
ls -la render.yaml
```

### 1.2 Update package.json scripts
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src --ext .ts"
  }
}
```

### 1.3 Create .gitignore
```
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
.DS_Store
```

### 1.4 Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Create Render Service

### 2.1 Login to Render.com
- Go to https://render.com
- Sign up or login with GitHub

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository containing your code
4. Configure:
   - **Name**: `vastu-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Standard ($7/month) or Free (limited)

### 2.3 Set Environment Variables
In Render dashboard, go to Environment:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb+srv://vaidik_vaastu:XYYmdD1JgA50pdKA@vaastu.sxjlbge.mongodb.net/vastu_db?retryWrites=true&w=majority
DATABASE_NAME=vastu_db
DB_MAX_POOL_SIZE=20
DB_MIN_POOL_SIZE=5
DB_MAX_IDLE_TIME_MS=60000
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://vastu-frontend.vercel.app
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=info
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<change-immediately>
DEFAULT_COMMISSION_TYPE=PERCENTAGE
DEFAULT_COMMISSION_VALUE=10
DEFAULT_GST_PERCENTAGE=18
DEFAULT_EXCLUDE_GST_FROM_BASE=false
REFERRAL_CODE_PREFIX=BA
REFERRAL_CODE_LENGTH=12
MAX_FILE_SIZE=5242880
```

### 2.4 Generate Strong Secrets
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32
```

## Step 3: Deploy

### 3.1 Deploy from Dashboard
1. Click "Create Web Service"
2. Render will automatically deploy from your GitHub repository
3. Monitor deployment in the "Events" tab

### 3.2 Monitor Deployment
- Check logs in "Logs" tab
- Verify health check passes
- Check that service is running

### 3.3 Get Service URL
- Your backend will be available at: `https://vastu-backend.onrender.com`
- Update CORS_ORIGIN in environment variables if needed

## Step 4: Verify Deployment

### 4.1 Test Health Endpoint
```bash
curl https://vastu-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

### 4.2 Test Login Endpoint
```bash
curl -X POST https://vastu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "your-password"
  }'
```

### 4.3 Test Commission Endpoint
```bash
curl https://vastu-backend.onrender.com/api/commission/info
```

## Step 5: Setup Auto-Deployment

### 5.1 Enable Auto-Deploy
1. Go to Settings → Deploy Hook
2. Copy the webhook URL
3. Add to GitHub repository:
   - Settings → Webhooks → Add webhook
   - Paste Render webhook URL
   - Select "Push events"

### 5.2 Automatic Deployments
- Every push to main branch will trigger deployment
- Monitor in Render dashboard

## Step 6: Database Configuration

### 6.1 MongoDB Atlas IP Whitelist
1. Go to MongoDB Atlas dashboard
2. Network Access → IP Whitelist
3. Add Render IP (find in Render logs or use 0.0.0.0/0 for testing)
4. Or use connection string with credentials (already configured)

### 6.2 Verify Connection
Check Render logs for MongoDB connection messages:
```
✅ MongoDB connected successfully
📊 Connection pool size: 20
```

## Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Verify package.json has all dependencies
- Ensure build command is correct

### Service Won't Start
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check logs for errors

### Connection Timeout
- Verify MongoDB Atlas IP whitelist
- Check DATABASE_URL format
- Verify network connectivity

### CORS Errors
- Update CORS_ORIGIN in environment variables
- Include frontend URL (Vercel domain)
- Restart service after updating

## Monitoring

### 1. View Logs
```bash
# In Render dashboard
Logs → View logs
```

### 2. Monitor Performance
- Check CPU and memory usage
- Monitor response times
- Track error rates

### 3. Setup Alerts
- Render → Settings → Alerts
- Configure email notifications for failures

## Scaling

### 1. Upgrade Plan
- Free: Limited resources, auto-sleeps
- Standard: $7/month, always running
- Pro: $12/month, more resources

### 2. Horizontal Scaling
- Add more instances if needed
- Configure load balancing

## Cost Estimation

- **Free Plan**: $0/month (limited)
- **Standard Plan**: $7/month (recommended)
- **Pro Plan**: $12/month (high traffic)
- **MongoDB Atlas**: Free tier or paid

## Next Steps

1. ✅ Deploy backend to Render
2. ⏭️ Deploy frontend to Vercel (see VERCEL_DEPLOYMENT.md)
3. ⏭️ Configure custom domain
4. ⏭️ Setup monitoring and alerts
5. ⏭️ Configure backups

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- GitHub: https://github.com

