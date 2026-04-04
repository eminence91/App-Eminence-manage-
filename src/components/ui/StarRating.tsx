'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
  className?: string;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
  className = '',
}: StarRatingProps) {
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={`
            transition-transform duration-100
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            focus:outline-none
          `}
        >
          <Star
            size={size}
            className={`
              transition-colors duration-150
              ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'}
            `}
          />
        </button>
      ))}
    </div>
  );
}
