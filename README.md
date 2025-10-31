# Event Calendar Web App

A modern, minimalist event calendar web application built with React, Express, and PostgreSQL. Features light/dark mode support, persistent storage, and easy Docker deployment.

## TL;DR

```bash
# One-command setup (requires Docker)
./setup.sh

# Or manually
docker-compose up -d

# Access at http://localhost
```

**What you get:**
- 📅 Full-featured calendar with grid & list views
- 🌓 Light/dark mode
- 🔒 Secure by default (input validation, rate limiting, environment-based config)
- 🐳 Docker-ready (PostgreSQL + Express + React)
- 💾 Persistent storage that survives restarts
- ⚡ Fast setup - works on any machine with Docker

## Features

- **Event Management**: Create, edit, and delete events with titles, descriptions, dates, times, colors, and locations
- **Multiple Views**: Switch between calendar grid view and chronological list view
- **Light/Dark Mode**: Automatic theme detection with manual toggle
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Persistent Storage**: PostgreSQL database for reliable data persistence
- **Docker Ready**: One-command deployment with Docker Compose
- **REST API**: Clean backend API for easy integration
- **Modern UI**: Clean, minimalist interface with smooth transitions

## Tech Stack

### Frontend
- **React 18** - UI framework with functional components and hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon set
- **date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework for REST API
- **Prisma** - Type-safe database ORM
- **PostgreSQL 16** - Reliable relational database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for production frontend

## Quick Start (Docker - Recommended)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Using the Setup Script (Easiest)

```bash
# Clone the repository
git clone <your-repo-url>
cd event-calendar

# Run the automated setup script
./setup.sh

# Access the app at:
# Frontend: http://localhost
# API: http://localhost:3001/api
```

The setup script will:
- ✅ Check Docker installation
- ✅ Generate secure random passwords
- ✅ Create .env files automatically
- ✅ Start all containers

### Manual Docker Setup

```bash
# Clone and enter directory
git clone <your-repo-url>
cd event-calendar

# Create environment files
cp .env.example .env
cp server/.env.example server/.env

# IMPORTANT: Edit .env and server/.env to set secure passwords
# Change POSTGRES_PASSWORD from default value

# Start all services
docker-compose up -d
```

That's it! See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions, manual setup, and troubleshooting.

## Development Setup (Without Docker)

### Prerequisites

