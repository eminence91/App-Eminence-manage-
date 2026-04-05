'use client';

import { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  User,
} from 'lucide-react';

type ServiceStatus = 'Confirmé' | 'En attente' | 'En cours' | 'Terminé';

interface PlanningEntry {
  id: number;
  date: string;
  jour: string;
  site: string;
  horaires: string;
  agents: string[];
  prestation: string;
  statut: ServiceStatus;
}

const statusConfig: Record<ServiceStatus, { bg: string; text: string }> = {
  'Confirmé': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'En attente': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'En cours': { bg: 'bg-teal-100', text: 'text-teal-800' },
  'Terminé': { bg: 'bg-green-100', text: 'text-green-800' },
};

const mockPlanning: PlanningEntry[] = [
  // Site 1 - Siège Social
  { id: 1, date: '2026-04-06', jour: 'Lundi', site: 'Siège Social - La Défense', horaires: '06:00 - 09:00', agents: ['M. Traoré'], prestation: 'Nettoyage bureaux', statut: 'Confirmé' },
  { id: 2, date: '2026-04-07', jour: 'Mardi', site: 'Siège Social - La Défense', horaires: '06:00 - 09:00', agents: ['M. Traoré'], prestation: 'Nettoyage bureaux', statut: 'Confirmé' },
  { id: 3, date: '2026-04-08', jour: 'Mercredi', site: 'Siège Social - La Défense', horaires: '06:00 - 09:00', agents: ['M. Traoré', 'Mme Diallo'], prestation: 'Nettoyage bureaux + sanitaires', statut: 'En attente' },
  { id: 4, date: '2026-04-09', jour: 'Jeudi', site: 'Siège Social - La Défense', horaires: '06:00 - 09:00', agents: ['M. Traoré'], prestation: 'Nettoyage bureaux', statut: 'En attente' },
  { id: 5, date: '2026-04-10', jour: 'Vendredi', site: 'Siège Social - La Défense', horaires: '06:00 - 10:00', agents: ['M. Traoré', 'Mme Diallo'], prestation: 'Nettoyage complet + vitrerie', statut: 'En attente' },
  // Site 2 - Entrepôt
  { id: 6, date: '2026-04-06', jour: 'Lundi', site: 'Entrepôt Logistique - Gennevilliers', horaires: '12:00 - 14:00', agents: ['M. Ndiaye'], prestation: 'Nettoyage sol industriel', statut: 'Confirmé' },
  { id: 7, date: '2026-04-07', jour: 'Mardi', site: 'Entrepôt Logistique - Gennevilliers', horaires: '12:00 - 14:00', agents: ['M. Ndiaye'], prestation: 'Nettoyage sol industriel', statut: 'Confirmé' },
  { id: 8, date: '2026-04-08', jour: 'Mercredi', site: 'Entrepôt Logistique - Gennevilliers', horaires: '12:00 - 15:00', agents: ['M. Ndiaye', 'M. Koné'], prestation: 'Nettoyage complet + désinfection', statut: 'En attente' },
  { id: 9, date: '2026-04-09', jour: 'Jeudi', site: 'Entrepôt Logistique - Gennevilliers', horaires: '12:00 - 14:00', agents: ['M. Ndiaye'], prestation: 'Nettoyage sol industriel', statut: 'En attente' },
  { id: 10, date: '2026-04-10', jour: 'Vendredi', site: 'Entrepôt Logistique - Gennevilliers', horaires: '12:00 - 14:00', agents: ['M. Ndiaye'], prestation: 'Nettoyage sol industriel', statut: 'En attente' },
  // Site 3 - Boutique
  { id: 11, date: '2026-04-06', jour: 'Lundi', site: 'Boutique Centre-Ville - Paris 8e', horaires: '07:00 - 08:30', agents: ['Mme Camara'], prestation: 'Nettoyage vitrine + sol', statut: 'Terminé' },
  { id: 12, date: '2026-04-07', jour: 'Mardi', site: 'Boutique Centre-Ville - Paris 8e', horaires: '07:00 - 08:30', agents: ['Mme Camara'], prestation: 'Nettoyage vitrine + sol', statut: 'En cours' },
  { id: 13, date: '2026-04-08', jour: 'Mercredi', site: 'Boutique Centre-Ville - Paris 8e', horaires: '07:00 - 08:30', agents: ['Mme Camara'], prestation: 'Nettoyage vitrine + sol', statut: 'Confirmé' },
  { id: 14, date: '2026-04-09', jour: 'Jeudi', site: 'Boutique Centre-Ville - Paris 8e', horaires: '07:00 - 08:30', agents: ['Mme Camara'], prestation: 'Nettoyage vitrine + sol', statut: 'En attente' },
  { id: 15, date: '2026-04-10', jour: 'Vendredi', site: 'Boutique Centre-Ville - Paris 8e', horaires: '07:00 - 09:00', agents: ['Mme Camara', 'Mme Diallo'], prestation: 'Nettoyage complet hebdo', statut: 'En attente' },
];

export default function ClientPlanningPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [siteFilter, setSiteFilter] = useState<string>('all');

  const sites = Array.from(new Set(mockPlanning.map((e) => e.site)));

  const filteredPlanning =
    siteFilter === 'all'
      ? mockPlanning
      : mockPlanning.filter((e) => e.site === siteFilter);

  // Group by date
  const grouped = filteredPlanning.reduce<Record<string, PlanningEntry[]>>(
    (acc, entry) => {
      const key = `${entry.jour} ${entry.date}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {}
  );

  const weekLabel = weekOffset === 0 ? 'Semaine en cours' : weekOffset === 1 ? 'Semaine prochaine' : `Semaine +${weekOffset}`;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-teal-600" />
          Planning de vos sites
        </h1>
        <p className="text-gray-500 mt-1">
          Consultez les prestations planifiées sur vos sites
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Week navigation */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
            {weekLabel}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Site filter */}
        <select
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">Tous les sites</option>
          {sites.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Site</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Horaires</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent(s)</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prestation</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPlanning.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{entry.jour}</div>
                  <div className="text-xs text-gray-500">{entry.date}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{entry.site}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm text-gray-700">{entry.horaires}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    {entry.agents.map((agent) => (
                      <div key={agent} className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700">{agent}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{entry.prestation}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[entry.statut].bg} ${statusConfig[entry.statut].text}`}>
                    {entry.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {Object.entries(grouped).map(([dateKey, entries]) => (
          <div key={dateKey}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {dateKey}
            </h3>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      {entry.site}
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[entry.statut].bg} ${statusConfig[entry.statut].text}`}>
                      {entry.statut}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {entry.horaires}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      {entry.agents.join(', ')}
                    </div>
                    <p className="text-gray-500 pt-1">{entry.prestation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-teal-700">{filteredPlanning.length}</p>
          <p className="text-xs text-gray-500 mt-1">Prestations cette semaine</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-teal-700">{sites.length}</p>
          <p className="text-xs text-gray-500 mt-1">Sites actifs</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {filteredPlanning.filter((e) => e.statut === 'Terminé').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Terminées</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {filteredPlanning.filter((e) => e.statut === 'Confirmé').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Confirmées</p>
        </div>
      </div>
    </div>
  );
}
