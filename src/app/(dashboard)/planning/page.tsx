'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Calendar, Users, Plus,
  MapPin, Clock, Eye, Info
} from 'lucide-react';

type ViewMode = 'jour' | 'semaine' | 'mois' | '4semaines';

interface ServiceBlock {
  id: string;
  startTime: string;
  endTime: string;
  agents: string[];
  isDraft: boolean;
  color: string;
}

interface Site {
  id: string;
  name: string;
  color: string;
  address: string;
}

const SITES: Site[] = [
  { id: 's1', name: 'Tour Montparnasse', color: '#009688', address: '33 Avenue du Maine, Paris' },
  { id: 's2', name: 'Clinique Saint-Louis', color: '#2196f3', address: '12 Rue de la Santé, Lyon' },
  { id: 's3', name: 'Centre Commercial Vélizy', color: '#ff9800', address: '2 Avenue de l\'Europe, Vélizy' },
  { id: 's4', name: 'Immeuble Haussmann', color: '#9c27b0', address: '45 Bd Haussmann, Paris' },
  { id: 's5', name: 'Lycée Victor Hugo', color: '#f44336', address: '27 Rue de Sévigné, Paris' },
];

const DAYS = ['Lun 31', 'Mar 01', 'Mer 02', 'Jeu 03', 'Ven 04', 'Sam 05', 'Dim 06'];
const DAYS_FULL = ['Lundi 31 mars', 'Mardi 1 avril', 'Mercredi 2 avril', 'Jeudi 3 avril', 'Vendredi 4 avril', 'Samedi 5 avril', 'Dimanche 6 avril'];

const MOCK_SERVICES: Record<string, Record<string, ServiceBlock[]>> = {
  s1: {
    'Lun 31': [{ id: 'srv1', startTime: '08:00', endTime: '16:00', agents: ['M. Dupont', 'A. Martin'], isDraft: false, color: '#009688' }],
    'Mar 01': [{ id: 'srv2', startTime: '08:00', endTime: '16:00', agents: ['M. Dupont'], isDraft: false, color: '#009688' }],
    'Mer 02': [{ id: 'srv3', startTime: '08:00', endTime: '12:00', agents: ['A. Martin'], isDraft: true, color: '#009688' }],
    'Jeu 03': [{ id: 'srv4', startTime: '08:00', endTime: '16:00', agents: ['M. Dupont', 'A. Martin'], isDraft: false, color: '#009688' }],
    'Ven 04': [{ id: 'srv5', startTime: '08:00', endTime: '16:00', agents: ['M. Dupont'], isDraft: false, color: '#009688' }],
  },
  s2: {
    'Lun 31': [{ id: 'srv6', startTime: '06:00', endTime: '14:00', agents: ['S. Bernard'], isDraft: false, color: '#2196f3' }],
    'Mar 01': [{ id: 'srv7', startTime: '06:00', endTime: '14:00', agents: ['S. Bernard'], isDraft: false, color: '#2196f3' }],
    'Mer 02': [{ id: 'srv8', startTime: '06:00', endTime: '14:00', agents: ['S. Bernard'], isDraft: true, color: '#2196f3' }],
    'Jeu 03': [{ id: 'srv9', startTime: '06:00', endTime: '14:00', agents: ['S. Bernard'], isDraft: false, color: '#2196f3' }],
    'Ven 04': [{ id: 'srv10', startTime: '06:00', endTime: '14:00', agents: ['S. Bernard'], isDraft: false, color: '#2196f3' }],
    'Sam 05': [{ id: 'srv11', startTime: '08:00', endTime: '12:00', agents: ['L. Moreau'], isDraft: true, color: '#2196f3' }],
  },
  s3: {
    'Lun 31': [{ id: 'srv12', startTime: '18:00', endTime: '22:00', agents: ['P. Lefebvre', 'L. Moreau'], isDraft: false, color: '#ff9800' }],
    'Mer 02': [{ id: 'srv13', startTime: '18:00', endTime: '22:00', agents: ['P. Lefebvre'], isDraft: false, color: '#ff9800' }],
    'Ven 04': [{ id: 'srv14', startTime: '18:00', endTime: '22:00', agents: ['P. Lefebvre', 'L. Moreau'], isDraft: false, color: '#ff9800' }],
  },
  s4: {
    'Mar 01': [{ id: 'srv15', startTime: '09:00', endTime: '17:00', agents: ['C. Petit'], isDraft: false, color: '#9c27b0' }],
    'Jeu 03': [{ id: 'srv16', startTime: '09:00', endTime: '17:00', agents: ['C. Petit'], isDraft: false, color: '#9c27b0' }],
    'Sam 05': [{ id: 'srv17', startTime: '09:00', endTime: '13:00', agents: ['C. Petit'], isDraft: true, color: '#9c27b0' }],
  },
  s5: {
    'Lun 31': [{ id: 'srv18', startTime: '17:00', endTime: '21:00', agents: ['L. Moreau'], isDraft: false, color: '#f44336' }],
    'Mar 01': [{ id: 'srv19', startTime: '17:00', endTime: '21:00', agents: ['L. Moreau'], isDraft: true, color: '#f44336' }],
    'Mer 02': [{ id: 'srv20', startTime: '17:00', endTime: '21:00', agents: ['P. Lefebvre'], isDraft: false, color: '#f44336' }],
    'Jeu 03': [{ id: 'srv21', startTime: '17:00', endTime: '21:00', agents: ['L. Moreau'], isDraft: false, color: '#f44336' }],
    'Ven 04': [{ id: 'srv22', startTime: '17:00', endTime: '21:00', agents: ['L. Moreau'], isDraft: false, color: '#f44336' }],
  },
};

