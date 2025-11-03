import React from 'react';
import { isTodayDate, isCurrentMonth } from '../../utils/dateHelpers';

export function CalendarCell({ day, currentMonth, events, onDayClick, onDayDoubleClick, onEventClick, isSelected }) {
  const isToday = isTodayDate(day);
  const isThisMonth = isCurrentMonth(day, currentMonth);
  const dayNumber = day.getDate();

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <div
      onClick={() => onDayClick && onDayClick(day)}
      onDoubleClick={() => onDayDoubleClick && onDayDoubleClick(day)}
      className={`
        min-h-[100px] p-3 cursor-pointer rounded-xl
        backdrop-blur-md transition-all duration-300 ease-out
        ${!isThisMonth
          ? 'bg-white/30 dark:bg-gray-900/30 border border-white/10 dark:border-gray-800/30'
          : 'bg-white/60 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-purple-500/10'
        }
        ${isSelected ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20' : 'shadow-md'}
      `}
    >
      <div
        className={`
          text-sm font-bold mb-2 w-8 h-8 flex items-center justify-center rounded-lg
          transition-all duration-300 ease-out
          ${isToday ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/40 scale-110' : ''}
          ${!isToday && !isThisMonth ? 'text-gray-400 dark:text-gray-600' : ''}
          ${!isToday && isThisMonth ? 'text-gray-900 dark:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50' : ''}
        `}
      >
        {dayNumber}
      </div>

      <div className="space-y-1.5">
        {events.slice(0, 3).map((event, index) => (
          <div
            key={event.id}
            onClick={(e) => handleEventClick(e, event)}
            className="text-xs px-2 py-1 rounded-lg truncate hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer backdrop-blur-sm font-medium"
            style={{
              backgroundColor: `${event.color}30`,
              color: event.color,
              borderLeft: `3px solid ${event.color}`,
              boxShadow: `0 2px 8px ${event.color}20`,
              animationDelay: `${index * 50}ms`
            }}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}
