import React from 'react';
import { Calendar, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { getEventDuration } from '../../utils/eventHelpers';

export function EventCard({ event, onEdit, onDelete, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4
                 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer
                 hover:-translate-y-1"
      style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
            {event.title}
          </h3>

          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 transition-colors duration-200">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.startDate)}</span>
            </div>

            <div className="flex items-center gap-2 transition-colors duration-200">
              <Clock className="w-4 h-4" />
              <span>{getEventDuration(event)}</span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2 transition-colors duration-200">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 transition-colors duration-200">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Edit event"
          >
            <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Delete event"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
