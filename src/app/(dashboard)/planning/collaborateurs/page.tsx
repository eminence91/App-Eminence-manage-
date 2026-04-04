'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Calendar, Users, MapPin,
  Clock, Moon, Sun
} from 'lucide-react';

type ViewMode = 'jour' | 'semaine' | 'mois' | '4semaines';

interface Collaborateur {
  id: string;
  name: string;
  initials: string;
  photo: string | null;
  totalHours: number;
  heuresPlanifiees: number;
  heuresRealisees: number;
  heuresSupp: number;
  heuresNuit: number;
}

interface ServiceBlock {
  id: string;
  siteName: string;
  startTime: string;
  endTime: string;
  color: string;
  isDraft: boolean;
  isNight?: boolean;
  isSunday?: boolean;
}

const COLLABORATEURS: Collaborateur[] = [
  { id: 'c1', name: 'Marc Dupont', initials: 'MD', photo: null, totalHours: 38, heuresPlanifiees: 38, heuresRealisees: 36, heuresSupp: 0, heuresNuit: 0 },
  { id: 'c2', name: 'Alice Martin', initials: 'AM', photo: null, totalHours: 22, heuresPlanifiees: 22, heuresRealisees: 20, heuresSupp: 0, heuresNuit: 0 },
  { id: 'c3', name: 'Sophie Bernard', initials: 'SB', photo: null, totalHours: 40, heuresPlanifiees: 40, heuresRealisees: 40, heuresSupp: 2, heuresNuit: 0 },
  { id: 'c4', name: 'Pierre Lefebvre', initials: 'PL', photo: null, totalHours: 28, heuresPlanifiees: 28, heuresRealisees: 26, heuresSupp: 0, heuresNuit: 8 },
  { id: 'c5', name: 'Lucie Moreau', initials: 'LM', photo: null, totalHours: 30, heuresPlanifiees: 30, heuresRealisees: 28, heuresSupp: 0, heuresNuit: 4 },
  { id: 'c6', name: 'Christophe Petit', initials: 'CP', photo: null, totalHours: 20, heuresPlanifiees: 20, heuresRealisees: 18, heuresSupp: 0, heuresNuit: 0 },
];

const DAYS = ['Lun 31', 'Mar 01', 'Mer 02', 'Jeu 03', 'Ven 04', 'Sam 05', 'Dim 06'];

const MOCK_SERVICES: Record<string, Record<string, ServiceBlock[]>> = {
  c1: {
    'Lun 31': [{ id: 'sv1', siteName: 'Tour Montparnasse', startTime: '08:00', endTime: '16:00', color: '#009688', isDraft: false }],
    'Mar 01': [{ id: 'sv2', siteName: 'Tour Montparnasse', startTime: '08:00', endTime: '16:00', color: '#009688', isDraft: false }],
    'Mer 02': [],
    'Jeu 03': [{ id: 'sv3', siteName: 'Tour Montparnasse', startTime: '08:00', endTime: '16:00', color: '#009688', isDraft: false }],
    'Ven 04': [{ id: 'sv4', siteName: 'Tour Montparnasse', startTime: '08:00', endTime: '16:00', color: '#009688', isDraft: false }],
  },
  c2: {
    'Lun 31': [{ id: 'sv5', siteName: 'Tour Montparnasse', startTime: '08:00', endTime: '16:00', color: '#009688', isDraft: false }],
    'Mer 02': [{ id: 'sv6', siteName: 'Tour Montparnasse', startTime: '08:00', endTime: '12:00', color: '#009688', isDraft: true }],
    'Jeu 03': [{ id: 'sv7', siteName: 'Tour Montparnasse', startTime: '08:00', endTime: '16:00', color: '#009688', isDraft: false }],
  },
  c3: {
    'Lun 31': [{ id: 'sv8', siteName: 'Clinique Saint-Louis', startTime: '06:00', endTime: '14:00', color: '#2196f3', isDraft: false }],
    'Mar 01': [{ id: 'sv9', siteName: 'Clinique Saint-Louis', startTime: '06:00', endTime: '14:00', color: '#2196f3', isDraft: false }],
    'Mer 02': [{ id: 'sv10', siteName: 'Clinique Saint-Louis', startTime: '06:00', endTime: '14:00', color: '#2196f3', isDraft: true }],
    'Jeu 03': [{ id: 'sv11', siteName: 'Clinique Saint-Louis', startTime: '06:00', endTime: '14:00', color: '#2196f3', isDraft: false }],
    'Ven 04': [{ id: 'sv12', siteName: 'Clinique Saint-Louis', startTime: '06:00', endTime: '14:00', color: '#2196f3', isDraft: false }],
  },
  c4: {
    'Lun 31': [{ id: 'sv13', siteName: 'Centre Commercial Vélizy', startTime: '18:00', endTime: '22:00', color: '#ff9800', isDraft: false }],
    'Mer 02': [
      { id: 'sv14', siteName: 'Centre Commercial Vélizy', startTime: '18:00', endTime: '22:00', color: '#ff9800', isDraft: false },
      { id: 'sv15', siteName: 'Lycée Victor Hugo', startTime: '17:00', endTime: '21:00', color: '#f44336', isDraft: false },
    ],
    'Ven 04': [{ id: 'sv16', siteName: 'Centre Commercial Vélizy', startTime: '18:00', endTime: '22:00', color: '#ff9800', isDraft: false }],
  },
  c5: {
    'Lun 31': [
      { id: 'sv17', siteName: 'Centre Commercial Vélizy', startTime: '18:00', endTime: '22:00', color: '#ff9800', isDraft: false },
      { id: 'sv18', siteName: 'Lycée Victor Hugo', startTime: '17:00', endTime: '21:00', color: '#f44336', isDraft: false },
    ],
    'Mar 01': [{ id: 'sv19', siteName: 'Lycée Victor Hugo', startTime: '17:00', endTime: '21:00', color: '#f44336', isDraft: true }],
    'Jeu 03': [{ id: 'sv20', siteName: 'Lycée Victor Hugo', startTime: '17:00', endTime: '21:00', color: '#f44336', isDraft: false }],
    'Ven 04': [{ id: 'sv21', siteName: 'Centre Commercial Vélizy', startTime: '18:00', endTime: '22:00', color: '#ff9800', isDraft: false }],
    'Sam 05': [{ id: 'sv22', siteName: 'Clinique Saint-Louis', startTime: '08:00', endTime: '12:00', color: '#2196f3', isDraft: true, isSunday: true }],
  },
  c6: {
    'Mar 01': [{ id: 'sv23', siteName: 'Immeuble Haussmann', startTime: '09:00', endTime: '17:00', color: '#9c27b0', isDraft: false }],
    'Jeu 03': [{ id: 'sv24', siteName: 'Immeuble Haussmann', startTime: '09:00', endTime: '17:00', color: '#9c27b0', isDraft: false }],
    'Sam 05': [{ id: 'sv25', siteName: 'Immeuble Haussmann', startTime: '09:00', endTime: '13:00', color: '#9c27b0', isDraft: true }],
  },
};

