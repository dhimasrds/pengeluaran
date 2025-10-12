import React from 'react';

/**
 * Badge - Label kecil untuk status/kategori
 * @param {('default'|'success'|'warning'|'error'|'info')} variant
 * @param {React.ReactNode} children
 */
export function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    success: 'bg-success-light text-green-700 border-green-200',
    warning: 'bg-warning-light text-orange-700 border-orange-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-info-light text-sky-700 border-sky-200',
  };

  return (
    <span className={`inline-flex items-center px-8 py-4 text-xs font-medium rounded-md border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

