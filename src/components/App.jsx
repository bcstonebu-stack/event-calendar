import React, { useState } from 'react';
import { Header } from './UI/Header';
import { CalendarGrid } from './Calendar/CalendarGrid';
import { EventList } from './Events/EventList';
import { EventModal } from './Events/EventModal';
import { EventDetail } from './Events/EventDetail';
import { useTheme } from '../hooks/useTheme';
import { useEventsAPI } from '../hooks/useEventsAPI';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { VIEW_MODES, STORAGE_KEYS } from '../utils/constants';

function App() {
  const [theme, toggleTheme] = useTheme();
  const { events, loading, error, addEvent, updateEvent, deleteEvent } = useEventsAPI();

  const [currentView, setCurrentView] = useLocalStorage(STORAGE_KEYS.DEFAULT_VIEW, VIEW_MODES.GRID);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEventDate, setNewEventDate] = useState(null);

  const handleAddEvent = (date = null) => {
    setEditingEvent(null);
    setNewEventDate(date);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEventDate(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await addEvent(eventData);
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setNewEventDate(null);
    } catch (err) {
      console.error('Failed to save event:', err);
      // Error handling could be improved with a toast notification
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setIsEventDetailOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Failed to delete event:', err);
      // Error handling could be improved with a toast notification
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const handleDayClick = (day, dayEvents) => {
    // Could implement day detail view here if needed
  };

  const handleDayDoubleClick = (day) => {
    // Open event modal with the selected date pre-filled
    handleAddEvent(day);
  };

  const handleGridEventClick = (event) => {
    // When clicking an event in grid view, open edit modal directly
    handleEditEvent(event);
  };

  const handleToggleView = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 transition-all duration-500">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={currentView}
        onToggleView={handleToggleView}
        onAddEvent={handleAddEvent}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600 dark:text-gray-400">Loading events...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-600 dark:text-red-400">
              Error loading events: {error}
            </div>
          </div>
        ) : currentView === VIEW_MODES.GRID ? (
          <CalendarGrid
            events={events}
            onDayClick={handleDayClick}
            onDayDoubleClick={handleDayDoubleClick}
            onEventClick={handleGridEventClick}
          />
        ) : (
          <EventList
            events={events}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onEventClick={handleEventClick}
          />
        )}
      </main>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
          setNewEventDate(null);
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
        prefilledDate={newEventDate}
      />

      {/* Event Detail Modal */}
      <EventDetail
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={() => {
          setIsEventDetailOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}

export default App;
