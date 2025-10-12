import React from 'react';

/**
 * ProgressBar - Linear progress indicator
 * @param {number} value - 0-100
 * @param {('default'|'success'|'warning'|'error')} variant
 * @param {boolean} showLabel - Show percentage label
 */
export function ProgressBar({ value = 0, variant = 'default', showLabel = false, className = '' }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const variants = {
    default: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        {showLabel && (
          <span className="text-sm font-medium text-text-secondary">
            {clampedValue.toFixed(0)}%
          </span>
        )}
      </div>
      <div className="w-full bg-zinc-100 rounded-full h-8 overflow-hidden">
        <div
          className={`h-full ${variants[variant]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
}

/**
 * DonutProgress - Circular progress indicator (SVG)
 * @param {number} value - 0-100
 * @param {number} size - Diameter in pixels
 * @param {number} strokeWidth - Stroke width
 * @param {('default'|'success'|'warning'|'error')} variant
 */
export function DonutProgress({ value = 0, size = 120, strokeWidth = 8, variant = 'default', className = '' }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const variants = {
    default: '#4f46e5',
    success: '#16a34a',
    warning: '#ea580c',
    error: '#dc2626',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e4e4e7"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={variants[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </svg>
      <span className="absolute text-xl font-bold text-text-primary">
        {clampedValue.toFixed(0)}%
      </span>
    </div>
  );
}

