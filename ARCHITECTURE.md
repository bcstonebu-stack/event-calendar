# Event Calendar Architecture

## Overview

This is a full-stack event calendar application with a React frontend, Express backend, and PostgreSQL database. It's designed to be easily deployable using Docker.

## Architecture Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │         │   Express   │         │ PostgreSQL  │
│   (React)   │ ◄─────► │  Backend    │ ◄─────► │  Database   │
│             │  HTTP   │     API     │  Prisma │             │
└─────────────┘         └─────────────┘         └─────────────┘
  Port: 80/5173           Port: 3001               Port: 5432
```

## Components

### Frontend (React + Vite)
- **Location**: `/src`
- **Technology**: React 18, Vite, Tailwind CSS
- **Key Files**:
  - `src/hooks/useEventsAPI.js` - API integration
  - `src/components/App.jsx` - Main application
  - `Dockerfile` - Multi-stage build (Node.js → Nginx)

**How it works:**
1. React app makes HTTP requests to backend API
2. Uses `fetch()` API to communicate with Express
3. Manages UI state with React hooks
4. Built with Vite and served by Nginx in production

### Backend (Express + Prisma)
- **Location**: `/server`
- **Technology**: Node.js, Express, Prisma ORM
- **Key Files**:
  - `server/src/server.js` - Express application
  - `server/src/routes/eventRoutes.js` - API routes
  - `server/src/controllers/eventController.js` - Business logic
  - `server/prisma/schema.prisma` - Database schema

**How it works:**
1. Express server listens on port 3001
2. Routes map URLs to controller functions
3. Controllers use Prisma to query PostgreSQL
4. Responses sent back as JSON

### Database (PostgreSQL)
- **Technology**: PostgreSQL 16
- **Schema**: Defined in `server/prisma/schema.prisma`
- **Migrations**: Located in `server/prisma/migrations/`

**Schema Overview:**
```prisma
model Event {
  id          String   @id @default(uuid())
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime?
  allDay      Boolean  @default(false)
  color       String?
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Data Flow

### Creating an Event

1. **User clicks "Add Event"** in React app
2. **User fills form** and submits
3. **Frontend** calls `addEvent()` from `useEventsAPI` hook
4. **HTTP POST** to `http://localhost:3001/api/events`
5. **Express route** `/api/events` → `createEvent()` controller
6. **Controller validates** data and calls Prisma
7. **Prisma** executes SQL INSERT into PostgreSQL
8. **Database** returns new event with generated ID
9. **Controller** sends JSON response back to frontend
10. **React** updates state and re-renders UI

### Fetching Events

1. **App loads** → `useEventsAPI` hook runs
2. **useEffect** triggers `fetchEvents()`
3. **HTTP GET** to `http://localhost:3001/api/events`
4. **Express route** → `getAllEvents()` controller
5. **Prisma** queries database: `findMany()`
6. **PostgreSQL** returns all events
7. **Frontend** updates state with events
8. **Calendar/List** components render events

## Docker Architecture

### Services in docker-compose.yml

1. **postgres** (PostgreSQL database)
   - Image: `postgres:16-alpine`
   - Persistent volume: `postgres_data`
   - Healthcheck ensures it's ready before backend starts

2. **backend** (Express API)
   - Built from `server/Dockerfile`
   - Waits for postgres to be healthy
   - Runs migrations on startup
   - Connected to postgres via Docker network

3. **frontend** (React app served by Nginx)
   - Built from root `Dockerfile`
   - Multi-stage build (build stage + nginx stage)
   - Waits for backend to be ready

### Docker Networking

All containers are on the same Docker network, allowing them to communicate by service name:
- Backend connects to `postgres:5432` (not localhost!)
- Frontend is built with API URL pointing to host machine

## Development vs Production

### Development (Without Docker)

**Terminal 1 - Database:**
```bash
# PostgreSQL running locally on localhost:5432
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev  # Runs on localhost:3001 with --watch
```

**Terminal 3 - Frontend:**
```bash
npm run dev  # Runs on localhost:5173 with HMR
```

### Production (With Docker)

```bash
docker-compose up -d
```

All three services run in containers:
- Frontend: Port 80 (Nginx)
- Backend: Port 3001
- Database: Port 5432 (not exposed by default)

## Key Technologies Explained

### Prisma ORM
- **What**: Type-safe database toolkit
- **Why**: Easier than writing raw SQL, prevents SQL injection
- **Key Commands**:
  - `prisma migrate dev` - Create new migration
  - `prisma migrate deploy` - Run migrations in production
  - `prisma generate` - Generate TypeScript types
  - `prisma studio` - Database GUI

### Vite
- **What**: Fast build tool for modern web apps
- **Why**: Faster than Webpack, better dev experience
- **Features**: Hot Module Replacement (HMR), instant server start

### Docker Compose
- **What**: Tool for defining multi-container apps
- **Why**: One command to start entire stack
- **Benefits**: Consistent environment, easy onboarding

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```
- `VITE_` prefix required for Vite to expose to browser

### Backend (server/.env)
```
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=3001
NODE_ENV=development
```

## Security Considerations

### Current Implementation
- CORS enabled for development
- No authentication (suitable for single-user/local deployment)
- Environment variables for sensitive data
- Prisma protects against SQL injection

### Future Enhancements
- Add user authentication (JWT, OAuth)
- Rate limiting on API endpoints
- HTTPS for production
- Row-level security in PostgreSQL
- API key authentication for integrations

## Scaling Possibilities

### Current Limitations
- Single database instance
- No caching layer
- No load balancing

### Future Scalability Options
1. **Add Redis** for caching events
2. **PostgreSQL replication** for read scaling
3. **Multiple backend instances** behind load balancer
4. **CDN** for frontend static assets
5. **Supabase migration** for managed PostgreSQL + real-time

## Common Issues & Solutions

### "Cannot connect to database"
- Check DATABASE_URL in server/.env
- Ensure PostgreSQL is running
- Verify credentials are correct

### "API requests fail with CORS error"
- Verify backend is running
- Check VITE_API_URL in .env
- Ensure cors() middleware is enabled

### "Docker build fails"
- Check Docker is running
- Verify Dockerfiles syntax
- Try: `docker-compose down -v && docker-compose up --build`

## Next Steps / Roadmap

1. **Authentication** - Add user accounts
2. **Real-time updates** - WebSockets for live calendar sync
3. **Recurring events** - Support for daily/weekly/monthly recurrence
4. **Calendar sharing** - Share calendars with others
5. **Integrations** - Google Calendar sync, iCal export
6. **Mobile app** - React Native version
7. **Notifications** - Email/push reminders

## Learning Resources

- **Prisma**: https://www.prisma.io/docs
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Docker**: https://docs.docker.com/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Last Updated**: 2024-10-30
