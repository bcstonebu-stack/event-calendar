import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  isAfter,
  isBefore,
  isWithinInterval
} from 'date-fns';

/**
 * Get all days to display in a calendar month view
 * @param {Date} date - The reference date
 * @returns {Date[]} Array of dates for the calendar grid
 */
export function getCalendarDays(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = [];
  let currentDay = calendarStart;

  while (currentDay <= calendarEnd) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return days;
}

/**
 * Check if a date is in the current month
 * @param {Date} date - Date to check
 * @param {Date} referenceDate - Reference month date
 * @returns {boolean}
 */
export function isCurrentMonth(date, referenceDate) {
  return isSameMonth(date, referenceDate);
}

/**
 * Check if two dates are the same day
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
export function isSameDayAs(date1, date2) {
  return isSameDay(date1, date2);
}

/**
 * Check if a date is today
 * @param {Date} date
 * @returns {boolean}
 */
export function isTodayDate(date) {
  return isToday(date);
}

/**
 * Format a date for display
 * @param {Date|string} date
 * @param {string} formatStr
 * @returns {string}
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format time for display
 * @param {Date|string} date
 * @returns {string}
 */
export function formatTime(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

/**
 * Format date and time for display
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateTime(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
}

/**
 * Check if an event occurs on a specific day
 * @param {Object} event - Event object with startDate and optional endDate
 * @param {Date} day - Day to check
 * @returns {boolean}
 */
export function isEventOnDay(event, day) {
  const start = parseISO(event.startDate);
  const end = event.endDate ? parseISO(event.endDate) : start;

  // Check if day falls within event range
  return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end);
}

/**
 * Group events by relative time (Today, Tomorrow, This Week, etc.)
 * @param {Array} events - Array of event objects
 * @returns {Object} Grouped events
 */
export function groupEventsByTime(events) {
  const now = new Date();
  const groups = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    past: []
  };

  events.forEach(event => {
    const eventDate = parseISO(event.startDate);

    if (isBefore(eventDate, now) && !isSameDay(eventDate, now)) {
      groups.past.push(event);
    } else if (isSameDay(eventDate, now)) {
      groups.today.push(event);
    } else if (isSameDay(eventDate, addDays(now, 1))) {
      groups.tomorrow.push(event);
    } else if (isWithinInterval(eventDate, { start: now, end: addDays(now, 7) })) {
      groups.thisWeek.push(event);
    } else {
      groups.later.push(event);
    }
  });

  return groups;
}

/**
 * Sort events by start date
 * @param {Array} events
 * @returns {Array} Sorted events
 */
export function sortEventsByDate(events) {
  return [...events].sort((a, b) => {
    const dateA = parseISO(a.startDate);
    const dateB = parseISO(b.startDate);
    return dateA - dateB;
  });
}

/**
 * Convert date to ISO string for storage
 * @param {Date} date
 * @returns {string}
 */
export function toISOString(date) {
  return date.toISOString();
}

/**
 * Parse ISO string to Date object
 * @param {string} dateString
 * @returns {Date}
 */
export function fromISOString(dateString) {
  return parseISO(dateString);
}
