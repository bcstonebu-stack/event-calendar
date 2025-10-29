import React from 'react';
import { EventCard } from './EventCard';
import { groupEventsByTime, sortEventsByDate } from '../../utils/dateHelpers';
import { Calendar } from 'lucide-react';

export function EventList({ events, onEditEvent, onDeleteEvent, onEventClick }) {
  const sortedEvents = sortEventsByDate(events);
  const groupedEvents = groupEventsByTime(sortedEvents);

  const renderEventGroup = (title, events) => {
    if (events.length === 0) return null;

    return (
      <div key={title} className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          {title}
        </h3>
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              onClick={() => onEventClick && onEventClick(event)}
            />
          ))}
        </div>
      </div>
    );
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
          <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No events yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">
          Get started by creating your first event. Click the "Add Event" button to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderEventGroup('Today', groupedEvents.today)}
      {renderEventGroup('Tomorrow', groupedEvents.tomorrow)}
      {renderEventGroup('This Week', groupedEvents.thisWeek)}
      {renderEventGroup('Upcoming', groupedEvents.later)}
      {groupedEvents.past.length > 0 && renderEventGroup('Past Events', groupedEvents.past)}
    </div>
  );
}
