# Quick Start - Reorganized Backend

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
# Copy environment template
cp .env.example .env

# Update DATABASE_URL in .env
# Example: postgresql://user:password@localhost:5432/vastu_db

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed demo data
npm run seed:demo
```

### Step 3: Start Backend
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

**Server runs on**: `http://localhost:3000`

---

## 📝 Environment Setup

Create `.env` file:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vastu_db

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npm test -- bookings.test.ts
```

### With Coverage
```bash
npm test -- --coverage
```

---

## 📚 API Quick Reference

### Create Booking (Public)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Rajesh Kumar",
    "clientEmail": "rajesh@example.com",
    "clientPhone": "+919876543210",
    "serviceType": "BUSINESS_VASTU",
    "description": "Business is slow",
    "preferredDate": "2024-12-15",
    "preferredTime": "10:00 AM",
    "referralCode": "BA_CODE_123",
    "couponCode": "SAVE20"
  }'
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ba@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+919876543210",
    "role": "BA"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ba@example.com",
    "password": "SecurePass123!"
  }'
```

### Get BA Dashboard
```bash
curl -X GET http://localhost:3000/api/ba/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get All Bookings (Admin)
```bash
curl -X GET "http://localhost:3000/api/bookings/admin/all?status=PENDING" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🗂️ Project Structure

```
src/
├── config/          # Configuration
├── controllers/     # HTTP handlers
├── middleware/      # Auth, validation, errors
├── routes/          # API routes
├── services/        # Business logic
└── utils/           # Helpers & utilities

prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Demo data

docs/
├── BUSINESS_LOGIC_ANALYSIS.md
├── VASTU_API_DOCUMENTATION.md
├── FRONTEND_INTEGRATION_GUIDE.md
└── PROJECT_STRUCTURE_UPDATED.md
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Express app setup |
| `prisma/schema.prisma` | Database models |
| `src/services/bookingService.ts` | Booking logic |
| `src/routes/bookings.ts` | Booking endpoints |
| `.env.example` | Environment template |
| `docker-compose.yml` | Local PostgreSQL |

---

## 🐳 Docker Setup

### Start PostgreSQL
```bash
docker-compose up -d
```

### Stop PostgreSQL
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

---

## 📊 Database

### Access PostgreSQL
```bash
psql postgresql://user:password@localhost:5432/vastu_db
```

### View Tables
```sql
\dt
```

### View Schema
```sql
\d bookings
```

---

## 🔍 Debugging

### Enable Debug Logs
```bash
DEBUG=* npm run dev
```

### Check Database Connection
```bash
npx prisma db push --skip-generate
```

### View Prisma Studio
```bash
npx prisma studio
```

---

## 📋 Checklist

- [ ] Node.js 20+ installed
- [ ] PostgreSQL running
- [ ] `.env` file created
- [ ] Dependencies installed (`npm install`)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Backend started (`npm run dev`)
- [ ] Health check passes (`curl http://localhost:3000/health`)
- [ ] Can create booking (test API)
- [ ] Can login (test auth)
- [ ] Tests pass (`npm test`)

---

## 🚨 Common Issues

### Port Already in Use
```bash
# Change PORT in .env or kill process
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
docker-compose ps
```

### Migration Failed
```bash
# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

### TypeScript Errors
```bash
# Rebuild
npm run build

# Check types
npx tsc --noEmit
```

---

## 📖 Documentation

- **Business Model**: `BUSINESS_LOGIC_ANALYSIS.md`
- **API Reference**: `VASTU_API_DOCUMENTATION.md`
- **Frontend Setup**: `FRONTEND_INTEGRATION_GUIDE.md`
- **Architecture**: `PROJECT_STRUCTURE_UPDATED.md`
- **Reorganization**: `REORGANIZATION_SUMMARY.md`

---

## 🎯 Next Steps

1. **Test Backend**:
   ```bash
   npm test
   ```

2. **Try API**:
   - Use Postman or curl
   - Test booking creation
   - Test authentication

3. **Integrate Frontend**:
   - Update `script.js`
   - Create login page
   - Create BA dashboard

4. **Deploy**:
   - Build Docker image
   - Push to registry
   - Deploy to production

---

## 💡 Tips

- Use Postman for API testing
- Check logs: `tail -f logs/app.log`
- Use Prisma Studio: `npx prisma studio`
- Read API docs before integrating
- Test with demo data first

---

## 📞 Support

- Check documentation files
- Review error messages carefully
- Check database with Prisma Studio
- Review logs for details

---

## ✅ Ready to Go!

Your backend is now reorganized and ready for:
- ✅ Testing
- ✅ Frontend integration
- ✅ Production deployment

**Happy coding! 🚀**

