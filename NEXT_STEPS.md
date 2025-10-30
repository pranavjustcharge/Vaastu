# Next Steps - Getting Started

## 🎯 Your Complete Backend is Ready!

You now have a production-ready BA & Admin Dashboard backend. Here's what to do next.

---

## ⚡ Step 1: Get It Running (Choose One)

### Option A: Docker (Recommended - 2 minutes)
```bash
docker-compose up -d
```
✅ Backend runs on `http://localhost:3000`

### Option B: Local Development (5 minutes)
```bash
npm install
npm run migrate:dev
npm run seed
npm run dev
```
✅ Backend runs on `http://localhost:3000`

### Option C: Automated Setup (5 minutes)
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh && ./setup.sh
```

---

## 🧪 Step 2: Verify It Works

### Check Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "ChangeMe123!"
  }'
```

Save the `token` from response.

### Get Dashboard Stats
```bash
curl http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer <token-from-above>"
```

---

## 📚 Step 3: Understand the System

### Read These (in order):
1. **[START_HERE.md](START_HERE.md)** - Overview (5 min)
2. **[QUICKSTART.md](QUICKSTART.md)** - Quick reference (5 min)
3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All endpoints (10 min)
4. **[README.md](README.md)** - Full documentation (20 min)

---

## 🔌 Step 4: Connect Your Frontend

### Update Frontend Configuration
```javascript
// In your frontend code
const API_BASE_URL = 'http://localhost:3000/api';
```

### Implement Authentication
See [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) for:
- Login/Register flow
- Token storage
- Authenticated requests
- Error handling

### Test Integration
```bash
# From your frontend, test login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'ChangeMe123!'
  })
})
```

---

## 🚀 Step 5: Prepare for Production

### Before Deploying:
1. Read [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
2. Change admin credentials
3. Generate strong JWT secrets
4. Configure database URL
5. Setup HTTPS/TLS
6. Configure CORS origins
7. Setup monitoring
8. Run security audit

### Deploy:
```bash
# Using Docker
docker-compose up -d

# Or your preferred platform (AWS, Azure, GCP, etc.)
```

---

## 📋 Common Tasks

### View Database
```bash
npm run prisma:studio
```
Opens interactive database viewer at `http://localhost:5555`

### Run Tests
```bash
npm test
```

### Check Code Quality
```bash
npm run lint
npm run lint:fix
```

### Build for Production
```bash
npm run build
npm start
```

### View Logs
```bash
docker-compose logs -f app
```

---

## 🔑 Important: Change Default Credentials

### Current Credentials
```
Email:    admin@example.com
Password: ChangeMe123!
```

### Change Them:
1. Login with default credentials
2. Update admin user in database
3. Or create new admin user

```bash
# Via Prisma Studio
npm run prisma:studio
# Then edit the User record
```

---

## 📊 API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/register      - Register BA
POST   /api/auth/login         - Login
POST   /api/auth/refresh       - Refresh token
GET    /api/auth/me            - Get current user
```

### BA Panel
```
GET    /api/ba/profile         - Get profile
PUT    /api/ba/profile         - Update profile
GET    /api/ba/referrals       - Get referral stats
GET    /api/ba/withdrawals     - Get withdrawal history
POST   /api/ba/withdrawals     - Request withdrawal
GET    /api/ba/coupons         - Get assigned coupons
```

### Admin Panel
```
GET    /api/admin/bas/pending  - Get pending BAs
POST   /api/admin/bas/:id/approve - Approve BA
POST   /api/admin/commission   - Set commission
POST   /api/admin/coupons      - Create coupon
GET    /api/admin/withdrawals/pending - Get pending
POST   /api/admin/withdrawals/:id/approve - Approve
GET    /api/admin/dashboard/stats - Dashboard stats
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete reference.

---

## 🧪 Testing Workflow

### 1. Register a BA
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ba@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Approve BA (as Admin)
```bash
curl -X POST http://localhost:3000/api/admin/bas/{baId}/approve \
  -H "Authorization: Bearer {admin-token}"
```

### 3. Login as BA
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ba@example.com",
    "password": "SecurePass123!"
  }'
```

### 4. Get BA Referral Stats
```bash
curl http://localhost:3000/api/ba/referrals \
  -H "Authorization: Bearer {ba-token}"
```

---

## 📞 Troubleshooting

### Port 3000 Already in Use
```bash
# Change port in .env
PORT=3001
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
# Test: psql <DATABASE_URL>
```

### Migrations Failed
```bash
# Reset database (WARNING: deletes all data)
npm run migrate:reset
npm run seed
```

### Tests Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| [START_HERE.md](START_HERE.md) | Overview | 5 min |
| [QUICKSTART.md](QUICKSTART.md) | Quick start | 5 min |
| [README.md](README.md) | Full docs | 20 min |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | API reference | 10 min |
| [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) | Frontend setup | 15 min |
| [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) | Deployment | 15 min |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | File layout | 10 min |

---

## ✅ Checklist

- [ ] Backend running (Docker or local)
- [ ] Health check passing
- [ ] Admin login working
- [ ] Read START_HERE.md
- [ ] Read QUICKSTART.md
- [ ] Reviewed API_DOCUMENTATION.md
- [ ] Tested BA registration flow
- [ ] Tested withdrawal workflow
- [ ] Connected frontend
- [ ] Reviewed PRODUCTION_CHECKLIST.md
- [ ] Changed admin credentials
- [ ] Generated JWT secrets
- [ ] Configured database
- [ ] Setup monitoring
- [ ] Ready to deploy

---

## 🎉 You're Ready!

Your backend is production-ready. Now:

1. ✅ Get it running (Step 1)
2. ✅ Verify it works (Step 2)
3. ✅ Understand the system (Step 3)
4. ✅ Connect your frontend (Step 4)
5. ✅ Prepare for production (Step 5)

---

## 🚀 Quick Commands

```bash
# Start development
npm run dev

# Run tests
npm test

# View database
npm run prisma:studio

# Build for production
npm run build

# Deploy with Docker
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

---

## 📞 Need Help?

1. Check [START_HERE.md](START_HERE.md)
2. Review [QUICKSTART.md](QUICKSTART.md)
3. Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. Check logs: `docker-compose logs -f app`
5. View database: `npm run prisma:studio`

---

## 🎯 What's Next?

1. **Immediate**: Get backend running
2. **Short-term**: Connect frontend
3. **Medium-term**: Test all workflows
4. **Long-term**: Deploy to production

Happy coding! 🚀

