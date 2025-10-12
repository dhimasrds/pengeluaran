import React from 'react';

/**
 * Card - Container komponen dengan header/content/footer opsional
 * @param {string} className - Additional classes
 * @param {React.ReactNode} header - Header content
 * @param {React.ReactNode} children - Main content
 * @param {React.ReactNode} footer - Footer content
 */
export function Card({ className = '', header, children, footer }) {
  return (
    <div className={`bg-surface rounded-xl border border-border shadow-sm ${className}`}>
      {header && (
        <div className="px-16 py-12 border-b border-border">
          {header}
        </div>
      )}
      <div className="px-16 py-16">
        {children}
      </div>
      {footer && (
        <div className="px-16 py-12 border-t border-border bg-zinc-50">
          {footer}
        </div>
      )}
    </div>
  );
}

