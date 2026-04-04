import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'default' | 'primary';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-orange-100 text-orange-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-50 text-primary-700',
};

const dotColors: Record<string, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  purple: 'bg-purple',
  default: 'bg-gray-400',
  primary: 'bg-primary-500',
};

export default function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5'}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`inline-block rounded-full flex-shrink-0 ${dotColors[variant]} ${
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
          }`}
        />
      )}
      {children}
    </span>
  );
}
