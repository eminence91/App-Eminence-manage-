'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Plus, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  creatable?: boolean;
  onCreateNew?: () => void;
  createLabel?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  searchable = false,
  clearable = false,
  creatable = false,
  onCreateNew,
  createLabel = 'Créer nouveau',
  error,
  disabled = false,
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full flex items-center justify-between bg-white border rounded-lg px-3 py-2.5 text-sm
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? 'border-danger' : 'border-border'}
          ${open ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}
        `}
      >
        <span className={`flex items-center gap-2 truncate ${selected ? 'text-foreground' : 'text-gray-400'}`}>
          {selected?.icon}
          {selected?.label || placeholder}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0 ml-2">
          {clearable && value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 rounded hover:bg-gray-100 text-muted"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-border rounded-lg shadow-lg overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted text-center">Aucun résultat</div>
            )}
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch('');
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                  ${option.value === value ? 'bg-primary-50 text-primary-700' : 'text-foreground hover:bg-gray-50'}
                `}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>

          {creatable && (
            <button
              type="button"
              onClick={() => {
                onCreateNew?.();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-primary-600 font-medium border-t border-border hover:bg-primary-50 transition-colors"
            >
              <Plus size={16} />
              {createLabel}
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
