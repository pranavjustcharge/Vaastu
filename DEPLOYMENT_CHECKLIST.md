# Complete Deployment Checklist

## Pre-Deployment Phase

### Environment Configuration
- [ ] All hardcoded values moved to environment variables
- [ ] `.env.example` created with all required variables
- [ ] `src/config/env.ts` updated with all configuration options
- [ ] `assets/js/config.js` created for frontend configuration
- [ ] All HTML files updated to use `config.js`
- [ ] `.gitignore` includes `.env` files
- [ ] No secrets committed to repository

### Backend Configuration
- [ ] `render.yaml` created for Render deployment
- [ ] `package.json` has correct build and start scripts
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] All dependencies listed in `package.json`
- [ ] `tsconfig.json` configured correctly
- [ ] No TypeScript errors

### Frontend Configuration
- [ ] `vercel.json` created for Vercel deployment
- [ ] `assets/js/config.js` includes all configuration
- [ ] All HTML files include `<script src="assets/js/config.js"></script>`
- [ ] API_BASE_URL uses `APP_CONFIG.API_BASE_URL`
- [ ] Storage keys use `APP_CONFIG.STORAGE_KEYS`
- [ ] No hardcoded API URLs in HTML files
- [ ] All assets are in correct directories

### Documentation
- [ ] `ENV_SETUP_GUIDE.md` created
- [ ] `RENDER_DEPLOYMENT.md` created
- [ ] `VERCEL_DEPLOYMENT.md` created
- [ ] `DEPLOYMENT_CHECKLIST.md` created (this file)
- [ ] README.md updated with deployment instructions
- [ ] All guides are clear and complete

### Repository
- [ ] Code committed to GitHub
- [ ] All changes pushed to main branch
- [ ] Repository is public (for Vercel/Render integration)
- [ ] GitHub account connected to Vercel
- [ ] GitHub account connected to Render

## Backend Deployment (Render)

### Render Setup
- [ ] Render.com account created
- [ ] GitHub repository connected to Render
- [ ] New Web Service created
- [ ] Service name: `vastu-backend`
- [ ] Environment: Node
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Plan selected (Standard recommended)

### Environment Variables (Render)
- [ ] DATABASE_URL set (MongoDB Atlas)
- [ ] DATABASE_NAME set
- [ ] DB_MAX_POOL_SIZE set (20)
- [ ] DB_MIN_POOL_SIZE set (5)
- [ ] JWT_SECRET set (strong, generated)
- [ ] JWT_REFRESH_SECRET set (strong, generated)
- [ ] CORS_ORIGIN set (includes Vercel domain)
- [ ] FRONTEND_URL set
- [ ] LOG_LEVEL set (info)
- [ ] ADMIN_EMAIL set
- [ ] ADMIN_PASSWORD set (strong)
- [ ] NODE_ENV set (production)
- [ ] All commission settings configured
- [ ] All referral settings configured

### Render Deployment
- [ ] Service deployed successfully
- [ ] Deployment logs show no errors
- [ ] Health check endpoint responds (GET /health)
- [ ] Service URL obtained: `https://vastu-backend.onrender.com`
- [ ] Auto-deploy from GitHub enabled
- [ ] Logs accessible and monitored

### Backend Verification
- [ ] Health endpoint working: `https://vastu-backend.onrender.com/health`
- [ ] Login endpoint working: `POST /api/auth/login`
- [ ] Commission endpoint working: `GET /api/commission/info`
- [ ] Database connection verified in logs
- [ ] No errors in logs
- [ ] Response times acceptable

## Frontend Deployment (Vercel)

### Vercel Setup
- [ ] Vercel.com account created
- [ ] GitHub repository connected to Vercel
- [ ] Project imported
- [ ] Project name: `vastu-frontend`
- [ ] Framework: Static
- [ ] Root directory: `.`

### Environment Variables (Vercel)
- [ ] REACT_APP_API_URL set to Render backend URL
- [ ] Example: `https://vastu-backend.onrender.com/api`

### Vercel Deployment
- [ ] Project deployed successfully
- [ ] Deployment logs show no errors
- [ ] Vercel URL obtained: `https://vastu-frontend.vercel.app`
- [ ] Auto-deploy from GitHub enabled
- [ ] Deployments accessible and monitored

### Frontend Verification
- [ ] Frontend loads at Vercel URL
- [ ] Login page displays correctly
- [ ] API configuration loaded (check console)
- [ ] Login functionality works
- [ ] API calls go to correct backend
- [ ] No CORS errors in console
- [ ] No 404 errors for assets

## Custom Domain Setup (Optional)

### Domain Configuration
- [ ] Domain registered
- [ ] Domain provider account accessible
- [ ] DNS records accessible

