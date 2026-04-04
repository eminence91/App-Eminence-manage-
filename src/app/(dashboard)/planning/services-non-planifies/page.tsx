'use client';

import { useState } from 'react';
import { AlertTriangle, Search, UserPlus, Calendar, Clock, MapPin } from 'lucide-react';

interface UnplannedService {
  id: string;
  site: string;
  client: string;
  date: string;
  startTime: string;
  endTime: string;
  prestation: string;
  positionsRequired: number;
  positionsFilled: number;
}

const mockServices: UnplannedService[] = [
  { id: '1', site: 'Résidence Les Jardins', client: 'Nexity Résidences', date: '04/04/2026', startTime: '08:00', endTime: '16:00', prestation: 'Nettoyage parties communes', positionsRequired: 2, positionsFilled: 0 },
  { id: '2', site: 'Bureaux Défense', client: 'SCI La Défense', date: '05/04/2026', startTime: '06:00', endTime: '14:00', prestation: 'Remise en état', positionsRequired: 3, positionsFilled: 1 },
  { id: '3', site: 'Centre Commercial Vélizy', client: 'Unibail-Rodamco', date: '05/04/2026', startTime: '20:00', endTime: '04:00', prestation: 'Nettoyage nocturne', positionsRequired: 2, positionsFilled: 1 },
  { id: '4', site: 'Mairie de Boulogne', client: 'Mairie de Boulogne', date: '07/04/2026', startTime: '07:00', endTime: '12:00', prestation: 'Entretien bureaux', positionsRequired: 1, positionsFilled: 0 },
];

export default function ServicesNonPlanifiesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockServices.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.site.toLowerCase().includes(q) || s.client.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">Services non planifiés</h1>
          <span className="bg-warning text-white text-xs px-2 py-0.5 rounded-full">{mockServices.length}</span>
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par site ou client..." className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(service => (
          <div key={service.id} className="bg-surface rounded-card shadow-card p-4 border-l-4 border-l-warning">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{service.site}</h3>
                  <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full">
                    {service.positionsFilled}/{service.positionsRequired} postes
                  </span>
                </div>
                <p className="text-sm text-muted">{service.client}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {service.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {service.startTime} — {service.endTime}</span>
                </div>
                <p className="text-xs text-muted mt-1">{service.prestation}</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
                <UserPlus size={16} /> Affecter
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-surface rounded-card shadow-card p-8 text-center">
            <AlertTriangle size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-muted">Aucun service non planifié</p>
          </div>
        )}
      </div>
    </div>
  );
}
