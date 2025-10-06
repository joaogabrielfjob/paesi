# Railway Deployment Checklist

Use this checklist to ensure your deployment goes smoothly.

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] All tests pass locally
- [ ] Environment variables documented
- [ ] Database migrations tested

## Railway Project Setup

- [ ] Created Railway account
- [ ] Created new Railway project
- [ ] Connected GitHub repository

## Database Setup

- [ ] Added PostgreSQL database service
- [ ] Database is running and healthy
- [ ] Noted database connection details

## Server Service (Go API)

### Configuration
- [ ] Service created from GitHub repo
- [ ] Root directory set to `server`
- [ ] `railway.json` present in server directory

### Environment Variables
- [ ] `PORT` (default: 7777, Railway auto-assigns)
- [ ] `DB_HOST=${{Postgres.PGHOST}}`
- [ ] `DB_PORT=${{Postgres.PGPORT}}`
- [ ] `DB_USER=${{Postgres.PGUSER}}`
- [ ] `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
- [ ] `DB_NAME=${{Postgres.PGDATABASE}}`
- [ ] `JWT_SECRET` (generated secure key)
- [ ] `ALLOWED_ORIGINS` (set after web deployment)

### Deployment
- [ ] Service deployed successfully
- [ ] Logs show no errors
- [ ] Database migrations completed
- [ ] Public domain generated
- [ ] Service is healthy

## Auth Service (Bun)

### Configuration
- [ ] Service created from GitHub repo
- [ ] Root directory set to `auth`
- [ ] `railway.json` present in auth directory

### Environment Variables
- [ ] `PORT` (default: 3000, Railway auto-assigns)
- [ ] `DB_HOST=${{Postgres.PGHOST}}`
- [ ] `DB_PORT=${{Postgres.PGPORT}}`
- [ ] `DB_USER=${{Postgres.PGUSER}}`
- [ ] `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
- [ ] `DB_NAME=${{Postgres.PGDATABASE}}`
- [ ] `ALLOWED_ORIGINS` (set after web deployment)

### Deployment
- [ ] Service deployed successfully
- [ ] Logs show no errors
- [ ] Better-Auth migrations completed
- [ ] Public domain generated
- [ ] Service is healthy

## Web Service (React)

### Configuration
- [ ] Service created from GitHub repo
- [ ] Root directory set to `web`
- [ ] `railway.json` present in web directory

### Environment Variables
- [ ] `PORT` (Railway auto-assigns)
- [ ] `VITE_API_URL` (server URL from above)
- [ ] `VITE_AUTH_URL` (auth URL from above)

### Deployment
- [ ] Service deployed successfully
- [ ] Logs show no errors
- [ ] Build completed successfully
- [ ] Public domain generated
- [ ] Application loads in browser

## Post-Deployment

### CORS Configuration
- [ ] Updated Server `ALLOWED_ORIGINS` with Web URL
- [ ] Updated Auth `ALLOWED_ORIGINS` with Web URL
- [ ] Redeployed Server service
- [ ] Redeployed Auth service

### Testing
- [ ] Can access web application
- [ ] Can sign up new user
- [ ] Can sign in with user
- [ ] Can view products
- [ ] Can add items to cart
- [ ] Can create order
- [ ] Can view order history
- [ ] No CORS errors in browser console

### Monitoring
- [ ] Reviewed logs for all services
- [ ] Checked resource usage
- [ ] Set up monitoring alerts (optional)

## Production Ready (Optional)

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Database backups enabled
- [ ] Health checks configured
- [ ] Rate limiting implemented
- [ ] Error tracking set up (e.g., Sentry)
- [ ] Performance monitoring enabled
- [ ] Upgraded to paid plan (if needed)

## Troubleshooting Reference

### Common Issues

**Build fails:**
- Check root directory is set correctly
- Verify `railway.json` exists
- Review build logs

**Service won't start:**
- Check environment variables
- Verify start command
- Review service logs

**CORS errors:**
- Verify `ALLOWED_ORIGINS` matches web URL exactly
- No trailing slashes in URLs
- Redeploy after changes

**Database connection fails:**
- Check all DB variables are set
- Verify database service is running
- Check service logs for connection errors

**404 errors:**
- Verify API URLs in web app
- Check service domains are correct
- Test endpoints individually

## Cost Tracking

Current services: 4 (Postgres, Server, Auth, Web)

Estimated cost per month (free tier):
- PostgreSQL: ~$1-2
- Server: ~$1-1.5
- Auth: ~$1-1.5
- Web: ~$0.5-1
- **Total: ~$4-6/month**

Free tier credit: $5/month

- [ ] Monitored usage in Railway dashboard
- [ ] Staying within free tier limits
- [ ] Considered upgrade path if needed

## Notes

Date deployed: _______________
Web URL: _______________
Server URL: _______________
Auth URL: _______________

Issues encountered:
_______________________
_______________________

---

**Completed Date:** _______________
**Deployed By:** _______________
