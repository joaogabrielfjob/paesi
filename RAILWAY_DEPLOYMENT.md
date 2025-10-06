# Railway Deployment Guide for Paesi

This guide will help you deploy your Paesi monorepo to Railway with three services: Go Server, Auth Server (Bun), and Web App (React + Vite).

## Prerequisites

- Railway account (free tier is sufficient)
- GitHub account
- Repository pushed to GitHub

## Project Structure

```
paesi/
├── server/       # Go API server
├── auth/         # Bun authentication server
├── web/          # React + Vite frontend
└── railway.json  # (in each service directory)
```

## Deployment Steps

### 1. Create a New Project in Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `paesi` repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will create a new Postgres instance
4. Note: The database will automatically get a `DATABASE_URL` variable

### 3. Deploy the Go Server

1. Click "+ New" → "GitHub Repo"
2. Select your repository again (Railway supports multiple services from one repo)
3. In service settings:
   - **Service Name**: `server` or `api`
   - **Root Directory**: `server`
   - **Build Command**: Leave empty (Nixpacks will auto-detect)
   - **Start Command**: `./tmp/main` (or let Nixpacks detect it)

4. Add Environment Variables:
   ```
   PORT=7777
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   ALLOWED_ORIGINS=https://your-web-app.railway.app
   JWT_SECRET=your-secret-key-here
   ```

5. In Settings → **Networking**:
   - Enable "Generate Domain" to get a public URL

### 4. Deploy the Auth Server (Bun)

1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. In service settings:
   - **Service Name**: `auth`
   - **Root Directory**: `auth`
   - **Build Command**: Leave empty (Nixpacks will detect Bun)
   - **Start Command**: `bun run start`

4. Add Environment Variables:
   ```
   PORT=3000
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   ALLOWED_ORIGINS=https://your-web-app.railway.app,http://localhost:5173
   ```

5. In Settings → **Networking**:
   - Enable "Generate Domain" to get a public URL

### 5. Deploy the Web App (React + Vite)

1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. In service settings:
   - **Service Name**: `web`
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`

4. Add Environment Variables:
   ```
   PORT=5173
   VITE_API_URL=https://your-server.railway.app
   VITE_AUTH_URL=https://your-auth.railway.app
   ```

5. In Settings → **Networking**:
   - Enable "Generate Domain" to get a public URL

### 6. Update CORS Origins

Once all services are deployed and you have their URLs:

1. Go to **Server** service → Variables
   - Update `ALLOWED_ORIGINS` with your web app URL

2. Go to **Auth** service → Variables
   - Update `ALLOWED_ORIGINS` with your web app URL

3. Redeploy both services to apply the changes

### 7. Configure API URLs in Frontend

You'll need to update your frontend to use the Railway URLs. Create environment-specific configuration:

**Option A**: Update your services to read from environment variables
**Option B**: Use Railway's variable references

## Railway Configuration Files

The repository includes `railway.json` files in each service directory:

### server/railway.json
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "watchPatterns": ["server/**"]
  },
  "deploy": {
    "startCommand": "./tmp/main",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### auth/railway.json
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "watchPatterns": ["auth/**"]
  },
  "deploy": {
    "startCommand": "bun run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### web/railway.json
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "watchPatterns": ["web/**"],
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

## Important Notes

### Free Tier Considerations

Railway's free tier ($5 credit/month) is perfect for testing, but be aware:

- **Sleep after inactivity**: Services may sleep after 30 minutes of inactivity
- **Resource limits**: 512MB RAM per service, 1 vCPU shared
- **Monthly usage**: Monitor your usage in the Railway dashboard

### Build Optimization

To minimize build costs:

1. **Watch Patterns**: Only rebuild when files in specific directories change
2. **Shared Database**: All services share one PostgreSQL instance
3. **Efficient Builds**: Nixpacks automatically caches dependencies

### Database Migrations

The Go server automatically runs migrations on startup using GORM's `AutoMigrate`.
The Auth server uses better-auth migrations.

Make sure to run migrations in this order:
1. Deploy server (runs GORM migrations)
2. Deploy auth (runs better-auth migrations)

## Troubleshooting

### Service Won't Start

1. Check logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure the start command is correct

### CORS Errors

1. Make sure `ALLOWED_ORIGINS` includes your web app URL
2. Verify URLs don't have trailing slashes
3. Redeploy after changing CORS settings

### Database Connection Issues

1. Verify all `DB_*` variables are set correctly
2. Use Railway's variable references: `${{Postgres.PGHOST}}`
3. Check if PostgreSQL service is running

### Build Fails

1. Check if the root directory is set correctly
2. Review build logs for errors
3. Ensure `railway.json` is in the service directory

## Updating Your Deployment

Railway automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update deployment"
git push
```

Railway will:
1. Detect changes using watch patterns
2. Build only affected services
3. Deploy with zero-downtime

## Monitoring

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: CPU, memory, and network usage
- **Deployments**: Track deployment history and rollback if needed

## Production Checklist

Before going to production:

- [ ] Set strong `JWT_SECRET`
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable health checks
- [ ] Monitor resource usage
- [ ] Consider upgrading to a paid plan for better resources

## Cost Estimation (Free Tier)

With the free $5/month credit:
- PostgreSQL: ~$1-2/month
- 3 Services: ~$3-4/month total
- **Total**: Should fit within free tier for development

## Additional Resources

- [Railway Documentation](https://docs.railway.com/)
- [Railway Discord Community](https://discord.gg/railway)
- [Railway Status Page](https://status.railway.app/)

## Support

If you encounter issues:
1. Check Railway's [documentation](https://docs.railway.com/)
2. Search [Railway's Discord](https://discord.gg/railway)
3. Review service logs in the Railway dashboard
