import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { THEMES } from '../../utils/constants';

export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95 relative overflow-hidden"
      aria-label={`Switch to ${theme === THEMES.LIGHT ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        {theme === THEMES.LIGHT ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 hover:rotate-12" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 hover:rotate-180" />
        )}
      </div>
    </button>
  );
}
