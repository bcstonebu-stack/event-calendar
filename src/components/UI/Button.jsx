import React from 'react';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-xl active:scale-95 backdrop-blur-sm';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white focus:ring-purple-500 shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30 hover:shadow-purple-500/50',
    secondary: 'backdrop-blur-md bg-white/60 hover:bg-white/80 dark:bg-gray-800/60 dark:hover:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-gray-500 border border-white/20 dark:border-gray-700/30 shadow-md',
    ghost: 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white focus:ring-red-500 shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
