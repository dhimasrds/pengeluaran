import React from 'react';

/**
 * Select - Dropdown dengan label, helper, dan error
 * @param {string} label
 * @param {string} helperText
 * @param {string} errorText
 * @param {boolean} required
 * @param {Array<{value: string, label: string}>} options
 */
export function Select({
  label,
  helperText,
  errorText,
  required = false,
  options = [],
  className = '',
  id,
  children,
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!errorText;

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-destructive ml-4">*</span>}
        </label>
      )}
      <select
        id={selectId}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={helperText ? `${selectId}-helper` : errorText ? `${selectId}-error` : undefined}
        className={`
          w-full px-12 py-8 text-base rounded-lg border transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
          disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed
          appearance-none bg-white
          ${hasError
            ? 'border-destructive focus:ring-destructive'
            : 'border-border hover:border-border-dark'
          }
          bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzUyNTI1YiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat pr-32
        `}
        {...props}
      >
        {children || options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {helperText && !hasError && (
        <p id={`${selectId}-helper`} className="text-xs text-text-muted">
          {helperText}
        </p>
      )}
      {errorText && (
        <p id={`${selectId}-error`} className="text-xs text-destructive flex items-center gap-4">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errorText}
        </p>
      )}
    </div>
  );
}

