import React from 'react';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { VIEW_MODES } from '../../utils/constants';

export function Header({ theme, onToggleTheme, currentView, onToggleView, onAddEvent }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-xl p-2.5 shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-all duration-300">
              Event Calendar
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/30 rounded-xl p-1 shadow-inner transition-all duration-300">
              <button
                onClick={() => onToggleView(VIEW_MODES.GRID)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  currentView === VIEW_MODES.GRID
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 text-white scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
                aria-label="Grid view"
              >
                <CalendarIcon className="w-4 h-4 transition-transform duration-300" />
                <span className="text-sm font-medium">Grid</span>
              </button>

              <button
                onClick={() => onToggleView(VIEW_MODES.LIST)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  currentView === VIEW_MODES.LIST
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 text-white scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4 transition-transform duration-300" />
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
