import React from 'react';
import { Calendar, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { getEventDuration } from '../../utils/eventHelpers';

export function EventCard({ event, onEdit, onDelete, onClick }) {
  return (
    <div
      onClick={onClick}
      className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-white/20 dark:border-gray-700/30 p-5
                 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.03] transition-all duration-300 ease-out cursor-pointer
                 hover:-translate-y-2 shadow-lg"
      style={{
        borderLeftWidth: '5px',
        borderLeftColor: event.color,
        boxShadow: `0 8px 32px ${event.color}10`
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
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
            className="p-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-white/30 dark:border-gray-600/30 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md"
            aria-label="Edit event"
          >
            <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            className="p-2 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-red-900/30 border border-white/30 dark:border-gray-600/30 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md"
            aria-label="Delete event"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
