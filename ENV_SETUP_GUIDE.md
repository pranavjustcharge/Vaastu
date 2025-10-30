# Environment Configuration Guide

## Overview

All configuration values have been moved to environment variables. This guide explains how to set them up for different environments.

## Environment Files

### Development (.env)
Used for local development with `npm run dev`

```bash
# Copy example file
cp .env.example .env

# Edit with your local values
nano .env
```

### Production (.env.production)
Used for production deployment with `npm start`

```bash
# Copy example file
cp .env.example .env.production

# Edit with your production values
nano .env.production
```

## Configuration Variables

### Database Configuration

```env
# MongoDB Atlas Connection
DATABASE_URL=mongodb+srv://vaidik_vaastu:XYYmdD1JgA50pdKA@vaastu.sxjlbge.mongodb.net/vastu_db?retryWrites=true&w=majority
DATABASE_NAME=vastu_db

# Connection Pool Settings
DB_MAX_POOL_SIZE=10          # Development: 10, Production: 20
DB_MIN_POOL_SIZE=2           # Development: 2, Production: 5
DB_MAX_IDLE_TIME_MS=60000    # 60 seconds
```

### Server Configuration

```env
# Port
PORT=3000

# Environment
NODE_ENV=development         # development or production

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5000
```

### JWT Authentication

```env
# Generate strong secrets using:
# openssl rand -base64 32

JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRY=7d
```

### CORS Configuration

```env
# Comma-separated list of allowed origins
CORS_ORIGIN=http://localhost:3000,http://localhost:5000,http://localhost:5173

# Production example:
# CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://vastu-frontend.vercel.app
```

### Logging

```env
# Log levels: debug, info, warn, error
LOG_LEVEL=debug              # Development
LOG_LEVEL=info               # Production
```

### Admin Credentials

```env
# Default admin account (change immediately after first login)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!

# Production:
# ADMIN_EMAIL=admin@yourdomain.com
# ADMIN_PASSWORD=<strong-password>
```

### Commission Settings

```env
# Default commission type: PERCENTAGE or FIXED
DEFAULT_COMMISSION_TYPE=PERCENTAGE

# Default commission value
DEFAULT_COMMISSION_VALUE=10

# GST percentage
DEFAULT_GST_PERCENTAGE=18

# Exclude GST from base commission calculation
DEFAULT_EXCLUDE_GST_FROM_BASE=false
```

### Referral System

```env
# Referral code prefix
REFERRAL_CODE_PREFIX=BA

# Referral code length (excluding prefix)
REFERRAL_CODE_LENGTH=12
```

### File Upload

```env
# Maximum file size in bytes (5MB)
MAX_FILE_SIZE=5242880
```

## Environment-Specific Setup

### Local Development

```bash
# 1. Copy example file
cp .env.example .env

# 2. Update values for local development
DATABASE_URL=mongodb://localhost:27017/vastu_db
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000,http://localhost:5000,http://localhost:5173
LOG_LEVEL=debug

# 3. Generate JWT secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# 4. Start development server
npm run dev
```

### Render Deployment

```bash
# 1. Create .env.production
cp .env.example .env.production

# 2. Update for production
NODE_ENV=production
DATABASE_URL=mongodb+srv://vaidik_vaastu:XYYmdD1JgA50pdKA@vaastu.sxjlbge.mongodb.net/vastu_db?retryWrites=true&w=majority
PORT=3000
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://vastu-frontend.vercel.app
LOG_LEVEL=info

# 3. Generate strong secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# 4. Set in Render dashboard
# Go to Render → vastu-backend → Environment
# Add all variables from .env.production
```

### Vercel Deployment

```bash
# 1. Set environment variable in Vercel dashboard
# Settings → Environment Variables

REACT_APP_API_URL=https://vastu-backend.onrender.com/api

# 2. Or for custom domain
REACT_APP_API_URL=https://api.yourdomain.com/api

# 3. Frontend automatically uses config.js
# which reads REACT_APP_API_URL
```

## Generating Secure Secrets

### Generate JWT Secret
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Generate Admin Password
```bash
# Using OpenSSL
openssl rand -base64 16

# Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Validation

### Check Environment Variables
```bash
# View all environment variables
env | grep -E "DATABASE_URL|JWT_SECRET|CORS_ORIGIN"

# Check specific variable
echo $DATABASE_URL
```

### Validate Configuration
```bash
# Start application and check logs
npm run dev

# Look for:
# ✅ MongoDB connected successfully
# ✅ Server running on port 3000
# ✅ CORS configured for: ...
```

## Security Best Practices

### 1. Never Commit Secrets
```bash
# .gitignore should include
.env
.env.local
.env.*.local
```

### 2. Use Secrets Manager
- **Render**: Use environment variables in dashboard
- **Vercel**: Use environment variables in dashboard
- **Production**: Use AWS Secrets Manager, HashiCorp Vault, etc.

### 3. Rotate Secrets Regularly
- Change JWT_SECRET every 90 days
- Change admin password immediately after first login
- Update CORS_ORIGIN when adding new domains

### 4. Restrict Access
- Only share secrets with authorized team members
- Use role-based access control
- Audit secret access logs

## Troubleshooting

### Application Won't Start
```bash
# Check if required variables are set
echo $DATABASE_URL
echo $JWT_SECRET

# Check .env file syntax
cat .env

# Verify values are correct
npm run dev
```

### Database Connection Failed
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
mongosh "$DATABASE_URL"

# Check MongoDB Atlas IP whitelist
# https://cloud.mongodb.com/v2/...
```

### CORS Errors
```bash
# Check CORS_ORIGIN
echo $CORS_ORIGIN

# Verify frontend URL is included
# Should include: http://localhost:5000 (dev) or https://yourdomain.com (prod)

# Restart server after changing
npm run dev
```

### JWT Errors
```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Should be at least 32 characters
# Regenerate if needed
openssl rand -base64 32
```

## Environment Variables Checklist

### Development
- [ ] DATABASE_URL (local or Atlas)
- [ ] JWT_SECRET (generated)
- [ ] JWT_REFRESH_SECRET (generated)
- [ ] CORS_ORIGIN (includes localhost)
- [ ] FRONTEND_URL (localhost)
- [ ] LOG_LEVEL (debug)
- [ ] ADMIN_EMAIL (test account)
- [ ] ADMIN_PASSWORD (test password)

### Production (Render)
- [ ] DATABASE_URL (MongoDB Atlas)
- [ ] JWT_SECRET (strong, generated)
- [ ] JWT_REFRESH_SECRET (strong, generated)
- [ ] CORS_ORIGIN (production domains)
- [ ] FRONTEND_URL (production domain)
- [ ] LOG_LEVEL (info)
- [ ] ADMIN_EMAIL (production email)
- [ ] ADMIN_PASSWORD (strong, changed after login)
- [ ] NODE_ENV (production)

### Frontend (Vercel)
- [ ] REACT_APP_API_URL (backend URL)

## Next Steps

1. ✅ Setup environment variables
2. ⏭️ Test locally with `npm run dev`
3. ⏭️ Deploy backend to Render (see RENDER_DEPLOYMENT.md)
4. ⏭️ Deploy frontend to Vercel (see VERCEL_DEPLOYMENT.md)
5. ⏭️ Configure custom domain
6. ⏭️ Setup monitoring and alerts

