import React from 'react';

/**
 * Button - Tombol dengan berbagai variant dan size
 * @param {('primary'|'secondary'|'ghost'|'destructive')} variant
 * @param {('sm'|'md'|'lg')} size
 * @param {boolean} loading - Show spinner
 * @param {boolean} disabled
 * @param {React.ReactNode} children
 * @param {string} className - Additional classes
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-accent text-accent-fg hover:bg-accent-hover active:bg-accent-pressed focus:ring-accent shadow-sm',
    secondary: 'bg-white text-text-primary border border-border hover:bg-zinc-50 active:bg-zinc-100 focus:ring-accent shadow-sm',
    ghost: 'text-text-secondary hover:bg-zinc-100 active:bg-zinc-200 focus:ring-accent',
    destructive: 'bg-destructive text-destructive-fg hover:bg-destructive-hover active:bg-red-800 focus:ring-red-500 shadow-sm',
  };

  const sizes = {
    sm: 'text-sm px-12 py-6 rounded-lg',
    md: 'text-base px-16 py-8 rounded-lg',
    lg: 'text-lg px-24 py-12 rounded-xl',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-4 mr-8 h-16 w-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

