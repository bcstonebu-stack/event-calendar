# Event Calendar Web App

## Overview
A modern, minimalist event calendar web application with light/dark mode support. The app runs entirely in the browser with local storage, requiring no backend or authentication.

## Design Principles
- **Modern & Sleek**: Clean interface with smooth transitions and contemporary UI patterns
- **Minimalist**: Focus on essential features without clutter
- **Responsive**: Works seamlessly across desktop, tablet, and mobile devices
- **Accessible**: Proper contrast ratios, keyboard navigation, and ARIA labels

## Core Features

### 1. Event Management
**Add Events**
- Quick add form with essential fields:
  - Event title (required)
  - Date and time (required)
  - End date/time (optional)
  - Description (optional)
  - Color/category tag (optional)
  - Location (optional)
- Inline validation with helpful error messages
- Support for all-day events
- Support for multi-day events

**Edit Events**
- Click event to view details
- Edit any field inline or via modal
- Changes save automatically or with confirmation
- Visual feedback on save success

**Delete Events**
- Delete from event detail view
- Confirmation prompt to prevent accidents
- Undo option for recent deletions (optional but nice)

### 2. View Modes

**Calendar Grid View**
- Monthly calendar grid as default view
- Week numbers (optional toggle)
- Navigation: Previous/Next month, Today button, Month/Year picker
- Multiple events per day shown as compact pills/badges
- Click day to see all events for that day
- Visual indicators for:
  - Today's date (highlighted)
  - Days with events (dot or badge)
  - Selected date
  - Multi-day event spans

**List View**
- Chronological list of upcoming events
- Group by date headers (Today, Tomorrow, This Week, etc.)
- Past events accessible via toggle or separate section
- Compact card design for each event
- Quick actions: Edit, Delete icons
- Empty state message when no events exist

**Toggle Controls**
- Easy switch between Grid and List views
- View preference saved to localStorage

### 3. Light/Dark Mode
**Theme System**
- Toggle button in header (sun/moon icon)
- Smooth transition between themes
- Respects system preference on first load (`prefers-color-scheme`)
- Preference saved to localStorage
- Both themes must maintain excellent contrast and readability

**Light Mode Palette**
- Background: Off-white (#FAFAFA or similar)
- Surface: Pure white (#FFFFFF)
- Text: Dark gray (#1F1F1F)
- Accent: Vibrant but not harsh (blue, purple, or teal recommended)
- Borders: Subtle gray (#E0E0E0)

**Dark Mode Palette**
- Background: True dark (#0F0F0F or #121212)
- Surface: Slightly elevated dark (#1E1E1E or #1F1F1F)
- Text: Off-white (#E0E0E0 or #FAFAFA)
- Accent: Same hue as light mode but adjusted brightness
- Borders: Subtle lighter gray (#2F2F2F)

## Technical Specifications

### Technology Stack
**Frontend Framework**: React (functional components with hooks)
**Styling**: Tailwind CSS (utility-first approach for consistency)
**Icons**: Lucide React (lightweight, consistent icon set)
**Date Handling**: Native JavaScript Date or date-fns (if complex date math needed)
**Storage**: localStorage for event persistence and user preferences

### Data Structure

```javascript
// Event Object
{
  id: string (UUID),
  title: string,
  description: string,
  startDate: ISO 8601 string,
  endDate: ISO 8601 string (optional),
  allDay: boolean,
  color: string (hex color or category),
  location: string (optional),
  createdAt: ISO 8601 string,
  updatedAt: ISO 8601 string
}

// localStorage Keys
- 'events': JSON array of event objects
- 'theme': 'light' | 'dark'
- 'defaultView': 'grid' | 'list'
```

### Key Components

1. **App.jsx**: Main container, theme provider, localStorage initialization
2. **Header.jsx**: App title, view toggle, theme toggle, add event button
3. **CalendarGrid.jsx**: Monthly calendar view with date cells
4. **EventList.jsx**: Chronological event list with grouping
5. **EventCard.jsx**: Individual event display (reusable in both views)
6. **EventModal.jsx**: Add/edit event form in modal overlay
7. **EventDetail.jsx**: Expanded event view with edit/delete actions
8. **ThemeToggle.jsx**: Light/dark mode switcher

### User Experience Details

**Navigation**
- Header always visible (sticky)
- Smooth scrolling and transitions
- Keyboard shortcuts (optional):
  - `N`: New event
  - `T`: Jump to today
  - `V`: Toggle view
  - `Arrow keys`: Navigate dates in grid view

**Interactions**
- Hover states on all interactive elements
- Loading states (even if instant, for polish)
- Toast notifications for actions (Event saved, Event deleted, etc.)
- Focus management for modals and forms

**Responsive Breakpoints**
- Mobile (< 640px): List view default, simplified calendar grid
- Tablet (640px - 1024px): Adapted layouts, touch-friendly targets
- Desktop (> 1024px): Full feature set, optimal spacing

**Empty States**
- No events created yet: Call-to-action to add first event
- No events for selected date: Friendly message with today link
- No search results (if search added): Clear message with reset option

## Development Guidelines

### Code Quality
- Use TypeScript or PropTypes for type safety
- Component-driven architecture
- Custom hooks for localStorage and theme management
- Proper error boundaries
- Console-free in production (no console.log statements)

### Performance
- Lazy load modals/dialogs
- Memoize expensive calendar calculations
- Debounce search/filter inputs (if added)
- Optimize re-renders with React.memo where appropriate

### Accessibility
- Semantic HTML5 elements
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus indicators clearly visible
- Color is not the only indicator of information
- Minimum contrast ratio of 4.5:1 for normal text

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- localStorage required (graceful degradation with warning if unavailable)

## Future Enhancement Ideas
(Not for initial version, but good to keep in mind)
- Event categories with color coding
- Search and filter functionality
- Import/export events (JSON, CSV, iCal)
- Recurring events
- Reminders/notifications
- Print stylesheet
- Multi-select for bulk operations
- Drag-and-drop rescheduling
- Cloud sync with authentication
- Shared calendars
- Different calendar views (week, day, agenda)

## File Structure
```
src/
├── components/
│   ├── Calendar/
│   │   ├── CalendarGrid.jsx
│   │   ├── CalendarCell.jsx
│   │   └── CalendarHeader.jsx
│   ├── Events/
│   │   ├── EventList.jsx
│   │   ├── EventCard.jsx
│   │   ├── EventModal.jsx
│   │   └── EventDetail.jsx
│   ├── UI/
│   │   ├── Header.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   └── App.jsx
├── hooks/
│   ├── useLocalStorage.js
│   ├── useTheme.js
│   └── useEvents.js
├── utils/
│   ├── dateHelpers.js
│   ├── eventHelpers.js
│   └── constants.js
└── styles/
    └── globals.css (Tailwind imports)
```

## Success Criteria
- ✅ User can create, edit, and delete events
- ✅ Events persist across browser sessions
- ✅ Calendar grid shows events clearly
- ✅ List view displays events chronologically
- ✅ Light/dark mode toggle works flawlessly
- ✅ Responsive on mobile, tablet, and desktop
- ✅ No console errors or warnings
- ✅ Intuitive UX requiring no instructions
- ✅ Professional, modern aesthetic
- ✅ Fast load time and smooth interactions

## Getting Started
This spec can be implemented as a single-page React application. Start with the core event management (add/view/delete), then layer on the calendar grid view, followed by list view and theme switching.

Focus on getting the data flow and localStorage working first, then polish the UI/UX with animations and refined styling.