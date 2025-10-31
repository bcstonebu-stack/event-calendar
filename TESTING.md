# Testing Guide

## Pre-Deployment Checklist

Before deploying, verify everything works:

### 1. Docker Build Test

```bash
# Build all containers
docker-compose build

# Check for errors in build output
# ✅ Should complete without errors
```

### 2. Start Services

```bash
# Start all services
docker-compose up -d

# Check all containers are running
docker-compose ps

# Expected output:
# event-calendar-db        running  (healthy)
# event-calendar-backend   running
# event-calendar-frontend  running
```

### 3. Health Checks

```bash
# Test database is accessible
docker-compose exec postgres pg_isready -U calendar_user -d event_calendar
# ✅ Should output: accepting connections

# Test backend API
curl http://localhost:3001/api/health
# ✅ Should return: {"status":"ok","message":"Event Calendar API is running"}

# Test frontend
curl -I http://localhost
# ✅ Should return: HTTP/1.1 200 OK
```

### 4. View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service
docker-compose logs backend
docker-compose logs postgres
docker-compose logs frontend
```

## Functional Testing

### Test Event CRUD Operations

1. **Open the app**: http://localhost
   - ✅ Page loads without errors
   - ✅ Light/dark mode toggle works

2. **Create an event**:
   - Click "Add Event"
   - Fill in title: "Test Event"
   - Select a date
   - Click "Save"
   - ✅ Event appears in calendar
   - ✅ Event appears in list view

3. **Edit an event**:
   - Click the event
   - Click "Edit"
   - Change title to "Updated Test Event"
   - Click "Save"
   - ✅ Event title updates

4. **Delete an event**:
   - Click the event
   - Click "Delete"
   - Confirm deletion
   - ✅ Event disappears

5. **Refresh the page**:
   - Press F5 to reload
   - ✅ Events persist (not lost)
   - ✅ This confirms database is working!

### Test API Directly

```bash
# Create event via API
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Event",
    "startDate": "2024-12-25T10:00:00Z",
    "allDay": false
  }'

# Get all events
curl http://localhost:3001/api/events

# Get specific event (replace {id} with actual ID from create response)
curl http://localhost:3001/api/events/{id}

# Update event
curl -X PUT http://localhost:3001/api/events/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated via API"}'

# Delete event
curl -X DELETE http://localhost:3001/api/events/{id}
```

## Database Testing

### Connect to PostgreSQL

```bash
# Open Prisma Studio (GUI)
cd server
npm run prisma:studio
# Opens at http://localhost:5555

# Or connect via psql
docker-compose exec postgres psql -U calendar_user -d event_calendar

# List tables
\dt

# Query events
SELECT * FROM "Event";

# Exit
\q
```

## Performance Testing

### Load Test (Optional)

```bash
# Install Apache Bench (if not installed)
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Test API endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:3001/api/events

# Check response times
# ✅ Should handle concurrent requests without errors
```

## Troubleshooting Tests

### If containers won't start:

```bash
# Check Docker is running
docker --version

# View detailed logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Nuclear option - full reset
docker-compose down -v
docker-compose up --build -d
```

### If database won't connect:

```bash
# Check postgres logs
docker-compose logs postgres

# Verify environment variables
docker-compose exec backend printenv | grep DATABASE

# Test connection from backend container
docker-compose exec backend npx prisma db pull
```

### If frontend can't reach API:

```bash
# Check backend is running
curl http://localhost:3001/api/health

# Check frontend environment
cat .env

# Verify nginx config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

## Clean Up After Testing

```bash
# Stop all services
docker-compose down

# Remove all data (database will be empty on next start)
docker-compose down -v

# Remove images (will rebuild on next up)
docker-compose down --rmi all -v
```

## Manual Setup Testing

### Test Backend Alone

```bash
cd server

# Install dependencies
npm install

# Setup database (assumes PostgreSQL running locally)
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Start server
npm run dev

# Test in another terminal
curl http://localhost:3001/api/health
```

### Test Frontend Alone

```bash
# From project root
npm install

# Setup environment
cp .env.example .env

# Start dev server
npm run dev

# Visit http://localhost:5173
# ⚠️ Will show "Loading..." or errors if backend isn't running
```

## CI/CD Testing (Future)

For automated testing in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and test
        run: |
          docker-compose up -d
          sleep 10
          curl -f http://localhost:3001/api/health
          curl -f http://localhost
          docker-compose down
```

## Success Criteria

✅ All containers start without errors
✅ Health endpoints return 200 OK
✅ Can create, read, update, delete events via UI
✅ Can create, read, update, delete events via API
✅ Events persist after page refresh
✅ Events persist after container restart
✅ Light/dark mode toggle works
✅ Calendar and list views both work
✅ No console errors in browser
✅ No errors in Docker logs

---

**If all tests pass, you're ready to deploy! 🚀**
