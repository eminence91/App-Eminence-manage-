'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tabs?: ModalTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
  saveLoading?: boolean;
  saveDisabled?: boolean;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
  footer,
  onSave,
  saveLabel = 'ENREGISTRER',
  saveLoading = false,
  saveDisabled = false,
  className = '',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={`
          relative z-10 bg-surface flex flex-col
          w-full h-[95vh] rounded-t-2xl
          sm:rounded-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:w-full sm:mx-4
          shadow-modal
          animate-[slideUp_0.3s_ease-out]
          sm:animate-[fadeIn_0.2s_ease-out]
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar tabs */}
          {tabs && tabs.length > 0 && (
            <nav className="hidden sm:flex flex-col w-52 border-r border-border bg-gray-50/50 py-2 flex-shrink-0 overflow-y-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors
                    ${
                      activeTab === tab.id
                        ? 'text-primary-600 bg-primary-50 border-l-3 border-primary-500'
                        : 'text-muted hover:bg-gray-100 border-l-3 border-transparent'
                    }
                  `}
                >
                  {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          {/* Mobile tabs (horizontal) */}
          {tabs && tabs.length > 0 && (
            <div className="sm:hidden flex border-b border-border overflow-x-auto flex-shrink-0 absolute top-[53px] left-0 right-0 bg-surface z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors
                    ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-500'
                        : 'text-muted border-b-2 border-transparent'
                    }
                  `}
                >
                  {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${tabs && tabs.length > 0 ? 'sm:pt-6 pt-14' : ''}`}>
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 sm:px-6 sm:py-4 border-t border-border flex-shrink-0">
          {footer || (
            <>
              <Button variant="ghost" onClick={onClose}>
                Annuler
              </Button>
              {onSave && (
                <Button
                  variant="primary"
                  onClick={onSave}
                  loading={saveLoading}
                  disabled={saveDisabled}
                >
                  {saveLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
