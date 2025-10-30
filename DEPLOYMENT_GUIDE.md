# Complete Deployment Guide - Vastu BA Admin Dashboard

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Nginx)                         │
│  login.html, admin-dashboard.html, ba-dashboard.html        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│              Port 3000 (Internal only)                       │
│  - Authentication                                            │
│  - BA Management                                             │
│  - Commission Settings                                       │
│  - Referral System                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Cloud Database)                  │
│  - Users Collection                                          │
│  - BA Profiles                                               │
│  - Commission Settings                                       │
│  - Referral Transactions                                     │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (already configured)
- Nginx or Apache web server
- SSL/TLS certificate (Let's Encrypt recommended)
- Linux server (Ubuntu 20.04+ recommended)

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 1.2 Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Verify installation
```

### 1.3 Install Nginx
```bash
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 2: Deploy Backend

### 2.1 Clone Repository
```bash
cd /opt
sudo git clone <your-repo-url> vastu-backend
cd vastu-backend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Configure Environment
```bash
# Copy production environment file
cp .env.production .env

# Edit with your production values
sudo nano .env
```

**Required environment variables:**
```
DATABASE_URL=mongodb+srv://vaidik_vaastu:XYYmdD1JgA50pdKA@vaastu.sxjlbge.mongodb.net/vastu_db
DATABASE_NAME=vastu_db
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### 2.4 Generate Strong Secrets
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET
openssl rand -base64 32
```

### 2.5 Build Application
```bash
npm run build
```

### 2.6 Setup PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start dist/index.js --name "vastu-api"

# Save PM2 configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

### 2.7 Verify Backend
```bash
# Check if running
pm2 status

# View logs
pm2 logs vastu-api

# Test health endpoint
curl http://localhost:3000/health
```

## Step 3: Deploy Frontend

### 3.1 Copy Frontend Files
```bash
sudo mkdir -p /var/www/vastu-frontend
sudo cp -r *.html /var/www/vastu-frontend/
sudo cp -r assets /var/www/vastu-frontend/
sudo cp toaster.js /var/www/vastu-frontend/
sudo chown -R www-data:www-data /var/www/vastu-frontend
```

### 3.2 Update API Configuration
Edit each HTML file and update API_BASE_URL:

```bash
# For all HTML files
sudo sed -i "s|http://localhost:3000/api|https://yourdomain.com/api|g" /var/www/vastu-frontend/*.html
```

### 3.3 Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/vastu-frontend
```

Paste the Nginx configuration from FRONTEND_DEPLOYMENT.md

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vastu-frontend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 4: SSL/TLS Setup

### 4.1 Install Certbot
```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### 4.2 Generate Certificate
```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### 4.3 Auto-Renewal
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

## Step 5: Database Migration

### 5.1 Migrate Data to MongoDB Atlas
```bash
# Ensure local MongoDB is running (if migrating from local)
npm run migrate:to-atlas
```

### 5.2 Verify Migration
```bash
# Check MongoDB Atlas dashboard for data
# Verify collections and document counts
```

## Step 6: Verification

### 6.1 Test Backend
```bash
# Health check
curl https://yourdomain.com/api/health

# Test login endpoint
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"ChangeMe123!"}'
```

### 6.2 Test Frontend
- Open https://yourdomain.com in browser
- Test login functionality
- Test admin dashboard
- Test BA dashboard
- Test commission settings

### 6.3 Check Logs
```bash
# Backend logs
pm2 logs vastu-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Step 7: Monitoring & Maintenance

### 7.1 Setup Monitoring
```bash
# Install monitoring tools
sudo apt-get install -y htop iotop nethogs

# Monitor system resources
htop
```

### 7.2 Setup Log Rotation
```bash
# Create log rotation config
sudo nano /etc/logrotate.d/vastu-api
```

```
/var/log/vastu-api/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 7.3 Backup Strategy
```bash
# Create backup script
sudo nano /usr/local/bin/backup-vastu.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/vastu"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup MongoDB (if using local)
# mongodump --db vastu_db --out $BACKUP_DIR/mongo_$DATE

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /opt/vastu-backend

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-vastu.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-vastu.sh
```

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
pm2 logs vastu-api

# Verify environment variables
cat .env

# Check database connection
npm run build && npm start
```

### API Connection Issues
```bash
# Check if backend is running
pm2 status

# Check port 3000
sudo netstat -tlnp | grep 3000

# Check Nginx proxy
sudo nginx -t
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal
```

## Rollback Procedure

If issues occur:

```bash
# Stop application
pm2 stop vastu-api

# Restore from backup
tar -xzf /backups/vastu/app_YYYYMMDD_HHMMSS.tar.gz -C /opt/

# Restart
pm2 start vastu-api

# Verify
pm2 logs vastu-api
```

## Security Checklist

- [x] HTTPS/TLS enabled
- [x] Security headers configured
- [x] CORS properly configured
- [x] Database credentials secured
- [x] JWT secrets strong and unique
- [x] Admin credentials changed
- [ ] Firewall rules configured
- [ ] Regular backups enabled
- [ ] Monitoring and alerting setup
- [ ] Log aggregation configured

## Support & Documentation

- README.md - Project overview
- PRODUCTION_CHECKLIST.md - Pre-deployment checklist
- FRONTEND_DEPLOYMENT.md - Frontend deployment details
- API Documentation - API endpoints and usage

## Next Steps

1. Test all functionality in production
2. Monitor logs and metrics
3. Setup automated backups
4. Configure monitoring and alerting
5. Document any custom configurations
6. Train team on deployment procedures
7. Setup disaster recovery plan

