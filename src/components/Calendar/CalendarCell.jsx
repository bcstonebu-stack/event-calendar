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
        min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer
        transition-all duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-800
        ${!isThisMonth ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      <div
        className={`
          text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full
          transition-all duration-200 ease-out
          ${isToday ? 'bg-blue-600 text-white shadow-md' : ''}
          ${!isToday && !isThisMonth ? 'text-gray-400 dark:text-gray-600' : ''}
          ${!isToday && isThisMonth ? 'text-gray-900 dark:text-gray-100' : ''}
        `}
      >
        {dayNumber}
      </div>

      <div className="space-y-1">
        {events.slice(0, 3).map((event, index) => (
          <div
            key={event.id}
            onClick={(e) => handleEventClick(e, event)}
            className="text-xs px-1.5 py-0.5 rounded truncate hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: `${event.color}20`,
              color: event.color,
              borderLeft: `3px solid ${event.color}`,
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
