'use client';

import { useState } from 'react';
import { AlertTriangle, MapPin, Phone, Clock, UserX, Filter, Search, CheckCircle } from 'lucide-react';

type AlertType = 'perimeter_exit' | 'service_not_started' | 'emergency' | 'incident' | 'interruption' | 'early_departure';

interface Alert {
  id: string;
  type: AlertType;
  agent: string;
  site: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

const alertTypeConfig: Record<AlertType, { label: string; icon: React.ReactNode; color: string }> = {
  perimeter_exit: { label: 'Sortie périmètre', icon: <MapPin size={16} />, color: 'bg-danger text-white' },
  service_not_started: { label: 'Service non débuté', icon: <Clock size={16} />, color: 'bg-warning text-white' },
  emergency: { label: 'Urgence', icon: <Phone size={16} />, color: 'bg-danger text-white' },
  incident: { label: 'Incident', icon: <AlertTriangle size={16} />, color: 'bg-danger text-white' },
  interruption: { label: 'Interruption', icon: <UserX size={16} />, color: 'bg-warning text-white' },
  early_departure: { label: 'Départ anticipé', icon: <Clock size={16} />, color: 'bg-orange-500 text-white' },
};

const mockAlerts: Alert[] = [
  { id: '1', type: 'perimeter_exit', agent: 'Ibrahim S.', site: 'Centre Commercial Vélizy', message: 'Distance: 350m du site', timestamp: '03/04/2026 14:32', acknowledged: false },
  { id: '2', type: 'service_not_started', agent: 'Aminata C.', site: 'Résidence Les Jardins', message: 'Retard de 18 minutes', timestamp: '03/04/2026 14:18', acknowledged: false },
  { id: '3', type: 'emergency', agent: 'Fatou D.', site: 'Bureaux Tour Montparnasse', message: 'Appel d\'urgence déclenché', timestamp: '03/04/2026 13:45', acknowledged: true },
  { id: '4', type: 'incident', agent: 'Mohamed K.', site: 'Clinique de Neuilly', message: 'Dégât des eaux signalé — Photo jointe', timestamp: '03/04/2026 11:20', acknowledged: true },
  { id: '5', type: 'interruption', agent: 'Mamadou T.', site: 'Hôpital Saint-Louis', message: 'Service interrompu — Problème matériel', timestamp: '03/04/2026 10:05', acknowledged: true },
  { id: '6', type: 'early_departure', agent: 'Aissatou B.', site: 'Mairie de Boulogne', message: 'Départ 45 minutes avant la fin prévue', timestamp: '02/04/2026 17:15', acknowledged: true },
];

export default function AlertesPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<AlertType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = alerts.filter(a => {
    if (filter !== 'all' && a.type !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return a.agent.toLowerCase().includes(s) || a.site.toLowerCase().includes(s);
    }
    return true;
  });

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Alertes terrain</h1>
        <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full">
          {alerts.filter(a => !a.acknowledged).length} non traitées
        </span>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par agent ou site..." className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded-full border ${filter === 'all' ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted'}`}>Toutes</button>
          {(Object.entries(alertTypeConfig) as [AlertType, typeof alertTypeConfig[AlertType]][]).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1 text-xs rounded-full border ${filter === key ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted'}`}>{cfg.label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(alert => {
          const cfg = alertTypeConfig[alert.type];
          return (
            <div key={alert.id} className={`bg-surface rounded-card shadow-card p-4 ${!alert.acknowledged ? 'border-l-4 border-l-danger' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.agent} — {alert.site}</p>
                    <p className="text-sm text-muted mt-0.5">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
                {!alert.acknowledged ? (
                  <button onClick={() => acknowledge(alert.id)} className="text-xs px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                    Acquitter
                  </button>
                ) : (
                  <span className="text-xs text-success flex items-center gap-1"><CheckCircle size={14} /> Traitée</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
