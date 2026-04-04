'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

export default function FloatingActionButton({
  onClick,
  icon,
  label,
  className = '',
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label || 'Ajouter'}
      className={`
        sm:hidden fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full bg-success text-white
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-success/30
        ${className}
      `}
    >
      {icon || <Plus size={28} />}
    </button>
  );
}
