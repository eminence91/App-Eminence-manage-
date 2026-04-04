'use client';

import { useState } from 'react';
import { Key, Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface KeyAccess {
  id: string;
  label: string;
  value: string;
  notes?: string;
}

interface ClesAccesProps {
  keys: KeyAccess[];
  isServiceActive: boolean;
  className?: string;
}

export default function ClesAcces({ keys, isServiceActive, className = '' }: ClesAccesProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (id: string) => {
    if (!isServiceActive) return;
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isServiceActive) {
    return (
      <div className={`bg-surface rounded-card shadow-card p-6 text-center ${className}`}>
        <Lock size={48} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">Clés et codes d&apos;accès</p>
        <p className="text-xs text-muted mt-1">
          Disponible uniquement pendant un service actif
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-card shadow-card ${className}`}>
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Key size={18} className="text-primary-500" />
        <h3 className="font-semibold text-foreground">Clés et codes d&apos;accès</h3>
        <Shield size={14} className="text-success" />
      </div>

      <div className="p-4 space-y-3">
        {keys.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">Aucune clé ou code configuré</p>
        ) : (
          keys.map(key => (
            <div key={key.id} className="p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{key.label}</span>
                <button
                  onClick={() => toggleKey(key.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title={visibleKeys[key.id] ? 'Masquer' : 'Afficher'}
                >
                  {visibleKeys[key.id] ? (
                    <EyeOff size={16} className="text-muted" />
                  ) : (
                    <Eye size={16} className="text-primary-500" />
                  )}
                </button>
              </div>
              <code className="block mt-1 text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                {visibleKeys[key.id] ? key.value : '••••••••'}
              </code>
              {key.notes && (
                <p className="text-xs text-muted mt-1">{key.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
