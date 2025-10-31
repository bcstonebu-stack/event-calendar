import { useState, useEffect } from 'react';

// API base URL - will use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Convert API event dates from strings to Date objects
 * @param {Object} event - Event from API
 * @returns {Object} - Event with Date objects
 */
const normalizeEvent = (event) => {
  return {
    ...event,
    startDate: new Date(event.startDate),
    endDate: event.endDate ? new Date(event.endDate) : null,
    createdAt: new Date(event.createdAt),
    updatedAt: new Date(event.updatedAt),
  };
};

/**
 * Custom hook for managing events via API
 * @returns {Object} - { events, loading, error, addEvent, updateEvent, deleteEvent, getEventById, refetch }
 */
export function useEventsAPI() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all events from API
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      // Convert date strings to Date objects
      const normalizedEvents = data.map(normalizeEvent);
      setEvents(normalizedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * Add a new event
   * @param {Object} eventData
   */
  const addEvent = async (eventData) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const newEvent = await response.json();
      const normalizedEvent = normalizeEvent(newEvent);
      setEvents(prevEvents => [...prevEvents, normalizedEvent]);
      return normalizedEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  };

  /**
   * Update an existing event
   * @param {string} eventId
   * @param {Object} updates
   */
  const updateEvent = async (eventId, updates) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedEvent = await response.json();
      const normalizedEvent = normalizeEvent(updatedEvent);
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? normalizedEvent : event
        )
      );
      return normalizedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  /**
   * Delete an event
   * @param {string} eventId
   */
  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  /**
   * Get event by ID
   * @param {string} eventId
   * @returns {Object|undefined}
   */
  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    refetch: fetchEvents, // Allow manual refetch if needed
  };
}
