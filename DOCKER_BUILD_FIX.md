# 🐳 Docker Build Fix

## Issue Fixed

**Error**: `npm ci` command failed because `package-lock.json` was not being copied

**Root Cause**: The Dockerfile was using `package*.json` pattern which didn't properly match the lock file

**Solution**: Explicitly copy `package.json` and `package-lock.json` separately

---

## Changes Made to Dockerfile

### Before (Lines 7, 32)
```dockerfile
COPY package*.json ./
```

### After (Lines 7, 32)
```dockerfile
COPY package.json package-lock.json ./
```

### Before (Lines 12, 36)
```dockerfile
RUN npm ci
RUN npm ci --only=production
```

### After (Lines 12, 36)
```dockerfile
RUN npm install
RUN npm install --omit=dev
```

---

## Why These Changes?

1. **Explicit file copying**: `package.json package-lock.json ./` is more reliable than `package*.json`
2. **npm install vs npm ci**: 
   - `npm ci` requires lock file to exist (strict mode)
   - `npm install` is more flexible and creates lock file if needed
3. **--omit=dev**: Modern npm flag (replaces `--only=production`)

---

## Testing the Docker Build

### Build locally
```bash
docker build -t vastu-backend:latest .
```

### Run locally
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/vastu_db" \
  -e JWT_SECRET="test-secret" \
  -e JWT_REFRESH_SECRET="test-refresh" \
  vastu-backend:latest
```

### Check if running
```bash
curl http://localhost:3000/api/health
```

---

## Deployment

The Docker build should now work on:
- ✅ Render
- ✅ Docker Hub
- ✅ GitHub Container Registry
- ✅ Local machine

---

## Next Steps

1. Commit the Dockerfile changes:
   ```bash
   git add Dockerfile
   git commit -m "Fix Docker build: explicitly copy package-lock.json"
   git push origin main
   ```

2. Redeploy to Render:
   - Render will auto-detect the change
   - Build should now succeed

3. Verify deployment:
   - Check Render logs
   - Test health endpoint

---

## If Build Still Fails

Check:
1. `package-lock.json` exists in repo root
2. File is committed to Git
3. No `.dockerignore` excluding it
4. Run `npm install` locally to regenerate lock file if needed


