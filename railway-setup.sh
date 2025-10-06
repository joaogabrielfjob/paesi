#!/bin/bash

# Railway Environment Variables Setup Script
# This script helps generate the environment variable configuration for Railway

echo "🚂 Railway Environment Variables Generator"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to generate a random JWT secret
generate_jwt_secret() {
    openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
}

echo -e "${YELLOW}Step 1: Database Configuration${NC}"
echo "After creating a PostgreSQL database in Railway, use these variable references:"
echo ""
echo "DB_HOST=\${{Postgres.PGHOST}}"
echo "DB_PORT=\${{Postgres.PGPORT}}"
echo "DB_USER=\${{Postgres.PGUSER}}"
echo "DB_PASSWORD=\${{Postgres.PGPASSWORD}}"
echo "DB_NAME=\${{Postgres.PGDATABASE}}"
echo ""

echo -e "${YELLOW}Step 2: Generate JWT Secret${NC}"
JWT_SECRET=$(generate_jwt_secret)
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo -e "${GREEN}✓ Copy this JWT_SECRET and add it to your Server service${NC}"
echo ""

echo -e "${YELLOW}Step 3: Service URLs${NC}"
echo "After deploying each service, Railway will give you URLs."
echo "You'll need to update the following variables:"
echo ""
echo "For Server service:"
echo "  ALLOWED_ORIGINS=https://your-web-app.railway.app"
echo ""
echo "For Auth service:"
echo "  ALLOWED_ORIGINS=https://your-web-app.railway.app"
echo ""
echo "For Web service:"
echo "  VITE_API_URL=https://your-server.railway.app"
echo "  VITE_AUTH_URL=https://your-auth.railway.app"
echo ""

echo -e "${YELLOW}Step 4: Deployment Order${NC}"
echo "1. Deploy PostgreSQL"
echo "2. Deploy Server (Go) - sets up database schema"
echo "3. Deploy Auth (Bun) - sets up auth tables"
echo "4. Deploy Web (React) - frontend"
echo ""

echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "📚 For detailed instructions, see RAILWAY_DEPLOYMENT.md"
