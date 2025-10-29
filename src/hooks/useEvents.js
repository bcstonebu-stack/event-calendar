import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { createEvent, updateEvent as updateEventHelper } from '../utils/eventHelpers';

/**
 * Custom hook for managing events
 * @returns {Object} - { events, addEvent, updateEvent, deleteEvent, getEventById }
 */
export function useEvents() {
  const [events, setEvents] = useLocalStorage(STORAGE_KEYS.EVENTS, []);

  /**
   * Add a new event
   * @param {Object} eventData
   */
  const addEvent = (eventData) => {
    const newEvent = createEvent(eventData);
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  /**
   * Update an existing event
   * @param {string} eventId
   * @param {Object} updates
   */
  const updateEvent = (eventId, updates) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? updateEventHelper(event, updates) : event
      )
    );
  };

  /**
   * Delete an event
   * @param {string} eventId
   */
  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
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
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById
  };
}
