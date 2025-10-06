# Paesi - E-commerce Platform

A full-stack e-commerce platform built with Go, Bun, and React.

## Architecture

- **Server** (Go + Gin): RESTful API for products, orders, and addresses
- **Auth** (Bun + Better-Auth): Authentication and user management service
- **Web** (React + Vite + TailwindCSS): Frontend application
- **Database** (PostgreSQL): Shared database for all services

## Quick Start (Local Development)

### Prerequisites

- Go 1.25+
- Bun runtime
- Node.js 18+
- PostgreSQL 15+

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/joaogabrielfjob/paesi.git
   cd paesi
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

3. **Start PostgreSQL**
   ```bash
   # Using Docker
   docker run --name paesi-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=paesi -p 5432:5432 -d postgres:15
   ```

4. **Run the services**

   **Terminal 1 - Go Server:**
   ```bash
   cd server
   go mod download
   make run  # or go run cmd/api/main.go
   # Server runs on http://localhost:7777
   ```

   **Terminal 2 - Auth Server:**
   ```bash
   cd auth
   bun install
   bun run dev
   # Auth server runs on http://localhost:3000
   ```

   **Terminal 3 - Web App:**
   ```bash
   cd web
   npm install
   npm run dev
   # Web app runs on http://localhost:5173
   ```

## Deploy to Railway

Railway offers a free tier perfect for deploying this project. Follow the [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md) for detailed instructions.

### Quick Railway Deployment

1. Push your code to GitHub
2. Create a new Railway project from GitHub
3. Add PostgreSQL database
4. Create three services (server, auth, web) with proper root directories
5. Configure environment variables
6. Deploy!

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for the complete step-by-step guide.

## Project Structure

```
paesi/
├── server/              # Go API Server
│   ├── cmd/api/        # Application entry point
│   ├── internal/       # Internal packages
│   │   ├── config/     # Configuration management
│   │   ├── db/         # Database connection
│   │   ├── domain/     # Domain models
│   │   ├── handler/    # HTTP handlers
│   │   ├── middleware/ # HTTP middleware
│   │   └── router/     # Route definitions
│   └── railway.json    # Railway configuration
│
├── auth/               # Authentication Server (Bun)
│   ├── auth.ts         # Better-Auth configuration
│   ├── server.ts       # Bun HTTP server
│   └── railway.json    # Railway configuration
│
├── web/                # Frontend Application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── routes/     # React Router config
│   │   └── hooks/      # Custom React hooks
│   └── railway.json    # Railway configuration
│
└── RAILWAY_DEPLOYMENT.md # Deployment guide
```

## API Endpoints

### Server (Go) - Port 7777
- `GET /products` - List all products
- `GET /user/:id` - Get user details
- `GET /addresses/:userId` - Get user addresses
- `POST /addresses` - Create/update address
- `POST /order` - Create order
- `GET /orders/:userId` - Get user orders

### Auth (Bun) - Port 3000
- `POST /api/auth/sign-up/email` - Register user
- `POST /api/auth/sign-in/email` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/update-user` - Update user info
- `POST /api/auth/change-email` - Change email

## Environment Variables

### Server
```env
PORT=7777
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=paesi
ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=your-secret-key
```

### Auth
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=paesi
ALLOWED_ORIGINS=http://localhost:5173
```

### Web
```env
VITE_API_URL=http://localhost:7777
VITE_AUTH_URL=http://localhost:3000
```

## Development

### Go Server
```bash
cd server
make run      # Run the server
make build    # Build binary
make test     # Run tests
```

### Auth Server
```bash
cd auth
bun run dev   # Development mode with hot reload
bun run start # Production mode
```

### Web App
```bash
cd web
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Lint code
```

## Database Migrations

- **Go Server**: Uses GORM AutoMigrate (runs automatically on startup)
- **Auth Server**: Uses Better-Auth migrations (runs automatically)

## Technologies

### Backend
- **Go** - High-performance API server
- **Gin** - HTTP web framework
- **GORM** - ORM for Go
- **Bun** - Fast JavaScript runtime
- **Better-Auth** - Modern authentication library

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Database
- **PostgreSQL** - Relational database

### Deployment
- **Railway** - Cloud platform (PaaS)
- **Nixpacks** - Build system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For deployment issues, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

For general questions, open an issue on GitHub.