export default function PlanningPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('semaine');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const viewButtons: { key: ViewMode; label: string }[] = [
    { key: 'jour', label: 'Jour' },
    { key: 'semaine', label: 'Semaine' },
    { key: 'mois', label: 'Mois' },
    { key: '4semaines', label: '4 semaines' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planning</h1>
          <p className="text-sm text-muted mt-1">Vue par sites</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/planning')}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
          >
            <MapPin className="w-4 h-4" />
            Sites
          </button>
          <button
            onClick={() => router.push('/planning/collaborateurs')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface text-muted border border-border rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Users className="w-4 h-4" />
            Collaborateurs
          </button>
        </div>
      </div>

      {/* View toggle + Date navigation */}
      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* View mode buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {viewButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setViewMode(btn.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === btn.key
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-foreground">
                Semaine du 31 mars au 6 avril 2026
              </span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-muted" />
            </button>
          </div>

          {/* Today button */}
          <button className="px-3 py-1.5 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
            Aujourd&apos;hui
          </button>
        </div>
      </div>

      {/* Planning Grid */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 w-48 bg-gray-50 text-sm font-semibold text-foreground sticky left-0 z-10">
                  Sites
                </th>
                {DAYS.map((day, i) => (
                  <th
                    key={day}
                    className={`text-center p-3 text-sm font-semibold text-foreground ${
                      i >= 5 ? 'bg-orange-50' : 'bg-gray-50'
                    }`}
                  >
                    <div>{day.split(' ')[0]}</div>
                    <div className="text-xs text-muted font-normal">{day.split(' ')[1]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SITES.map((site) => (
                <tr key={site.id} className="border-b border-border hover:bg-gray-50/50">
                  {/* Site name */}
                  <td className="p-3 sticky left-0 bg-surface z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: site.color }}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[160px]">
                          {site.name}
                        </p>
                        <p className="text-xs text-muted truncate max-w-[160px]">{site.address}</p>
                      </div>
                    </div>
                  </td>

                  {/* Day cells */}
                  {DAYS.map((day, dayIndex) => {
                    const services = MOCK_SERVICES[site.id]?.[day] || [];
                    return (
                      <td
                        key={day}
                        className={`p-1.5 align-top min-w-[120px] ${
                          dayIndex >= 5 ? 'bg-orange-50/30' : ''
                        }`}
                      >
                        {services.length > 0 ? (
                          services.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => setSelectedService(service.id)}
                              className="w-full text-left rounded-md p-2 mb-1 text-xs transition-all hover:shadow-md relative overflow-hidden"
                              style={{
                                backgroundColor: service.isDraft ? 'transparent' : service.color + '20',
                                borderLeft: `3px solid ${service.color}`,
                                ...(service.isDraft
                                  ? {
                                      backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        ${service.color}10,
                                        ${service.color}10 4px,
                                        ${service.color}05 4px,
                                        ${service.color}05 8px
                                      )`,
                                      border: `1px dashed ${service.color}80`,
                                      borderLeft: `3px solid ${service.color}`,
                                    }
                                  : {}),
                              }}
                            >
                              <div className="flex items-center gap-1 mb-0.5">
                                <Clock className="w-3 h-3" style={{ color: service.color }} />
                                <span className="font-medium" style={{ color: service.color }}>
                                  {service.startTime}-{service.endTime}
                                </span>
                              </div>
                              {service.agents.map((agent, idx) => (
                                <div key={idx} className="text-foreground/70 truncate">
                                  {agent}
                                </div>
                              ))}
                              {service.isDraft && (
                                <span
                                  className="absolute top-1 right-1 text-[9px] px-1 rounded font-medium"
                                  style={{ backgroundColor: service.color + '30', color: service.color }}
                                >
                                  Brouillon
                                </span>
                              )}
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => setShowServiceForm(true)}
                            className="w-full h-16 rounded-md border border-dashed border-transparent hover:border-primary-300 hover:bg-primary-50/30 transition-all group flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-primary-500/20 border-l-[3px] border-primary-500" />
            <span className="text-muted">Planifié (publié)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-4 rounded border border-dashed border-primary-400"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, rgba(0,150,136,0.1), rgba(0,150,136,0.1) 3px, rgba(0,150,136,0.03) 3px, rgba(0,150,136,0.03) 6px)`,
              }}
            />
            <span className="text-muted">Brouillon (non publié)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded border border-dashed border-primary-300 flex items-center justify-center">
              <Plus className="w-3 h-3 text-primary-300" />
            </div>
            <span className="text-muted">Cliquez sur une cellule vide pour créer un service</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-100" />
            <span className="text-muted">Week-end</span>
          </div>
        </div>
      </div>

      {/* Service detail panel */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={() => setSelectedService(null)}>
          <div
            className="w-full max-w-md bg-surface h-full shadow-modal p-6 overflow-y-auto animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Détail du service</h2>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-xl text-muted">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-sm font-medium text-primary-700">Tour Montparnasse</p>
                <p className="text-xs text-primary-600 mt-1">Nettoyage courant</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted">Date</p>
                  <p className="text-sm font-medium text-foreground">31 mars 2026</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Horaires</p>
                  <p className="text-sm font-medium text-foreground">08:00 - 16:00</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted mb-2">Collaborateurs affectés</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                      MD
                    </div>
                    <span className="text-sm text-foreground">Marc Dupont</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                      AM
                    </div>
                    <span className="text-sm text-foreground">Alice Martin</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted">Statut</p>
                <span className="inline-flex items-center px-2 py-1 bg-success/10 text-success rounded text-xs font-medium mt-1">
                  <Eye className="w-3 h-3 mr-1" />
                  Publié
                </span>
              </div>

              <button className="w-full mt-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                Modifier le service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create service overlay hint */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowServiceForm(false)}>
          <div
            className="bg-surface rounded-card shadow-modal p-8 max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Créer un service</h3>
            <p className="text-sm text-muted mb-6">
              Utilisez le formulaire complet pour créer un nouveau service sur ce créneau.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowServiceForm(false)}
                className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowServiceForm(false)}
                className="flex-1 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
