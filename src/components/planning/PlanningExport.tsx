'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Mail, ChevronDown, Users, Building2, Briefcase } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PlanningExportProps {
  view: string;
  dateRange: { from: string; to: string };
  sites: { id: string; name: string }[];
  collaborators: { id: string; name: string }[];
  onExport?: (type: ExportType) => void;
}

export type ExportType = 'pdf_site' | 'pdf_collaborator' | 'pdf_client' | 'email';

interface ExportOption {
  type: ExportType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PlanningExport({
  view,
  dateRange,
  sites,
  collaborators,
  onExport,
}: PlanningExportProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<ExportType | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const options: ExportOption[] = [
    {
      type: 'pdf_site',
      label: 'PDF par site',
      icon: <Building2 className="w-4 h-4" />,
      description: `${sites.length} site${sites.length > 1 ? 's' : ''}`,
    },
    {
      type: 'pdf_collaborator',
      label: 'PDF par collaborateur',
      icon: <Users className="w-4 h-4" />,
      description: `${collaborators.length} collaborateur${collaborators.length > 1 ? 's' : ''}`,
    },
    {
      type: 'pdf_client',
      label: 'PDF par client',
      icon: <Briefcase className="w-4 h-4" />,
      description: 'Regroupé par client',
    },
    {
      type: 'email',
      label: 'Envoyer par email',
      icon: <Mail className="w-4 h-4" />,
      description: 'Plannings individuels',
    },
  ];

  const handleExport = async (type: ExportType) => {
    setLoading(type);
    try {
      onExport?.(type);
    } finally {
      setTimeout(() => {
        setLoading(null);
        setOpen(false);
      }, 600);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
      >
        <Download className="w-4 h-4" />
        Exporter
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-600">Exporter le planning</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {dateRange.from} — {dateRange.to}
            </p>
          </div>

          {/* Options */}
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleExport(opt.type)}
                disabled={loading !== null}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition text-left disabled:opacity-50"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600">
                  {loading === opt.type ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-500 border-t-transparent" />
                  ) : (
                    opt.icon
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-800">{opt.label}</p>
                  <p className="text-[10px] text-gray-400">{opt.description}</p>
                </div>
                <FileText className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
