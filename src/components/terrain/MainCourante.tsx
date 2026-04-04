'use client';

import { useState } from 'react';
import {
  Play, Square, Pause, RotateCcw, ArrowUpRight, Phone, MapPin,
  Camera, AlertTriangle, Clock, Package, ChevronDown, ChevronUp
} from 'lucide-react';

export type MCEEventType =
  | 'prise_service' | 'fin_service' | 'retard' | 'interruption'
  | 'reprise' | 'prolongation' | 'pause_debut' | 'pause_fin'
  | 'appel_urgence' | 'sortie_perimetre' | 'retour_perimetre'
  | 'incident' | 'controle_stock' | 'photo';

interface MCEEntry {
  id: string;
  type: MCEEventType;
  timestamp: Date;
  description: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
}

interface MainCouranteProps {
  entries: MCEEntry[];
  className?: string;
}

const eventConfig: Record<MCEEventType, { label: string; icon: React.ReactNode; color: string }> = {
  prise_service: { label: 'Prise de service', icon: <Play size={12} />, color: 'bg-success text-white' },
  fin_service: { label: 'Fin de service', icon: <Square size={12} />, color: 'bg-gray-500 text-white' },
  retard: { label: 'Retard', icon: <Clock size={12} />, color: 'bg-warning text-white' },
  interruption: { label: 'Interruption', icon: <AlertTriangle size={12} />, color: 'bg-danger text-white' },
  reprise: { label: 'Reprise', icon: <RotateCcw size={12} />, color: 'bg-info text-white' },
  prolongation: { label: 'Prolongation', icon: <ArrowUpRight size={12} />, color: 'bg-primary-500 text-white' },
  pause_debut: { label: 'Début de pause', icon: <Pause size={12} />, color: 'bg-yellow-500 text-white' },
  pause_fin: { label: 'Fin de pause', icon: <Play size={12} />, color: 'bg-yellow-600 text-white' },
  appel_urgence: { label: 'Appel d\'urgence', icon: <Phone size={12} />, color: 'bg-danger text-white' },
  sortie_perimetre: { label: 'Sortie périmètre', icon: <MapPin size={12} />, color: 'bg-danger text-white' },
  retour_perimetre: { label: 'Retour périmètre', icon: <MapPin size={12} />, color: 'bg-success text-white' },
  incident: { label: 'Incident', icon: <AlertTriangle size={12} />, color: 'bg-danger text-white' },
  controle_stock: { label: 'Contrôle stock', icon: <Package size={12} />, color: 'bg-primary-400 text-white' },
  photo: { label: 'Photo', icon: <Camera size={12} />, color: 'bg-primary-400 text-white' },
};

export default function MainCourante({ entries, className = '' }: MainCouranteProps) {
  const [expanded, setExpanded] = useState(true);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`bg-surface rounded-card shadow-card ${className}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 border-b border-border"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock size={18} className="text-primary-500" />
          Main courante
          <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
            {entries.length}
          </span>
        </h3>
        {expanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
      </button>

      {expanded && (
        <div className="p-4">
          {entries.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">Aucun événement enregistré</p>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200" />
              <div className="space-y-3">
                {entries.map((entry) => {
                  const cfg = eventConfig[entry.type];
                  return (
                    <div key={entry.id} className="relative flex items-start gap-3 pl-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs text-muted font-medium">
                            {formatTime(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted mt-0.5">{entry.description}</p>
                        {entry.latitude && (
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin size={10} />
                            {entry.latitude.toFixed(4)}, {entry.longitude?.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
