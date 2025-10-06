# Railway Deployment - Quick Reference

## 🚂 One-Page Deployment Guide

### 1️⃣ Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2️⃣ Railway Project Setup

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `paesi` repository
4. Railway will create a project

### 3️⃣ Add Database

1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Wait for it to provision (~30 seconds)

### 4️⃣ Deploy Services

#### Server (Go API)
```
Service Name: server
Root Directory: server
Environment Variables:
  PORT=7777
  DB_HOST=${{Postgres.PGHOST}}
  DB_PORT=${{Postgres.PGPORT}}
  DB_USER=${{Postgres.PGUSER}}
  DB_PASSWORD=${{Postgres.PGPASSWORD}}
  DB_NAME=${{Postgres.PGDATABASE}}
  JWT_SECRET=<generate with: openssl rand -base64 32>
  ALLOWED_ORIGINS=<will add after web deployment>
```

#### Auth (Bun)
```
Service Name: auth
Root Directory: auth
Environment Variables:
  PORT=3000
  DB_HOST=${{Postgres.PGHOST}}
  DB_PORT=${{Postgres.PGPORT}}
  DB_USER=${{Postgres.PGUSER}}
  DB_PASSWORD=${{Postgres.PGPASSWORD}}
  DB_NAME=${{Postgres.PGDATABASE}}
  ALLOWED_ORIGINS=<will add after web deployment>
```

#### Web (React)
```
Service Name: web
Root Directory: web
Environment Variables:
  VITE_API_URL=https://<your-server-url>.railway.app
  VITE_AUTH_URL=https://<your-auth-url>.railway.app
```

### 5️⃣ Configure CORS

After all services are deployed:

1. Copy your Web service URL
2. Update Server → Variables → `ALLOWED_ORIGINS`
3. Update Auth → Variables → `ALLOWED_ORIGINS`
4. Redeploy Server and Auth

### 6️⃣ Test Your Deployment

Visit your web app URL and test:
- ✅ Sign up
- ✅ Sign in
- ✅ View products
- ✅ Create order

## 📋 Service URLs

After deployment, you'll get URLs like:
```
Web:    https://web-production-xxxx.railway.app
Server: https://server-production-xxxx.railway.app
Auth:   https://auth-production-xxxx.railway.app
```

## 🔧 Troubleshooting

### Build fails
```bash
# Check Railway logs
# Verify root directory matches: server/, auth/, or web/
```

### CORS errors
```bash
# Verify ALLOWED_ORIGINS has exact web URL
# No trailing slashes
# Redeploy after changes
```

### Database connection fails
```bash
# Check all DB_* variables use ${{Postgres.*}}
# Verify Postgres service is running
```

## 💰 Cost Estimate (Free Tier)

- PostgreSQL: ~$1-2/mo
- 3 Services: ~$3-4/mo
- **Total: ~$4-6/mo**
- Free tier: $5/mo credit ✅

## 📚 Full Documentation

- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Complete guide
- [RAILWAY_CHECKLIST.md](./RAILWAY_CHECKLIST.md) - Deployment checklist
- [README.md](./README.md) - Project overview

## 🎯 Pro Tips

1. **Deploy in order**: Database → Server → Auth → Web
2. **Use variable references**: `${{Postgres.PGHOST}}` not hardcoded values
3. **Monitor usage**: Check Railway dashboard regularly
4. **Test locally first**: Ensure everything works before deploying
5. **Review logs**: Each service has detailed logs in Railway

## 🔒 Security Checklist

- [ ] Generated strong JWT_SECRET
- [ ] Database credentials using Railway references
- [ ] CORS properly configured
- [ ] No secrets in code
- [ ] Environment variables not committed

## ⚡ Automatic Deployments

Railway automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update feature"
git push
# Railway detects changes and redeploys affected services
```

Watch patterns in `railway.json` ensure only changed services rebuild.

## 🆘 Getting Help

1. Check [Railway Docs](https://docs.railway.com/)
2. Join [Railway Discord](https://discord.gg/railway)
3. Review service logs in Railway dashboard
4. Check GitHub issues

---

**Ready to deploy? Run this to get started:**

```bash
./railway-setup.sh
```

Then follow this guide step by step!
