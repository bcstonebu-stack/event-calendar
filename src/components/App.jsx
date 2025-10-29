import React, { useState } from 'react';
import { Header } from './UI/Header';
import { CalendarGrid } from './Calendar/CalendarGrid';
import { EventList } from './Events/EventList';
import { EventModal } from './Events/EventModal';
import { EventDetail } from './Events/EventDetail';
import { useTheme } from '../hooks/useTheme';
import { useEvents } from '../hooks/useEvents';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { VIEW_MODES, STORAGE_KEYS } from '../utils/constants';

function App() {
  const [theme, toggleTheme] = useTheme();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
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

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setEditingEvent(null);
    setNewEventDate(null);
  };

  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    setIsEventDetailOpen(false);
    setSelectedEvent(null);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={currentView}
        onToggleView={handleToggleView}
        onAddEvent={handleAddEvent}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === VIEW_MODES.GRID ? (
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