export default function PlanningCollaborateursPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('semaine');

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
          <p className="text-sm text-muted mt-1">Vue par collaborateurs</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/planning')}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface text-muted border border-border rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <MapPin className="w-4 h-4" />
            Sites
          </button>
          <button
            onClick={() => router.push('/planning/collaborateurs')}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
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
                <th className="text-left p-3 w-56 bg-gray-50 text-sm font-semibold text-foreground sticky left-0 z-10">
                  Collaborateurs
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
              {COLLABORATEURS.map((collab) => (
                <tr key={collab.id} className="border-b border-border hover:bg-gray-50/50">
                  {/* Collaborator info */}
                  <td className="p-3 sticky left-0 bg-surface z-10 border-r border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                        {collab.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{collab.name}</p>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded text-[10px] font-medium">
                          {collab.totalHours}h
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Day cells */}
                  {DAYS.map((day, dayIndex) => {
                    const services = MOCK_SERVICES[collab.id]?.[day] || [];
                    return (
                      <td
                        key={day}
                        className={`p-1.5 align-top min-w-[120px] ${
                          dayIndex >= 5 ? 'bg-orange-50/30' : ''
                        }`}
                      >
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className="rounded-md p-2 mb-1 text-xs cursor-pointer hover:shadow-md transition-shadow"
                            style={{
                              backgroundColor: service.isDraft ? 'transparent' : service.color + '20',
                              borderLeft: `3px solid ${service.color}`,
                              ...(service.isDraft
                                ? {
                                    backgroundImage: `repeating-linear-gradient(45deg, ${service.color}10, ${service.color}10 4px, ${service.color}05 4px, ${service.color}05 8px)`,
                                    border: `1px dashed ${service.color}80`,
                                    borderLeft: `3px solid ${service.color}`,
                                  }
                                : {}),
                            }}
                          >
                            <div className="font-medium truncate" style={{ color: service.color }}>
                              {service.siteName}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 text-foreground/60">
                              <Clock className="w-3 h-3" />
                              {service.startTime}-{service.endTime}
                            </div>
                            {service.isNight && (
                              <div className="flex items-center gap-1 mt-0.5 text-blue-800">
                                <Moon className="w-3 h-3" />
                                <span className="text-[10px]">Nuit</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Récapitulatif des heures</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left p-3 text-xs font-semibold text-muted uppercase">Collaborateur</th>
                <th className="text-center p-3 text-xs font-semibold text-muted uppercase">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    H. planifiées
                  </div>
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted uppercase">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    H. réalisées
                  </div>
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted uppercase">
                  <div className="flex items-center justify-center gap-1">
                    <Sun className="w-3 h-3" />
                    H. supp
                  </div>
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted uppercase">
                  <div className="flex items-center justify-center gap-1">
                    <Moon className="w-3 h-3" />
                    H. nuit
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COLLABORATEURS.map((collab) => (
                <tr key={collab.id} className="border-b border-border hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">
                        {collab.initials}
                      </div>
                      <span className="text-sm font-medium text-foreground">{collab.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                      {collab.heuresPlanifiees}h
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-foreground rounded text-xs font-medium">
                      {collab.heuresRealisees}h
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      collab.heuresSupp > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-muted'
                    }`}>
                      {collab.heuresSupp}h
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      collab.heuresNuit > 0 ? 'bg-blue-900/10 text-blue-900' : 'bg-gray-100 text-muted'
                    }`}>
                      {collab.heuresNuit}h
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Color coding legend */}
      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-primary-500/20 border-l-[3px] border-primary-500" />
            <span className="text-muted">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-blue-900/20 border-l-[3px] border-blue-900" />
            <span className="text-muted">Heures de nuit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded bg-orange-400/20 border-l-[3px] border-orange-400" />
            <span className="text-muted">Dimanche / Jour férié</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-4 rounded border border-dashed border-primary-400"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, rgba(0,150,136,0.1), rgba(0,150,136,0.1) 3px, rgba(0,150,136,0.03) 3px, rgba(0,150,136,0.03) 6px)`,
              }}
            />
            <span className="text-muted">Brouillon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
