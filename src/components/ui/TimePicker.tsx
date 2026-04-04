'use client';

import React, { forwardRef } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  className?: string;
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
        )}
        <div className="relative">
          <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            ref={ref}
            type="time"
            className={`
              w-full pl-10 pr-3 py-2.5 bg-white border rounded-lg text-sm text-foreground
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${error ? 'border-danger' : 'border-border'}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
export default TimePicker;
