# Frontend Deployment to Vercel

## Prerequisites

- Vercel account (free tier available)
- GitHub repository with frontend code
- Backend deployed to Render (or other service)
- Custom domain (optional)

## Step 1: Prepare Frontend

### 1.1 Ensure vercel.json exists
```bash
# File should be in root directory
ls -la vercel.json
```

### 1.2 Ensure config.js exists
```bash
# Frontend configuration file
ls -la assets/js/config.js
```

### 1.3 Update HTML files
All HTML files should include:
```html
<script src="assets/js/config.js"></script>
```

### 1.4 Verify API URLs
Check that all HTML files use `APP_CONFIG.API_BASE_URL` instead of hardcoded URLs.

### 1.5 Push to GitHub
```bash
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### 2.1 Login to Vercel
- Go to https://vercel.com
- Sign up or login with GitHub

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Search for your repository
4. Click "Import"

### 2.3 Configure Project
1. **Project Name**: `vastu-frontend`
2. **Framework Preset**: Other (since it's static HTML)
3. **Root Directory**: `.` (current directory)
4. **Build Command**: Leave empty (static files)
5. **Output Directory**: `.` (current directory)

### 2.4 Set Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:

```
REACT_APP_API_URL=https://vastu-backend.onrender.com/api
```

Or if using custom domain:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### 2.5 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Get your Vercel URL: `https://vastu-frontend.vercel.app`

## Step 3: Configure API Proxy (Optional)

### 3.1 Update vercel.json
If you want API requests to go through Vercel:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://vastu-backend.onrender.com/api/$1"
    }
  ]
}
```

### 3.2 Update config.js
```javascript
// In assets/js/config.js
function getApiBaseUrl() {
  if (hostname.includes('vercel.app')) {
    return '/api';  // Use relative path
  }
  return 'https://vastu-backend.onrender.com/api';
}
```

## Step 4: Configure Custom Domain

### 4.1 Add Domain to Vercel
1. Go to Settings → Domains
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration instructions

### 4.2 Update DNS Records
Add these DNS records to your domain provider:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.132
```

### 4.3 Verify Domain
- Wait for DNS propagation (5-48 hours)
- Vercel will automatically verify
- Your site will be available at `https://yourdomain.com`

## Step 5: Update Backend CORS

### 5.1 Update Render Environment
1. Go to Render dashboard
2. Select `vastu-backend` service
3. Go to Environment
4. Update `CORS_ORIGIN`:

```
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://vastu-frontend.vercel.app
```

5. Click "Save Changes"
6. Service will redeploy automatically

## Step 6: Verify Deployment

### 6.1 Test Frontend
1. Open https://yourdomain.com
2. Test login functionality
3. Check browser console for errors
4. Verify API calls are working

### 6.2 Test API Connectivity
```bash
# From browser console
fetch(APP_CONFIG.API_BASE_URL + '/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### 6.3 Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform login
4. Verify API requests go to correct backend URL
5. Check response status is 200

## Step 7: Setup Auto-Deployment

### 7.1 Enable Auto-Deploy
1. Go to Settings → Git
2. Ensure "Deploy on push" is enabled
3. Select branch: `main`

### 7.2 Automatic Deployments
- Every push to main branch triggers deployment
- Monitor in Deployments tab
- Rollback if needed

## Step 8: Performance Optimization

### 8.1 Enable Caching
Vercel automatically caches:
- Static assets (CSS, JS, images)
- HTML files (with revalidation)

### 8.2 Optimize Images
- Use modern formats (WebP)
- Compress images
- Use responsive images

### 8.3 Monitor Performance
1. Go to Analytics
2. Check Core Web Vitals
3. Monitor response times

## Troubleshooting

### Blank Page
- Check browser console for errors
- Verify config.js is loaded
- Check API_BASE_URL is correct

### API Connection Errors
- Verify backend is running
- Check CORS_ORIGIN includes frontend URL
- Check API_BASE_URL in config.js
- Verify network connectivity

### 404 Errors
- Ensure all HTML files are in root directory
- Check vercel.json rewrites configuration
- Verify file paths are correct

### Slow Performance
- Check image sizes
- Minimize CSS/JS
- Enable caching headers
- Use CDN for assets

## Monitoring

### 1. View Deployments
- Vercel Dashboard → Deployments
- See deployment history
- Rollback if needed

### 2. Monitor Analytics
- Vercel Dashboard → Analytics
- Track page views
- Monitor performance metrics

### 3. Setup Alerts
- Vercel → Settings → Alerts
- Configure email notifications

## Cost Estimation

- **Hobby Plan**: Free (recommended for testing)
- **Pro Plan**: $20/month (production)
- **Enterprise**: Custom pricing

## Environment Variables by Environment

### Development
```
REACT_APP_API_URL=http://localhost:3000/api
```

### Production (Vercel)
```
REACT_APP_API_URL=https://vastu-backend.onrender.com/api
```

### Custom Domain
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render
3. ⏭️ Configure custom domain
4. ⏭️ Setup SSL/TLS (automatic with Vercel)
5. ⏭️ Configure monitoring
6. ⏭️ Setup backups

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub: https://github.com

