import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from '../../utils/constants';
import { Button } from '../UI/Button';

export function CalendarHeader({ currentDate, onPreviousMonth, onNextMonth, onToday }) {
  const month = MONTH_NAMES[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-6 p-4 backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-purple-500/5">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
        {month} {year}
      </h2>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="hidden sm:inline-flex backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30"
        >
          Today
        </Button>

        <div className="flex items-center gap-1 backdrop-blur-md bg-white/40 dark:bg-gray-800/40 p-1 rounded-xl border border-white/20 dark:border-gray-700/30">
          <button
            onClick={onPreviousMonth}
            className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 hover:scale-110"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={onNextMonth}
            className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 hover:scale-110"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
