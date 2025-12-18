/**
 * @fileoverview Loading Spinner Component
 * @description Reusable loading spinner component
 * @module components/LoadingSpinner
 */

import React from 'react';

/**
 * LoadingSpinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

