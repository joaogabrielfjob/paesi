# Railway Deployment Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Railway Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL Database                  │    │
│  │                                                          │    │
│  │  • Port: 5432                                           │    │
│  │  • Shared by all services                              │    │
│  │  • Auto-backups enabled                                │    │
│  └───────────────┬──────────────────┬─────────────────────┘    │
│                  │                  │                            │
│      ┌───────────┴────────┐   ┌────┴──────────────┐           │
│      │                    │   │                    │           │
│  ┌───▼──────────────┐ ┌──▼───▼─────────────────┐ │           │
│  │  Server (Go)     │ │  Auth (Bun)            │ │           │
│  │                  │ │                        │ │           │
│  │  • Port: 7777    │ │  • Port: 3000         │ │           │
│  │  • API endpoints │ │  • Authentication     │ │           │
│  │  • Products      │ │  • Better-Auth        │ │           │
│  │  • Orders        │ │  • JWT tokens         │ │           │
│  │  • Addresses     │ │  • User management    │ │           │
│  └──────────────────┘ └────────────────────────┘ │           │
│           ▲                      ▲                │           │
│           │                      │                │           │
│           └──────────┬───────────┘                │           │
│                      │                            │           │
│              ┌───────▼──────────────────────┐     │           │
│              │   Web (React + Vite)         │     │           │
│              │                               │     │           │
│              │  • Port: 5173                │     │           │
│              │  • React frontend            │     │           │
│              │  • Vite build                │     │           │
│              │  • Public facing             │     │           │
│              └──────────────────────────────┘     │           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴─────────┐
                    │   Internet Users   │
                    └───────────────────┘
```

## 📦 Services Overview

### PostgreSQL Database
- **Type**: Managed database
- **Purpose**: Store all application data
- **Access**: Internal only (not publicly accessible)
- **Tables**: 
  - Products
  - Orders & Order Items
  - Users
  - Addresses
  - Auth sessions

### Server (Go + Gin)
- **Type**: API Service
- **Root**: `/server`
- **Build**: Nixpacks (auto-detects Go)
- **Public URL**: `https://server-production-*.railway.app`
- **Endpoints**:
  - `GET /products` - List products
  - `POST /order` - Create order
  - `GET /orders/:userId` - Get orders
  - `GET /addresses/:userId` - Get addresses
  - `POST /addresses` - Create/update address

### Auth (Bun + Better-Auth)
- **Type**: Authentication Service
- **Root**: `/auth`
- **Build**: Nixpacks (auto-detects Bun)
- **Public URL**: `https://auth-production-*.railway.app`
- **Endpoints**:
  - `POST /api/auth/sign-up/email` - Register
  - `POST /api/auth/sign-in/email` - Login
  - `POST /api/auth/sign-out` - Logout
  - `GET /api/auth/get-session` - Get session

### Web (React + Vite)
- **Type**: Frontend Service
- **Root**: `/web`
- **Build**: Nixpacks (auto-detects Node.js)
- **Public URL**: `https://web-production-*.railway.app`
- **Features**:
  - Product catalog
  - Shopping cart
  - User authentication
  - Order management
  - Address management

## 🔄 Data Flow

### User Registration Flow
```
User (Browser)
    │
    │ 1. POST /api/auth/sign-up/email
    ▼
Web Service
    │
    │ 2. Forward to Auth
    ▼
Auth Service
    │
    │ 3. Create user
    ▼
PostgreSQL
    │
    │ 4. Return JWT token
    ▼
Web Service
    │
    │ 5. Store token, redirect
    ▼
User (Browser)
```

### Product Order Flow
```
User (Browser)
    │
    │ 1. POST /order
    ▼
Web Service
    │
    │ 2. Send with JWT token
    ▼
Server Service
    │
    │ 3. Verify JWT
    ▼
    │ 4. Create order
    ▼
PostgreSQL
    │
    │ 5. Return order details
    ▼
Web Service
    │
    │ 6. Display confirmation
    ▼
User (Browser)
```

## 🌐 Network Configuration

### Public Access
```
Internet → Railway Load Balancer → Web Service (Port 443/HTTPS)
```

### Internal Communication
```
Web → Server: HTTPS (public URL)
Web → Auth:   HTTPS (public URL)
Server → DB:  Internal (private network)
Auth → DB:    Internal (private network)
```

### CORS Configuration
```
Server ALLOWED_ORIGINS: https://web-production-*.railway.app
Auth ALLOWED_ORIGINS:   https://web-production-*.railway.app
```

## 🔒 Security

### Environment Variables
- ✅ Database credentials: Railway-managed
- ✅ JWT secrets: Environment variables
- ✅ API URLs: Environment variables
- ❌ No secrets in code

### Network Security
- ✅ HTTPS enforced
- ✅ CORS properly configured
- ✅ Database not publicly accessible
- ✅ Environment-based configuration

## 📊 Resource Allocation (Free Tier)

```
PostgreSQL
├── RAM: 256MB (shared)
├── Storage: 1GB
└── Cost: ~$1-2/month

Server (Go)
├── RAM: 512MB
├── CPU: Shared
└── Cost: ~$1-1.5/month

Auth (Bun)
├── RAM: 512MB
├── CPU: Shared
└── Cost: ~$1-1.5/month

Web (React)
├── RAM: 512MB
├── CPU: Shared
└── Cost: ~$0.5-1/month

Total: ~$4-6/month (within $5 free tier ✅)
```

## 🚀 Deployment Process

```
Developer
    │
    │ 1. git push
    ▼
GitHub Repository
    │
    │ 2. Webhook trigger
    ▼
Railway Platform
    │
    ├─> Check watch patterns
    │   (only rebuild changed services)
    │
    ├─> Build phase
    │   ├─> Install dependencies
    │   ├─> Run build command
    │   └─> Create container
    │
    ├─> Deploy phase
    │   ├─> Start new container
    │   ├─> Run health checks
    │   └─> Switch traffic
    │
    └─> Monitoring
        ├─> Logs
        ├─> Metrics
        └─> Alerts
```

## 🔄 Auto-Deployment Triggers

### When Server Code Changes
```
server/**/*.go → Rebuild Server only
```

### When Auth Code Changes
```
auth/**/*.ts → Rebuild Auth only
```

### When Web Code Changes
```
web/**/*.{tsx,ts,css} → Rebuild Web only
```

### When Root Files Change
```
*.md, *.sh → No rebuild (documentation only)
```

## 📈 Scaling Strategy

### Current (Free Tier)
```
1 instance per service
No horizontal scaling
Sleeps after 30min inactivity
```

### Future (Paid Plan)
```
Multiple replicas per service
Load balancing
Multi-region deployment
Always-on (no sleep)
```

## 🎯 Monitoring Points

### Application Metrics
- Request rate
- Response time
- Error rate
- Database queries

### System Metrics
- CPU usage
- Memory usage
- Network I/O
- Disk usage

### Business Metrics
- User registrations
- Orders created
- Product views
- Active sessions

## 🆘 Health Checks

```
Web:    GET / → 200 OK
Server: GET /health → 200 OK (if implemented)
Auth:   GET / → 200 OK
DB:     Connection pool → OK
```

## 📝 Logging Strategy

```
Application Logs
├── Server: stdout (Go log)
├── Auth: console.log (Bun)
└── Web: browser console + server logs

Railway Logs
├── Build logs
├── Deploy logs
└── Runtime logs (last 30 days)
```

---

This architecture provides:
- ✅ Service isolation
- ✅ Horizontal scalability (future)
- ✅ Independent deployments
- ✅ Cost-effective (free tier)
- ✅ Easy maintenance
