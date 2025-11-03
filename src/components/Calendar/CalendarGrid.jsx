import React, { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarCell } from './CalendarCell';
import { getCalendarDays } from '../../utils/dateHelpers';
import { getEventsForDay } from '../../utils/eventHelpers';
import { WEEKDAYS } from '../../utils/constants';

export function CalendarGrid({ events, onDayClick, onDayDoubleClick, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const calendarDays = getCalendarDays(currentDate);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (onDayClick) {
      const dayEvents = getEventsForDay(events, day);
      onDayClick(day, dayEvents);
    }
  };

  const handleDayDoubleClick = (day) => {
    if (onDayDoubleClick) {
      onDayDoubleClick(day);
    }
  };

  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <div>
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 p-3 text-center text-sm font-bold text-gray-700 dark:text-gray-300 rounded-xl shadow-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 p-1">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(events, day);
          const isSelected = selectedDay && day.toDateString() === selectedDay.toDateString();

          return (
            <CalendarCell
              key={index}
              day={day}
              currentMonth={currentDate}
              events={dayEvents}
              onDayClick={handleDayClick}
              onDayDoubleClick={handleDayDoubleClick}
              onEventClick={handleEventClick}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
}