### Vercel Domain
- [ ] Domain added to Vercel project
- [ ] DNS records configured:
  - [ ] CNAME record for www
  - [ ] A record for root domain
- [ ] DNS propagation verified (5-48 hours)
- [ ] SSL certificate auto-generated
- [ ] Domain accessible via HTTPS

### Render Domain (Optional)
- [ ] Custom domain added to Render service
- [ ] DNS records configured
- [ ] SSL certificate configured
- [ ] Domain accessible

### Backend CORS Update
- [ ] CORS_ORIGIN updated in Render environment
- [ ] Includes custom domain
- [ ] Includes Vercel domain
- [ ] Service redeployed
- [ ] CORS errors resolved

## Security Verification

### Secrets Management
- [ ] No secrets in `.env` file (git ignored)
- [ ] No secrets in code
- [ ] No secrets in documentation
- [ ] Secrets stored in Render dashboard
- [ ] Secrets stored in Vercel dashboard
- [ ] JWT secrets are strong (32+ characters)
- [ ] Admin password is strong

### HTTPS/TLS
- [ ] Frontend uses HTTPS
- [ ] Backend uses HTTPS
- [ ] SSL certificates valid
- [ ] No mixed content warnings
- [ ] Security headers present

### CORS Configuration
- [ ] CORS_ORIGIN correctly configured
- [ ] Only necessary origins allowed
- [ ] Credentials properly handled
- [ ] Preflight requests working

### Input Validation
- [ ] All API inputs validated
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Rate limiting configured (if needed)

## Monitoring & Logging

### Backend Monitoring
- [ ] Logs accessible in Render dashboard
- [ ] Error logs reviewed
- [ ] Performance metrics visible
- [ ] Database connection logged
- [ ] Alerts configured (optional)

### Frontend Monitoring
- [ ] Deployments visible in Vercel dashboard
- [ ] Build logs reviewed
- [ ] Performance metrics visible
- [ ] Error tracking configured (optional)

### Application Monitoring
- [ ] Health check endpoint working
- [ ] Error responses logged
- [ ] API response times acceptable
- [ ] Database queries optimized

## Testing

### Functional Testing
- [ ] Login works with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Admin dashboard loads
- [ ] BA dashboard loads
- [ ] Commission settings display
- [ ] Referral system works
- [ ] All API endpoints respond

### Integration Testing
- [ ] Frontend connects to backend
- [ ] API calls return correct data
- [ ] Authentication tokens work
- [ ] Refresh token mechanism works
- [ ] Database operations work

### Performance Testing
- [ ] Page load time acceptable
- [ ] API response time acceptable
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] No console errors

### Security Testing
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] No secrets exposed
- [ ] Authentication required for protected endpoints

## Post-Deployment

### Monitoring (First 24 Hours)
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Monitor database performance
- [ ] Monitor API response times
- [ ] Check for any issues

### Monitoring (First Week)
- [ ] Review error patterns
- [ ] Check user feedback
- [ ] Monitor resource usage
- [ ] Verify backups working
- [ ] Check security logs

### Ongoing Maintenance
- [ ] Regular security updates
- [ ] Dependency updates
- [ ] Database maintenance
- [ ] Log rotation
- [ ] Backup verification
- [ ] Performance optimization

## Rollback Plan

### If Issues Occur
- [ ] Identify the issue
- [ ] Check logs for errors
- [ ] Rollback to previous version (if needed)
- [ ] Verify rollback successful
- [ ] Investigate root cause
- [ ] Fix and redeploy

### Rollback Steps
1. Go to Render/Vercel dashboard
2. Select previous deployment
3. Click "Redeploy"
4. Verify application works
5. Investigate issue
6. Fix and redeploy

## Success Criteria

✅ **Deployment is successful when:**
- [ ] Backend running on Render
- [ ] Frontend running on Vercel
- [ ] Both accessible via HTTPS
- [ ] API communication working
- [ ] All features functional
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Monitoring configured
- [ ] Team trained on deployment

## Support & Documentation

- **ENV_SETUP_GUIDE.md** - Environment variable setup
- **RENDER_DEPLOYMENT.md** - Backend deployment steps
- **VERCEL_DEPLOYMENT.md** - Frontend deployment steps
- **README.md** - Project overview
- **PRODUCTION_CHECKLIST.md** - Production readiness

## Sign-Off

- [ ] Backend deployed and verified
- [ ] Frontend deployed and verified
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Team trained
- [ ] Ready for production

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Verified By**: _______________  

---

**Next Steps:**
1. Monitor application for 24 hours
2. Gather user feedback
3. Optimize based on metrics
4. Plan future enhancements

