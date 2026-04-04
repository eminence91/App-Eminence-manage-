'use client';

import { useState } from 'react';
import {
  MapPin, Users, AlertTriangle, Phone, Clock,
  Filter, ChevronRight, Eye, Radio
} from 'lucide-react';

interface AgentOnMap {
  id: string;
  name: string;
  site: string;
  lat: number;
  lng: number;
  status: 'on_site' | 'out_of_perimeter' | 'late' | 'emergency';
  lastUpdate: string;
  currentActivity: string;
}

const mockAgents: AgentOnMap[] = [
  { id: '1', name: 'Mohamed K.', site: 'Clinique de Neuilly', lat: 48.884, lng: 2.269, status: 'on_site', lastUpdate: 'Il y a 2 min', currentActivity: 'Service en cours' },
  { id: '2', name: 'Fatou D.', site: 'Bureaux Tour Montparnasse', lat: 48.842, lng: 2.321, status: 'on_site', lastUpdate: 'Il y a 5 min', currentActivity: 'Service en cours' },
  { id: '3', name: 'Ibrahim S.', site: 'Centre Commercial Vélizy', lat: 48.779, lng: 2.199, status: 'out_of_perimeter', lastUpdate: 'Il y a 1 min', currentActivity: 'Sortie de périmètre détectée' },
  { id: '4', name: 'Aminata C.', site: 'Résidence Les Jardins', lat: 48.856, lng: 2.352, status: 'late', lastUpdate: 'Il y a 18 min', currentActivity: 'Service non débuté (retard 18min)' },
  { id: '5', name: 'Mamadou T.', site: 'Hôpital Saint-Louis', lat: 48.873, lng: 2.369, status: 'on_site', lastUpdate: 'Il y a 3 min', currentActivity: 'Pause en cours' },
];

const statusConfig = {
  on_site: { label: 'En poste', color: 'bg-success', textColor: 'text-success', dot: 'bg-success' },
  out_of_perimeter: { label: 'Hors périmètre', color: 'bg-danger', textColor: 'text-danger', dot: 'bg-danger' },
  late: { label: 'En retard', color: 'bg-warning', textColor: 'text-warning', dot: 'bg-warning' },
  emergency: { label: 'Urgence', color: 'bg-danger', textColor: 'text-danger', dot: 'bg-danger animate-pulse' },
};

interface AlertItem {
  id: string;
  type: 'perimeter' | 'late' | 'emergency' | 'interruption';
  agent: string;
  site: string;
  message: string;
  time: string;
}

const mockAlerts: AlertItem[] = [
  { id: '1', type: 'perimeter', agent: 'Ibrahim S.', site: 'Centre Commercial Vélizy', message: 'Sortie de périmètre détectée (350m)', time: 'Il y a 1 min' },
  { id: '2', type: 'late', agent: 'Aminata C.', site: 'Résidence Les Jardins', message: 'Service non débuté — retard 18 minutes', time: 'Il y a 18 min' },
  { id: '3', type: 'emergency', agent: 'Fatou D.', site: 'Tour Montparnasse', message: 'Appel d\'urgence déclenché', time: 'Il y a 30 min' },
];

export default function SupervisionPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [siteFilter, setSiteFilter] = useState<string>('all');

  const filteredAgents = mockAgents.filter(a =>
    siteFilter === 'all' || a.site === siteFilter
  );

  const sites = Array.from(new Set(mockAgents.map(a => a.site)));
  const onSiteCount = mockAgents.filter(a => a.status === 'on_site').length;
  const alertCount = mockAgents.filter(a => a.status !== 'on_site').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Radio size={20} className="text-primary-500" />
            Supervision temps réel
          </h1>
          <p className="text-sm text-muted">
            {onSiteCount} agents en poste · {alertCount} alertes actives
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          >
            <option value="all">Tous les sites</option>
            {sites.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map area */}
        <div className="lg:col-span-2 bg-surface rounded-card shadow-card overflow-hidden">
          <div className="h-[500px] lg:h-[600px] bg-gray-100 relative flex items-center justify-center">
            {/* Placeholder for Google Maps */}
            <div className="text-center">
              <MapPin size={64} className="text-gray-300 mx-auto mb-3" />
              <p className="text-muted text-sm">Carte Google Maps</p>
              <p className="text-xs text-gray-400 mt-1">Configurez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
            </div>

            {/* Agent markers simulation */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
              <p className="text-xs font-medium text-foreground mb-2">Agents en service</p>
              <div className="space-y-2">
                {filteredAgents.map(agent => {
                  const cfg = statusConfig[agent.status];
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`flex items-center gap-2 text-xs w-full text-left px-2 py-1 rounded hover:bg-gray-50 ${selectedAgent === agent.id ? 'bg-primary-50' : ''}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                      <span className="font-medium">{agent.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected agent info */}
            {selectedAgent && (() => {
              const agent = mockAgents.find(a => a.id === selectedAgent);
              if (!agent) return null;
              const cfg = statusConfig[agent.status];
              return (
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{agent.name}</p>
                      <p className="text-sm text-muted">{agent.site}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 text-white ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-right text-xs text-muted">
                      <p>Dernière position : {agent.lastUpdate}</p>
                      <p className="mt-1">{agent.currentActivity}</p>
                    </div>
                  </div>
                  <button className="mt-3 text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1">
                    <Eye size={14} /> Voir la main courante <ChevronRight size={14} />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right panel - Alerts */}
        <div className="bg-surface rounded-card shadow-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle size={18} className="text-danger" />
              Alertes en temps réel
              <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full">{mockAlerts.length}</span>
            </h2>
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {mockAlerts.map(alert => (
              <div key={alert.id} className="border-l-4 border-l-danger bg-red-50 p-3 rounded-r-lg">
                <div className="flex items-center gap-2 mb-1">
                  {alert.type === 'perimeter' && <MapPin size={14} className="text-danger" />}
                  {alert.type === 'late' && <Clock size={14} className="text-warning" />}
                  {alert.type === 'emergency' && <Phone size={14} className="text-danger" />}
                  <span className="text-xs font-semibold text-foreground">{alert.agent}</span>
                  <span className="text-xs text-muted">— {alert.site}</span>
                </div>
                <p className="text-xs text-muted">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-success">{onSiteCount}</p>
                <p className="text-xs text-muted">En poste</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <p className="text-lg font-bold text-danger">{alertCount}</p>
                <p className="text-xs text-muted">Alertes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
