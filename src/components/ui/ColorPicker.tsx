'use client';

import React from 'react';
import { Check } from 'lucide-react';

const DEFAULT_COLORS = [
  '#009688', '#4caf50', '#8bc34a', '#cddc39',
  '#ff9800', '#ff5722', '#f44336', '#e91e63',
  '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
  '#03a9f4', '#00bcd4', '#607d8b', '#795548',
];

interface ColorPickerProps {
  label?: string;
  value?: string;
  onChange: (color: string) => void;
  colors?: string[];
  className?: string;
}

export default function ColorPicker({
  label,
  value,
  onChange,
  colors = DEFAULT_COLORS,
  className = '',
}: ColorPickerProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      )}
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-transform
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              ${value === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}
            `}
            style={{ backgroundColor: color }}
            title={color}
          >
            {value === color && <Check size={14} className="text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}