- Node.js 20+
- PostgreSQL 16+

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run prisma:migrate
npm run dev
```

### Frontend Setup

```bash
# In a new terminal, from project root
npm install
cp .env.example .env
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
event-calendar/
├── src/                          # Frontend React app
│   ├── components/
│   │   ├── Calendar/             # Calendar grid view
│   │   ├── Events/               # Event list, modals, cards
│   │   └── UI/                   # Reusable UI components
│   ├── hooks/
│   │   ├── useEventsAPI.js       # API integration hook
│   │   ├── useTheme.js           # Dark/light mode
│   │   └── useLocalStorage.js    # Browser storage utility
│   └── utils/                    # Helper functions
├── server/                       # Backend Express API
│   ├── src/
│   │   ├── controllers/          # Business logic
│   │   ├── routes/               # API endpoints
│   │   └── server.js             # Express app
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   └── Dockerfile                # Backend container
├── docker-compose.yml            # Orchestration config
├── Dockerfile                    # Frontend container
└── DEPLOYMENT.md                 # Detailed deployment guide
```

## Usage

### Adding an Event

1. Click the "Add Event" button in the header
2. Fill in the event details (title is required)
3. Choose a color for the event
4. Click "Add Event" to save

### Editing an Event

- In list view: Click the edit icon on an event card
- In any view: Click an event to view details, then click "Edit"

### Deleting an Event

- In list view: Click the trash icon on an event card
- In detail view: Click the "Delete" button and confirm

### Switching Views

Use the Grid/List toggle in the header to switch between:
- **Grid View**: Monthly calendar with events displayed in date cells
- **List View**: Chronological list grouped by "Today", "Tomorrow", "This Week", etc.

### Theme Toggle

Click the sun/moon icon in the header to toggle between light and dark modes. The app respects your system preference on first load.

## Browser Support

Modern evergreen browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: The app now uses PostgreSQL for persistence. The old localStorage version is preserved in the `useEvents.js` hook if needed.

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

### Event Object Schema

```json
{
  "id": "uuid",
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

## Security

### Local Development

For local use, the default configuration is secure enough. The setup script automatically generates random passwords.

### Production Deployment

**⚠️ IMPORTANT**: Before deploying to production, you MUST:

1. **Change All Passwords**
   - Update `POSTGRES_PASSWORD` in `.env` with a strong password
   - Never use default passwords in production

2. **Configure CORS**
   - Set `CORS_ORIGIN` in `.env` to your frontend domain
   - Example: `CORS_ORIGIN=https://yourdomain.com`
   - Never use `*` in production

3. **Use HTTPS**
   - Configure SSL/TLS certificates
   - Use a reverse proxy (nginx, Caddy, Traefik)

4. **Environment Variables**
   - Never commit `.env` files to git
   - Use secure secret management for production
   - Rotate passwords regularly

### Security Features Included

- ✅ **Input Validation**: All event data is validated before saving
- ✅ **SQL Injection Protection**: Prisma ORM prevents SQL injection
- ✅ **Rate Limiting**: API rate limits prevent abuse (100 requests/15min in production)
- ✅ **Request Size Limits**: JSON payload limited to 10MB
- ✅ **CORS Configuration**: Configurable cross-origin resource sharing
- ✅ **Environment-based Security**: Different settings for dev/prod

### What's NOT Included (Add for Production)

- ❌ **Authentication**: No user login system (designed for single-user/local use)
- ❌ **HTTPS**: Must be configured separately
- ❌ **DDoS Protection**: Use Cloudflare or similar
- ❌ **Audit Logging**: Not implemented

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production security checklist.

## Migration from localStorage

If you're upgrading from the localStorage version, your old events won't automatically migrate. You can:

1. Export events from browser console: `JSON.stringify(localStorage.getItem('events'))`
2. Transform to API format
3. POST each event to `/api/events`

Or simply start fresh with the new database backend!

## Roadmap

### Version 2.0 - Planned Features

**🔐 Authentication & Multi-User Support**
- User registration and login system
- JWT-based authentication
- Per-user event isolation
- Admin dashboard

**🔄 Advanced Event Features**
- Recurring events (daily, weekly, monthly, yearly)
- Event categories and tags
- Event reminders/notifications (email/push)
- Event attachments (files, links)
- Event sharing via public links

**📱 Enhanced User Experience**
- Drag-and-drop event rescheduling
- Week view and day view
- Mini calendar date picker
- Search and filter events
- Keyboard shortcuts
- Print-friendly view

**🔗 Integrations**
- Google Calendar sync
- iCal import/export
- Outlook calendar integration
- Webhook support for automation
- Public API with documentation

**🌐 Collaboration Features**
- Shared calendars
- Event invitations and RSVPs
- Real-time updates (WebSockets)
- Comments on events
- Activity feed

**📊 Analytics & Insights**
- Event statistics dashboard
- Time tracking
- Calendar heatmap visualization
- Export reports (PDF, CSV)

**🎨 Customization**
- Custom color themes
- Calendar view preferences
- Timezone support
- Multiple language support (i18n)

**🚀 Performance & Scalability**
- Redis caching layer
- PostgreSQL read replicas
- CDN for static assets
- Background job processing
- Database optimization

### Version 1.1 - Near-term Improvements

- [ ] Mobile-responsive improvements
- [ ] Undo/redo for event operations
- [ ] Event templates for quick creation
- [ ] Bulk event operations
- [ ] Calendar export to PDF
- [ ] Enhanced accessibility (ARIA, screen reader support)
- [ ] Progressive Web App (PWA) support

**Want to contribute?** See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT

## Contributing

This is a personal project, but suggestions and feedback are welcome! Check out the [Roadmap](#roadmap) above to see what's planned.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

## What I Learned

This project helped me get comfortable using Warp, Claude Code CLI, and Git together in a real development workflow.
I learned how to:

- Use **Claude Code CLI** inside Warp to quickly scaffold and edit the project through short, clear prompts.
- Run and test the app locally, checking that features worked before committing changes.
- Push the finished work to **GitHub**, completing the full **build → test → push** cycle.

Working through each stage made the process of developing, testing, and versioning a project feel natural. It also showed me how different tools fit together.

---

**Last Updated:** 2025-10-31
**Version:** 1.0.0
