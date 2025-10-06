# Railway Deployment - Changes Summary

This document summarizes all the changes made to prepare your project for Railway deployment.

## 📁 New Files Created

### Configuration Files
1. **`server/railway.json`** - Railway config for Go server
2. **`auth/railway.json`** - Railway config for Auth server
3. **`web/railway.json`** - Railway config for Web app

### Documentation
1. **`RAILWAY_DEPLOYMENT.md`** - Complete deployment guide
2. **`RAILWAY_CHECKLIST.md`** - Deployment checklist
3. **`RAILWAY_QUICK_START.md`** - Quick reference guide
4. **`README.md`** - Updated project README
5. **`CHANGES_SUMMARY.md`** - This file

### Scripts & Templates
1. **`railway-setup.sh`** - Environment variable generator script
2. **`.env.example`** - Environment variables template
3. **`.github/workflows/ci.yml`** - Optional CI/CD workflow

## 🔧 Modified Files

### 1. `auth/auth.ts`
**Changed:** Database configuration to use environment variables
```typescript
// Before: Hardcoded localhost values
database: new Pool({
  host: 'localhost',
  port: 5433,
  // ...
})

// After: Environment variables with fallbacks
database: new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  // ...
})
```

### 2. `auth/server.ts`
**Changed:** 
- Dynamic port from environment
- CORS origins from environment variable
```typescript
// Before: Fixed port and CORS
port: 3000,
'Access-Control-Allow-Origin': 'http://localhost:5173'

// After: Environment-based
port: parseInt(process.env.PORT || '3000'),
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [...]
```

### 3. `server/internal/router/router.go`
**Changed:**
- Dynamic port from environment
- CORS origins from environment variable
```go
// Before: Fixed port and CORS
router.Run(":7777")
AllowOrigins: []string{"http://localhost:5173"}

// After: Environment-based
port := os.Getenv("PORT")
if origins := os.Getenv("ALLOWED_ORIGINS"); origins != "" {
    allowedOrigins = strings.Split(origins, ",")
}
```

### 4. `web/src/services/client.ts`
**Changed:** Added separate auth client with environment-based URLs
```typescript
// Added:
export const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:3000',
  // ...
})
```

### 5. `web/src/services/auth_service.ts`
**Changed:** Use `authClient` instead of `client` for auth requests
```typescript
// Before: client.post(...)
// After: authClient.post(...)
```

### 6. `.gitignore`
**Added:** Environment files and Railway directory
```
.env
.env.local
.env.*.local
.railway
```

## 🎯 Key Changes Explained

### 1. Service Isolation
Each service (server, auth, web) now has its own `railway.json` configuration file. This allows Railway to:
- Build each service independently
- Use different build/start commands
- Watch specific file patterns to avoid unnecessary rebuilds

### 2. Environment Variables
All hardcoded values replaced with environment variables:
- **Database connections**: Use Railway's Postgres references
- **Ports**: Use Railway-assigned ports
- **CORS origins**: Dynamic based on deployment URLs
- **API endpoints**: Frontend uses environment-based URLs

### 3. Separate Auth Client
The frontend now uses two API clients:
- `client`: For main API (Go server) - products, orders, addresses
- `authClient`: For authentication (Bun server) - auth endpoints

This allows deploying auth and API as separate services with different URLs.

### 4. CORS Configuration
CORS is now dynamic and supports multiple origins:
```javascript
// Can handle multiple comma-separated origins
ALLOWED_ORIGINS=https://web.railway.app,http://localhost:5173
```

### 5. Port Configuration
All services now read PORT from environment:
- **Server**: `PORT` (Railway assigns dynamically)
- **Auth**: `PORT` (Railway assigns dynamically)  
- **Web**: `PORT` (Railway assigns dynamically)

## 🔄 Migration from Local to Railway

### Before (Local Development)
```
Server:  localhost:7777
Auth:    localhost:3000
Web:     localhost:5173
DB:      localhost:5432
```

### After (Railway Production)
```
Server:  https://server-production-xxxx.railway.app
Auth:    https://auth-production-xxxx.railway.app
Web:     https://web-production-xxxx.railway.app
DB:      Railway Postgres (internal)
```

## ⚙️ Environment Variables Matrix

| Variable | Server | Auth | Web | Description |
|----------|--------|------|-----|-------------|
| `PORT` | ✅ | ✅ | ✅ | Service port (Railway auto-assigns) |
| `DB_HOST` | ✅ | ✅ | ❌ | Database host |
| `DB_PORT` | ✅ | ✅ | ❌ | Database port |
| `DB_USER` | ✅ | ✅ | ❌ | Database user |
| `DB_PASSWORD` | ✅ | ✅ | ❌ | Database password |
| `DB_NAME` | ✅ | ✅ | ❌ | Database name |
| `ALLOWED_ORIGINS` | ✅ | ✅ | ❌ | CORS allowed origins |
| `JWT_SECRET` | ✅ | ❌ | ❌ | JWT signing secret |
| `VITE_API_URL` | ❌ | ❌ | ✅ | Go server URL |
| `VITE_AUTH_URL` | ❌ | ❌ | ✅ | Auth server URL |

## 🚀 Deployment Flow

1. **Push to GitHub** - Code changes committed
2. **Railway Detects** - Watches connected repository
3. **Checks Watch Patterns** - Only builds changed services
4. **Builds Services** - Uses Nixpacks with railway.json config
5. **Deploys** - Zero-downtime deployment
6. **Health Checks** - Verifies services are running

## 📊 Watch Patterns

Each `railway.json` includes watch patterns to optimize builds:

```json
// Server only rebuilds when files in server/ change
"watchPatterns": ["server/**"]

// Auth only rebuilds when files in auth/ change
"watchPatterns": ["auth/**"]

// Web only rebuilds when files in web/ change
"watchPatterns": ["web/**"]
```

This saves build time and costs by avoiding unnecessary rebuilds.

## ✅ Backwards Compatibility

All changes are backwards compatible with local development:
- Environment variables have fallback values
- Default ports still work: 7777, 3000, 5173
- Local database connection unchanged

## 🧪 Testing Strategy

1. **Local**: Test with `.env` file
2. **Staging**: Deploy to Railway staging environment
3. **Production**: Deploy to Railway production

## 📝 Next Steps

1. Review all changes: `git diff`
2. Test locally with new environment variables
3. Commit changes: `git add . && git commit -m "Prepare for Railway deployment"`
4. Push to GitHub: `git push`
5. Follow [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md)

## 🆘 Rollback Plan

If you need to rollback:

1. **Railway**: Use deployment history to rollback
2. **Git**: `git revert <commit-hash>`
3. **Local**: Keep old `.env` values

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.com/)
- [Nixpacks Docs](https://nixpacks.com/)
- [Railway Discord](https://discord.gg/railway)

---

**Summary**: Your project is now ready for Railway deployment! All services can be deployed independently with proper environment configuration. The changes maintain local development compatibility while enabling cloud deployment.
