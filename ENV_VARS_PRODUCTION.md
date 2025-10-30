# 🔐 Production Environment Variables

## Render Backend Environment Variables

Copy these into Render Dashboard → Service → Settings → Environment Variables

### Database
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/vastu_db?retryWrites=true&w=majority
DATABASE_NAME=vastu_db
DB_MAX_POOL_SIZE=20
DB_MIN_POOL_SIZE=5
DB_MAX_IDLE_TIME_MS=60000
```

### Server
```
NODE_ENV=production
PORT=3000
```

### JWT Authentication
```
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-32>
JWT_REFRESH_EXPIRY=7d
```

### CORS & Frontend
```
CORS_ORIGIN=https://vastu-frontend.vercel.app,https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL=https://vastu-frontend.vercel.app
```

### Logging
```
LOG_LEVEL=info
```

### Admin Credentials (Change immediately after first login!)
```
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password-min-12-chars>
```

### Commission Settings
```
DEFAULT_COMMISSION_TYPE=PERCENTAGE
DEFAULT_COMMISSION_VALUE=10
DEFAULT_GST_PERCENTAGE=18
DEFAULT_EXCLUDE_GST_FROM_BASE=false
```

### Referral System
```
REFERRAL_CODE_PREFIX=BA
REFERRAL_CODE_LENGTH=12
```

### File Upload
```
MAX_FILE_SIZE=5242880
```

---

## How to Generate Secure Secrets

### On Linux/Mac
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32
```

### On Windows (PowerShell)
```powershell
# Generate JWT_SECRET
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))

# Or use online generator: https://www.uuidgenerator.net/
```

---

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to mongodb.com/cloud/atlas
   - Create free cluster
   - Choose region closest to your users

2. **Create Database User**
   - Database Access → Add Database User
   - Username: `vastu_user`
   - Password: Generate strong password
   - Save credentials

3. **Get Connection String**
   - Clusters → Connect → Drivers
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Replace `<dbname>` with `vastu_db`

4. **Whitelist IPs**
   - Network Access → Add IP Address
   - For Render: Add Render's IP (or 0.0.0.0/0 for testing)
   - For production: Whitelist only Render's IP

---

## Vercel Frontend Environment Variables

Add to Vercel Dashboard → Settings → Environment Variables

```
REACT_APP_API_URL=https://vastu-backend.onrender.com/api
```

---

## Security Best Practices

✅ **DO:**
- [ ] Use strong passwords (min 12 chars, mix of upper/lower/numbers/symbols)
- [ ] Rotate secrets every 90 days
- [ ] Use different secrets for dev/staging/production
- [ ] Store secrets in Render/Vercel dashboard (not in code)
- [ ] Enable MongoDB IP whitelist
- [ ] Use HTTPS everywhere
- [ ] Change admin password immediately after first login
- [ ] Enable 2FA on Render/Vercel accounts

❌ **DON'T:**
- [ ] Commit secrets to GitHub
- [ ] Use same secrets across environments
- [ ] Share secrets via email/chat
- [ ] Use weak passwords
- [ ] Whitelist 0.0.0.0/0 in production
- [ ] Leave default admin credentials

---

## Updating Secrets

### In Render
1. Dashboard → Service → Settings → Environment
2. Edit variable
3. Save
4. Service auto-redeploys

### In Vercel
1. Dashboard → Settings → Environment Variables
2. Edit variable
3. Save
4. Redeploy manually

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Check MongoDB whitelist IPs |
| JWT errors | Verify JWT_SECRET is set |
| CORS errors | Check CORS_ORIGIN matches frontend URL |
| Admin login fails | Check ADMIN_EMAIL and ADMIN_PASSWORD |

---

## Checklist Before Going Live

- [ ] All env vars set in Render
- [ ] All env vars set in Vercel
- [ ] Database migrations ran
- [ ] Admin user created
- [ ] Admin password changed
- [ ] JWT secrets rotated
- [ ] CORS_ORIGIN updated
- [ ] MongoDB whitelist configured
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Login works end-to-end
- [ ] Admin dashboard accessible
- [ ] BA dashboard accessible


