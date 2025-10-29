import React from 'react';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { VIEW_MODES } from '../../utils/constants';

export function Header({ theme, onToggleTheme, currentView, onToggleView, onAddEvent }) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 dark:bg-blue-500 rounded-lg p-2 transition-all duration-200 hover:scale-110">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Event Calendar
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-200">
              <button
                onClick={() => onToggleView(VIEW_MODES.GRID)}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-2 ${
                  currentView === VIEW_MODES.GRID
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100 scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                aria-label="Grid view"
              >
                <CalendarIcon className="w-4 h-4 transition-transform duration-200" />
                <span className="text-sm font-medium">Grid</span>
              </button>

              <button
                onClick={() => onToggleView(VIEW_MODES.LIST)}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-2 ${
                  currentView === VIEW_MODES.LIST
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100 scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4 transition-transform duration-200" />
                <span className="text-sm font-medium">List</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Add Event Button */}
            <Button
              variant="primary"
              onClick={onAddEvent}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Event</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
