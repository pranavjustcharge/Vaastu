# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone <repo-url>
cd ba-admin-dashboard-backend

# 2. Create environment file
cp .env.example .env

# 3. Start with Docker Compose
docker-compose up -d

# 4. Check if running
curl http://localhost:3000/health
```

**Done!** API is running on `http://localhost:3000`

### Option 2: Local Development

```bash
# 1. Prerequisites
# - Node.js 20+
# - PostgreSQL 14+

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database URL

# 4. Setup database
npm run migrate:dev
npm run seed

# 5. Start development server
npm run dev
```

**Done!** API is running on `http://localhost:3000`

---

## 🔑 Default Credentials

After seeding, use these to login:

```
Email: admin@example.com
Password: ChangeMe123!
```

⚠️ **Change these immediately!**

---

## 📝 First Steps

### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "ChangeMe123!"
  }'
```

Save the `token` from response.

### 2. Register a BA
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

### 3. Approve BA (as Admin)
```bash
curl -X POST http://localhost:3000/api/admin/bas/{baId}/approve \
  -H "Authorization: Bearer {admin-token}"
```

### 4. Login as BA
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ba@example.com",
    "password": "SecurePass123!"
  }'
```

### 5. Get BA Referral Stats
```bash
curl http://localhost:3000/api/ba/referrals \
  -H "Authorization: Bearer {ba-token}"
```

---

## 📚 Key Endpoints

### Authentication
- `POST /api/auth/register` - Register BA
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### BA Panel
- `GET /api/ba/profile` - Get profile
- `PUT /api/ba/profile` - Update profile
- `GET /api/ba/referrals` - Get referral stats
- `GET /api/ba/withdrawals` - Get withdrawal history
- `POST /api/ba/withdrawals` - Request withdrawal
- `GET /api/ba/coupons` - Get assigned coupons

### Admin Panel
- `GET /api/admin/bas/pending` - Get pending BAs
- `POST /api/admin/bas/{baId}/approve` - Approve BA
- `POST /api/admin/commission` - Set commission
- `POST /api/admin/coupons` - Create coupon
- `GET /api/admin/withdrawals/pending` - Get pending withdrawals
- `GET /api/admin/dashboard/stats` - Get dashboard stats

See `API_DOCUMENTATION.md` for full details.

---

## 🧪 Run Tests

```bash
npm test
```

---

## 📊 Database Management

### View Database (Prisma Studio)
```bash
npm run prisma:studio
```

Opens interactive database viewer at `http://localhost:5555`

### Create Migration
```bash
npm run migrate:dev
```

### Reset Database
```bash
npm run migrate:reset
```

---

## 🔧 Development Commands

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript
npm start                # Run production build
npm run lint             # Check code style
npm run lint:fix         # Fix code style
npm test                 # Run tests
npm test:watch           # Run tests in watch mode
```

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Change port in .env
PORT=3001
```

### Database connection error
```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
# Test connection: psql <DATABASE_URL>
```

### Migrations failed
```bash
# Reset database (WARNING: deletes all data)
npm run migrate:reset
npm run seed
```

### Tests failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 📖 Documentation

- `README.md` - Full documentation
- `API_DOCUMENTATION.md` - API endpoints
- `PRODUCTION_CHECKLIST.md` - Pre-deployment tasks
- `prisma/schema.prisma` - Database schema

---

## 🚀 Next Steps

1. **Customize** - Update admin credentials, commission rates
2. **Test** - Run full test suite
3. **Deploy** - Follow `PRODUCTION_CHECKLIST.md`
4. **Monitor** - Setup logging and monitoring
5. **Scale** - Configure auto-scaling and load balancing

---

## 💡 Tips

- Use Postman/Insomnia for API testing
- Check logs: `docker-compose logs -f app`
- View database: `npm run prisma:studio`
- Run migrations: `npm run migrate`
- Seed demo data: `npm run seed`

---

## 📞 Support

For issues or questions:
1. Check `README.md` and `API_DOCUMENTATION.md`
2. Review error logs
3. Check database with Prisma Studio
4. Run tests to verify setup

Happy coding! 🎉

