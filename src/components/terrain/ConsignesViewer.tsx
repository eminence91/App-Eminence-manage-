'use client';

import { useState } from 'react';
import { Building2, MapPin, FileText, Wrench, ChevronDown, ChevronUp, AlertTriangle, Paperclip, CheckCircle } from 'lucide-react';

interface Instruction {
  id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  attachments?: string[];
  acknowledged?: boolean;
}

interface ConsignesLevel {
  level: 'agence' | 'site' | 'service' | 'prestation';
  label: string;
  icon: React.ReactNode;
  instructions: Instruction[];
}

interface ConsignesViewerProps {
  levels: ConsignesLevel[];
  onAcknowledge?: (instructionId: string) => void;
  className?: string;
}

const defaultLevels: ConsignesLevel[] = [
  {
    level: 'agence', label: 'Consignes générales agence', icon: <Building2 size={18} />,
    instructions: [],
  },
  {
    level: 'site', label: 'Consignes du site', icon: <MapPin size={18} />,
    instructions: [],
  },
  {
    level: 'service', label: 'Consignes du service', icon: <FileText size={18} />,
    instructions: [],
  },
  {
    level: 'prestation', label: 'Consignes de la prestation', icon: <Wrench size={18} />,
    instructions: [],
  },
];

export default function ConsignesViewer({ levels = defaultLevels, onAcknowledge, className = '' }: ConsignesViewerProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    agence: true, site: true, service: true, prestation: true,
  });

  const toggleLevel = (level: string) => {
    setExpanded(prev => ({ ...prev, [level]: !prev[level] }));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {levels.map(level => (
        <div key={level.level} className="bg-surface rounded-card shadow-card overflow-hidden">
          <button
            onClick={() => toggleLevel(level.level)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-primary-500">{level.icon}</div>
              <span className="font-medium text-sm">{level.label}</span>
              {level.instructions.length > 0 && (
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                  {level.instructions.length}
                </span>
              )}
              {level.instructions.some(i => i.isUrgent && !i.acknowledged) && (
                <span className="text-xs bg-danger text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle size={10} /> Urgent
                </span>
              )}
            </div>
            {expanded[level.level] ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
          </button>

          {expanded[level.level] && (
            <div className="px-4 pb-4">
              {level.instructions.length === 0 ? (
                <p className="text-xs text-muted py-2">Aucune consigne</p>
              ) : (
                <div className="space-y-3">
                  {level.instructions.map(instruction => (
                    <div
                      key={instruction.id}
                      className={`p-3 rounded-lg border ${instruction.isUrgent ? 'border-danger bg-red-50' : 'border-border bg-gray-50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-foreground">{instruction.title}</h4>
                        {instruction.acknowledged && (
                          <CheckCircle size={16} className="text-success flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted mt-1">{instruction.content}</p>

                      {instruction.attachments && instruction.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {instruction.attachments.map((att, i) => (
                            <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-border flex items-center gap-1">
                              <Paperclip size={10} /> {att}
                            </span>
                          ))}
                        </div>
                      )}

                      {instruction.isUrgent && !instruction.acknowledged && onAcknowledge && (
                        <button
                          onClick={() => onAcknowledge(instruction.id)}
                          className="mt-3 w-full py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          J&apos;ai lu et compris
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
