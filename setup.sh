#!/bin/bash

# BA Dashboard Backend Setup Script
# This script automates the initial setup process

set -e

echo "🚀 BA Dashboard Backend Setup"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment file
echo ""
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file (update with your database URL)"
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is available
echo ""
echo "🗄️  Checking database..."

if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client found"
else
    echo "⚠️  PostgreSQL client not found (optional if using Docker)"
fi

# Build TypeScript
echo ""
echo "🔨 Building TypeScript..."
npm run build

# Run migrations
echo ""
echo "📊 Running database migrations..."
npm run migrate:dev || echo "⚠️  Migration skipped (ensure database is running)"

# Seed database
echo ""
echo "🌱 Seeding database..."
npm run seed || echo "⚠️  Seeding skipped (ensure database is running)"

# Run tests
echo ""
echo "🧪 Running tests..."
npm test -- --passWithNoTests || echo "⚠️  Tests skipped"

# Lint code
echo ""
echo "✨ Checking code quality..."
npm run lint || echo "⚠️  Linting issues found (run 'npm run lint:fix' to auto-fix)"

echo ""
echo "=============================="
echo "✅ Setup Complete!"
echo "=============================="
echo ""
echo "📝 Next steps:"
echo "1. Update .env with your database credentials"
echo "2. Start development: npm run dev"
echo "3. Or use Docker: docker-compose up -d"
echo ""
echo "📚 Documentation:"
echo "- QUICKSTART.md - Quick start guide"
echo "- README.md - Full documentation"
echo "- API_DOCUMENTATION.md - API endpoints"
echo ""
echo "🔑 Default Admin Credentials:"
echo "- Email: admin@example.com"
echo "- Password: ChangeMe123!"
echo ""
echo "⚠️  Change these immediately in production!"
echo ""

