/**
 * Generate a unique ID for an event
 * @returns {string}
 */
export function generateId() {
  // Simple UUID alternative without external dependency
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a new event object
 * @param {Object} eventData
 * @returns {Object}
 */
export function createEvent(eventData) {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    title: eventData.title,
    description: eventData.description || '',
    startDate: eventData.startDate,
    endDate: eventData.endDate || null,
    allDay: eventData.allDay || false,
    color: eventData.color || '#3B82F6',
    location: eventData.location || '',
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Update an existing event
 * @param {Object} event - Existing event
 * @param {Object} updates - Updates to apply
 * @returns {Object}
 */
export function updateEvent(event, updates) {
  return {
    ...event,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Validate event data
 * @param {Object} eventData
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateEvent(eventData) {
  const errors = {};

  if (!eventData.title || eventData.title.trim() === '') {
    errors.title = 'Title is required';
  }

  if (!eventData.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (eventData.endDate && eventData.startDate) {
    const start = new Date(eventData.startDate);
    const end = new Date(eventData.endDate);
    if (end < start) {
      errors.endDate = 'End date must be after start date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Filter events by search query
 * @param {Array} events
 * @param {string} query
 * @returns {Array}
 */
export function filterEvents(events, query) {
  if (!query || query.trim() === '') {
    return events;
  }

  const lowerQuery = query.toLowerCase();

  return events.filter(event => {
    return (
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      (event.location && event.location.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get events for a specific day
 * @param {Array} events
 * @param {Date} day
 * @returns {Array}
 */
export function getEventsForDay(events, day) {
  return events.filter(event => {
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : start;

    // Check if day falls within event range
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);

    return (start <= dayEnd && end >= dayStart);
  });
}

/**
 * Check if an event spans multiple days
 * @param {Object} event
 * @returns {boolean}
 */
export function isMultiDayEvent(event) {
  if (!event.endDate) return false;

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  return start.toDateString() !== end.toDateString();
}

/**
 * Format event duration
 * @param {Object} event
 * @returns {string}
 */
export function getEventDuration(event) {
  if (event.allDay) {
    return 'All day';
  }

  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : null;

  if (!end) {
    return start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return `${startTime} - ${endTime}`;
}
