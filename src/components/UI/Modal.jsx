import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Trigger animation after a brief delay
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphic Backdrop */}
      <div
        className={`fixed inset-0 backdrop-blur-md bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 transition-opacity duration-500 ease-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Glassmorphic Modal */}
      <div
        className={`relative backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto
          transition-all duration-500 ease-out transform
          ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'}
        `}
        style={{
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-900/30 border border-white/30 dark:border-gray-700/30 transition-all duration-300 hover:rotate-90 hover:scale-110 hover:shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
