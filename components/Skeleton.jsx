import React from 'react';

/**
 * Skeleton - Loading placeholder
 * @param {('text'|'circle'|'rect')} variant
 * @param {string} className
 */
export function Skeleton({ variant = 'text', className = '' }) {
  const variants = {
    text: 'h-12 w-full rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return (
    <div className={`animate-pulse bg-zinc-200 ${variants[variant]} ${className}`} />
  );
}

