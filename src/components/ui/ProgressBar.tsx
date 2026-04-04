import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

function getColor(value: number): string {
  if (value >= 75) return 'bg-success';
  if (value >= 40) return 'bg-warning';
  return 'bg-danger';
}

export default function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor(clamped)}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-muted w-10 text-right flex-shrink-0">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
