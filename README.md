# Event Calendar Web App

A modern, minimalist event calendar web application built with React, Vite, and Tailwind CSS. Features light/dark mode support and runs entirely in the browser with local storage.

## Features

- **Event Management**: Create, edit, and delete events with titles, descriptions, dates, times, colors, and locations
- **Multiple Views**: Switch between calendar grid view and chronological list view
- **Light/Dark Mode**: Automatic theme detection with manual toggle
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: All events persist in your browser's local storage
- **Modern UI**: Clean, minimalist interface with smooth transitions

## Tech Stack

- **React 18** - UI framework with functional components and hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon set
- **date-fns** - Modern date utility library

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)

### Installation

1. Clone or download this repository

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
event-calendar/
├── src/
│   ├── components/
│   │   ├── Calendar/
│   │   │   ├── CalendarGrid.jsx
│   │   │   ├── CalendarCell.jsx
│   │   │   └── CalendarHeader.jsx
│   │   ├── Events/
│   │   │   ├── EventList.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventModal.jsx
│   │   │   └── EventDetail.jsx
│   │   ├── UI/
│   │   │   ├── Header.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Modal.jsx
│   │   └── App.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useTheme.js
│   │   └── useEvents.js
│   ├── utils/
│   │   ├── dateHelpers.js
│   │   ├── eventHelpers.js
│   │   └── constants.js
│   ├── styles/
│   │   └── globals.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
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

**Note**: localStorage is required for event persistence.

## Data Storage

All data is stored locally in your browser using localStorage. Events are stored as JSON and include:

- Unique ID
- Title and description
- Start and end dates/times
- All-day flag
- Color category
- Location
- Created and updated timestamps

## License

MIT

## Contributing

This is a personal project, but suggestions and feedback are welcome!
