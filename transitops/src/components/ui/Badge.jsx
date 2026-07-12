import React from 'react';

// Reusable atomic status badge component
export const Badge = ({ children, status = 'default', className = '' }) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider';
  
  const statusStyles = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', // Available, Closed, etc.
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',       // On Trip, Dispatched
    warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', // In Shop, Draft, Active
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'            // Suspended, Retired, Cancelled
  };

  return (
    <span className={`${baseStyle} ${statusStyles[status]} ${className}`}>
      {children}
    </span>
  );
};
