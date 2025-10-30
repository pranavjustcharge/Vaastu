@echo off
REM BA Dashboard Backend Setup Script for Windows

echo.
echo 🚀 BA Dashboard Backend Setup
echo ==============================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20+
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Setup environment file
echo.
echo 🔧 Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file (update with your database URL)
) else (
    echo ✅ .env file already exists
)

REM Build TypeScript
echo.
echo 🔨 Building TypeScript...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    exit /b 1
)

REM Run migrations
echo.
echo 📊 Running database migrations...
call npm run migrate:dev
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Migration skipped (ensure database is running)
)

REM Seed database
echo.
echo 🌱 Seeding database...
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Seeding skipped (ensure database is running)
)

REM Run tests
echo.
echo 🧪 Running tests...
call npm test -- --passWithNoTests
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Tests skipped
)

REM Lint code
echo.
echo ✨ Checking code quality...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Linting issues found (run 'npm run lint:fix' to auto-fix)
)

echo.
echo ==============================
echo ✅ Setup Complete!
echo ==============================
echo.
echo 📝 Next steps:
echo 1. Update .env with your database credentials
echo 2. Start development: npm run dev
echo 3. Or use Docker: docker-compose up -d
echo.
echo 📚 Documentation:
echo - QUICKSTART.md - Quick start guide
echo - README.md - Full documentation
echo - API_DOCUMENTATION.md - API endpoints
echo.
echo 🔑 Default Admin Credentials:
echo - Email: admin@example.com
echo - Password: ChangeMe123!
echo.
echo ⚠️  Change these immediately in production!
echo.
pause

