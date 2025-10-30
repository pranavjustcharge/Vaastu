# Frontend Deployment Guide

## Overview

The frontend is a vanilla JavaScript application served by a simple HTTP server. For production, you should use a proper web server like Nginx or Apache.

## Frontend Files

- `login.html` - Login page
- `admin-dashboard.html` - Admin dashboard
- `ba-dashboard.html` - Business Associate dashboard
- `business_associate.html` - BA registration form
- `assets/` - CSS, JavaScript, and images
- `toaster.js` - Toast notification library

## Development Setup

```bash
# Start frontend server on port 5000
http-server -p 5000 -c-1
```

## Production Deployment

### Option 1: Using Nginx (Recommended)

#### 1. Install Nginx
```bash
# Ubuntu/Debian
sudo apt-get install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 2. Configure Nginx
Create `/etc/nginx/sites-available/vastu-frontend`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;

    # Root directory
    root /var/www/vastu-frontend;
    index login.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA routing - serve index.html for all non-file requests
    location / {
        try_files $uri $uri/ /login.html;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

#### 3. Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/vastu-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Using Docker

#### 1. Create Dockerfile
```dockerfile
FROM nginx:alpine

# Copy frontend files
COPY . /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Build and run
```bash
docker build -t vastu-frontend .
docker run -p 80:80 -p 443:443 vastu-frontend
```

### Option 3: Using Apache

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/vastu-frontend

    # Redirect to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/vastu-frontend

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem

    # Security Headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"

    # Enable mod_rewrite for SPA routing
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /login.html [L]
    </IfModule>

    # Proxy API requests
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:3000/api/
    ProxyPassReverse /api/ http://localhost:3000/api/
</VirtualHost>
```

## API Configuration

### Update API Base URL

The frontend uses `API_BASE_URL` variable in each HTML file. Update it for production:

**In each HTML file (login.html, admin-dashboard.html, ba-dashboard.html, business_associate.html):**

```javascript
// Development
const API_BASE_URL = 'http://localhost:3000/api';

// Production
const API_BASE_URL = 'https://api.yourdomain.com/api';
// OR if API is on same domain
const API_BASE_URL = '/api';
```

## SSL/TLS Certificate

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Performance Optimization

### 1. Minify Assets
```bash
# Minify CSS
npx cssnano assets/css/style.css -o assets/css/style.min.css

# Minify JavaScript
npx terser toaster.js -o toaster.min.js
```

### 2. Enable Compression
- Gzip compression (configured in Nginx above)
- Brotli compression (optional, better compression)

### 3. Cache Strategy
- Static assets: 1 year cache
- HTML files: No cache (or short cache)
- API responses: Handled by backend

### 4. CDN Integration
Consider using a CDN like Cloudflare for:
- Global content distribution
- DDoS protection
- Automatic HTTPS
- Image optimization

## Monitoring

### 1. Error Tracking
- Browser console errors
- Network errors
- API failures

### 2. Performance Monitoring
- Page load time
- API response time
- User interactions

### 3. Uptime Monitoring
- Website availability
- API availability
- SSL certificate expiry

## Troubleshooting

### CORS Errors
- Verify backend CORS_ORIGIN includes frontend domain
- Check API_BASE_URL is correct
- Ensure credentials are properly configured

### API Connection Issues
- Verify API_BASE_URL is correct
- Check backend is running
- Verify firewall rules
- Check browser console for errors

### SSL Certificate Issues
- Verify certificate is valid
- Check certificate expiry date
- Renew certificate if needed

## Deployment Checklist

- [ ] Update API_BASE_URL in all HTML files
- [ ] Minify CSS and JavaScript
- [ ] Enable gzip compression
- [ ] Configure SSL/TLS certificate
- [ ] Setup Nginx/Apache configuration
- [ ] Configure security headers
- [ ] Enable caching for static assets
- [ ] Setup monitoring and alerting
- [ ] Test all pages and functionality
- [ ] Verify API connectivity
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Setup backup and disaster recovery
- [ ] Document deployment procedure

## Support

For issues or questions, refer to:
- README.md
- PRODUCTION_CHECKLIST.md
- Backend API documentation

