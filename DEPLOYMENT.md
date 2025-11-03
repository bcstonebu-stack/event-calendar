# Event Calendar - Deployment Guide

## ⚠️ IMPORTANT: API URL Configuration

Before deploying, you **MUST** configure the `VITE_API_URL` in your `.env` file based on how users will access your application:

| Access Method | VITE_API_URL Example | When to Use |
|---------------|---------------------|-------------|
| **Localhost** | `http://localhost:3001/api` | Testing on your local machine |
| **Domain Name** | `http://yourdomain.com:3001/api` | Accessing via domain (production) |
| **IP Address** | `http://192.168.1.100:3001/api` | Accessing via LAN/network IP |
| **Reverse Proxy** | `https://yourdomain.com/api` | Production with nginx/traefik |

**Why this matters:** The `VITE_API_URL` is **baked into the frontend JavaScript at build time**. If you set it to `localhost` but users access via an IP address, the frontend will fail to connect to the backend.

**After changing VITE_API_URL, you MUST rebuild the frontend:**
```bash
docker-compose up -d --build frontend
```

---

## Quick Start with Docker (Recommended)

The easiest way to run the Event Calendar app is with Docker Compose.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Git (to clone the repository)

### One-Command Deployment

```bash
# Clone the repository
git clone <your-repo-url>
cd event-calendar

# Start everything with Docker Compose
docker-compose up -d
```

That's it! The app will be available at:
- **Frontend**: http://localhost
- **API**: http://localhost:3001/api
- **Database**: localhost:5432 (PostgreSQL)

### Stop the Application

```bash
docker-compose down
```

### Stop and Remove Data

```bash
docker-compose down -v
```

---

## Manual Setup (Without Docker)

If you prefer to run without Docker, follow these steps:

### Prerequisites

- Node.js 20+ installed
- PostgreSQL installed and running
- Git

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

**Ubuntu/Debian:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Login to PostgreSQL
psql postgres

# Create user and database
CREATE USER calendar_user WITH PASSWORD 'calendar_password';
CREATE DATABASE event_calendar OWNER calendar_user;
\q
```

### 3. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://calendar_user:calendar_password@localhost:5432/event_calendar"

# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Start the backend server
npm run dev
```

Backend will run on http://localhost:3001

### 4. Setup Frontend

```bash
# In a new terminal, from project root
cd event-calendar

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default should work)
# VITE_API_URL=http://localhost:3001/api

# Start the dev server
npm run dev
```

Frontend will run on http://localhost:5173

---

## Environment Variables

### Backend (.env in `server/` folder)

```env
DATABASE_URL="postgresql://username:password@host:port/database"
PORT=3001
NODE_ENV=development
```

### Frontend (.env in root folder)

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Database Management

### View Database with Prisma Studio

```bash
cd server
npm run prisma:studio
```

Opens a GUI at http://localhost:5555 to view/edit database records.

### Create New Migration

```bash
cd server

# After changing schema.prisma
npm run prisma:migrate
```

### Reset Database

```bash
cd server
npx prisma migrate reset
```

---

## Production Deployment

### Docker Compose (Production)

```bash
# Build and run in production mode
docker-compose up -d --build
```

### Environment Variables for Production

1. Change database password in `docker-compose.yml`
2. Set `NODE_ENV=production` for backend
3. Update `VITE_API_URL` to your production domain

### Deploying to Cloud

**Option 1: VPS (DigitalOcean, Linode, etc.)**
1. Install Docker on server
2. Clone repository
3. Run `docker-compose up -d`
4. Configure nginx/reverse proxy
5. Add SSL with Let's Encrypt

**Option 2: Platform-as-a-Service**
- **Frontend**: Vercel, Netlify (build from root)
- **Backend**: Railway, Render, Fly.io
- **Database**: Supabase, Neon, Railway Postgres

---

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Run migrations: `npm run prisma:migrate`

### Frontend can't connect to API

**Symptom:** Frontend loads but shows "Loading events..." forever, or browser console shows connection errors.

**Most Common Cause:** Incorrect `VITE_API_URL` configuration.

**Solution:**
1. Check how you're accessing the app:
   - Browser URL is `http://localhost` → VITE_API_URL should be `http://localhost:3001/api`
   - Browser URL is `http://192.168.1.100` → VITE_API_URL should be `http://192.168.1.100:3001/api`
   - Browser URL is `http://yourdomain.com` → VITE_API_URL should be `http://yourdomain.com:3001/api`

2. Update `.env` file with the correct URL
3. **CRITICAL:** Rebuild the frontend container:
   ```bash
   docker-compose up -d --build frontend
   ```

**How to verify the issue:**
- Open browser DevTools (F12) → Console
- Look for errors like: `Failed to fetch` or `net::ERR_CONNECTION_REFUSED`
- Check the failing URL - if it's trying to connect to `localhost` but you're accessing via IP, this is the issue

**Other checks:**
- Backend is running: `curl http://localhost:3001/api/health`
- CORS is enabled in backend (should return `Access-Control-Allow-Origin` header)

### Docker issues
- Check Docker is running: `docker ps`
- View logs: `docker-compose logs -f`
- Rebuild: `docker-compose up -d --build`
- Remove everything: `docker-compose down -v`

### Database connection errors in Docker
- Wait for healthcheck: `docker-compose ps`
- Check logs: `docker-compose logs postgres`
- Ensure ports aren't in use: `lsof -i :5432`

---

## API Documentation

### Endpoints

```
GET    /api/health              - Health check
GET    /api/events              - Get all events
GET    /api/events/:id          - Get single event
POST   /api/events              - Create event
PUT    /api/events/:id          - Update event
DELETE /api/events/:id          - Delete event
```

### Example Event Object

```json
{
  "id": "uuid-here",
  "title": "Team Meeting",
  "description": "Weekly sync",
  "startDate": "2024-01-15T10:00:00.000Z",
  "endDate": "2024-01-15T11:00:00.000Z",
  "allDay": false,
  "color": "#3B82F6",
  "location": "Conference Room A",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Deployment**: Docker, Docker Compose

---

## License

MIT
