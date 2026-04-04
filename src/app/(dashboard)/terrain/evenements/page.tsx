'use client';

import { useState } from 'react';
import {
  Clock, MapPin, Camera, Phone, AlertTriangle, Play, Square,
  Pause, RotateCcw, ArrowUpRight, Search, Filter, Download,
  ChevronDown, Calendar
} from 'lucide-react';

interface MCEEvent {
  id: string;
  type: string;
  agent: string;
  site: string;
  timestamp: string;
  description: string;
  lat?: number;
  lng?: number;
  photo?: boolean;
}

const eventIcons: Record<string, React.ReactNode> = {
  prise_service: <Play size={14} />,
  fin_service: <Square size={14} />,
  retard: <Clock size={14} />,
  interruption: <AlertTriangle size={14} />,
  reprise: <RotateCcw size={14} />,
  prolongation: <ArrowUpRight size={14} />,
  pause_debut: <Pause size={14} />,
  pause_fin: <Play size={14} />,
  appel_urgence: <Phone size={14} />,
  sortie_perimetre: <MapPin size={14} />,
  retour_perimetre: <MapPin size={14} />,
  incident: <AlertTriangle size={14} />,
  photo: <Camera size={14} />,
};

const eventColors: Record<string, string> = {
  prise_service: 'bg-success text-white',
  fin_service: 'bg-gray-500 text-white',
  retard: 'bg-warning text-white',
  interruption: 'bg-danger text-white',
  reprise: 'bg-info text-white',
  prolongation: 'bg-primary-500 text-white',
  pause_debut: 'bg-yellow-500 text-white',
  pause_fin: 'bg-yellow-600 text-white',
  appel_urgence: 'bg-danger text-white',
  sortie_perimetre: 'bg-danger text-white',
  retour_perimetre: 'bg-success text-white',
  incident: 'bg-danger text-white',
  photo: 'bg-primary-400 text-white',
};

const eventLabels: Record<string, string> = {
  prise_service: 'Prise de service',
  fin_service: 'Fin de service',
  retard: 'Retard',
  interruption: 'Interruption',
  reprise: 'Reprise',
  prolongation: 'Prolongation',
  pause_debut: 'Début de pause',
  pause_fin: 'Fin de pause',
  appel_urgence: 'Appel d\'urgence',
  sortie_perimetre: 'Sortie de périmètre',
  retour_perimetre: 'Retour dans périmètre',
  incident: 'Incident',
  photo: 'Photo',
};

const mockEvents: MCEEvent[] = [
  { id: '1', type: 'prise_service', agent: 'Mohamed K.', site: 'Clinique de Neuilly', timestamp: '03/04/2026 08:02', description: 'Prise de service — dans le périmètre', photo: true },
  { id: '2', type: 'photo', agent: 'Mohamed K.', site: 'Clinique de Neuilly', timestamp: '03/04/2026 08:03', description: 'Photo de tenue de travail', photo: true },
  { id: '3', type: 'retard', agent: 'Aminata C.', site: 'Résidence Les Jardins', timestamp: '03/04/2026 08:15', description: 'Retard de 15 minutes sur la prise de service prévue à 08:00' },
  { id: '4', type: 'pause_debut', agent: 'Mohamed K.', site: 'Clinique de Neuilly', timestamp: '03/04/2026 12:00', description: 'Début de pause déjeuner' },
  { id: '5', type: 'pause_fin', agent: 'Mohamed K.', site: 'Clinique de Neuilly', timestamp: '03/04/2026 12:30', description: 'Fin de pause — durée: 30 min' },
  { id: '6', type: 'sortie_perimetre', agent: 'Ibrahim S.', site: 'Centre Commercial Vélizy', timestamp: '03/04/2026 14:32', description: 'Sortie du périmètre — distance: 350m', lat: 48.779, lng: 2.199 },
  { id: '7', type: 'incident', agent: 'Fatou D.', site: 'Tour Montparnasse', timestamp: '03/04/2026 15:10', description: 'Dégât des eaux signalé au 3ème étage', photo: true },
  { id: '8', type: 'fin_service', agent: 'Fatou D.', site: 'Tour Montparnasse', timestamp: '03/04/2026 16:00', description: 'Fin de service — durée réalisée: 8h00' },
];

export default function EvenementsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockEvents.filter(e => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return e.agent.toLowerCase().includes(s) || e.site.toLowerCase().includes(s) || e.description.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Main courante électronique</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
            <Download size={16} /> Exporter PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par agent, site..." className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-2 border border-border rounded-lg text-sm">
              <Calendar size={16} className="text-muted" />
              <span className="text-muted">03/04/2026</span>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50">
              <Filter size={16} /> <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
            <button onClick={() => setTypeFilter('all')} className={`px-3 py-1 text-xs rounded-full border ${typeFilter === 'all' ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted'}`}>Tous</button>
            {Object.entries(eventLabels).map(([key, label]) => (
              <button key={key} onClick={() => setTypeFilter(key)} className={`px-3 py-1 text-xs rounded-full border ${typeFilter === key ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted'}`}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-200" />
          <div className="space-y-4">
            {filtered.map(event => (
              <div key={event.id} className="relative flex items-start gap-4 pl-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${eventColors[event.type] || 'bg-gray-400 text-white'}`}>
                  {eventIcons[event.type] || <Clock size={14} />}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${eventColors[event.type]}`}>
                          {eventLabels[event.type]}
                        </span>
                        <span className="text-xs font-medium text-foreground">{event.agent}</span>
                      </div>
                      <p className="text-sm text-muted mt-1">{event.description}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {event.site}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-foreground">{event.timestamp}</p>
                      {event.photo && (
                        <span className="text-xs text-primary-500 flex items-center gap-1 mt-1 justify-end">
                          <Camera size={12} /> Photo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
