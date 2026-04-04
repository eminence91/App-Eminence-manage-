'use client';

import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: 'text' | 'email' | 'tel' | 'number' | 'password';
  multiline?: boolean;
  rows?: number;
  className?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      variant = 'text',
      multiline = false,
      rows = 3,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const baseClasses = `
      w-full bg-white border rounded-lg text-sm text-foreground placeholder:text-gray-400
      transition-colors duration-150
      focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
      disabled:bg-gray-50 disabled:text-muted disabled:cursor-not-allowed
      ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border'}
      ${iconLeft ? 'pl-10' : 'pl-3'}
      ${iconRight ? 'pr-10' : 'pr-3'}
      py-2.5
    `;

    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {iconLeft}
            </span>
          )}
          {multiline ? (
            <textarea
              id={inputId}
              rows={rows}
              className={`${baseClasses} resize-none ${className}`}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              ref={ref as React.Ref<HTMLTextAreaElement>}
            />
          ) : (
            <input
              id={inputId}
              type={variant}
              className={`${baseClasses} ${className}`}
              ref={ref}
              {...props}
            />
          )}
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
