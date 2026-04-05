'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  MapPin,
  Eye,
  ShieldAlert,
  Wrench,
  MessageSquare,
} from 'lucide-react';

type EventType = 'Incident' | 'Observation' | 'Intervention' | 'Information' | 'Sécurité' | 'Maintenance';

interface MCEvent {
  id: number;
  type: EventType;
  date: string;
  heure: string;
  site: string;
  description: string;
  agent: string;
  is_visible_client: boolean;
}

const typeConfig: Record<EventType, { icon: typeof Info; bg: string; text: string }> = {
  Incident: { icon: AlertTriangle, bg: 'bg-red-100', text: 'text-red-800' },
  Observation: { icon: Eye, bg: 'bg-purple-100', text: 'text-purple-800' },
  Intervention: { icon: Wrench, bg: 'bg-blue-100', text: 'text-blue-800' },
  Information: { icon: Info, bg: 'bg-gray-100', text: 'text-gray-800' },
  'Sécurité': { icon: ShieldAlert, bg: 'bg-orange-100', text: 'text-orange-800' },
  Maintenance: { icon: CheckCircle2, bg: 'bg-green-100', text: 'text-green-800' },
};

const mockEvents: MCEvent[] = [
  {
    id: 1,
    type: 'Incident',
    date: '2026-04-05',
    heure: '08:15',
    site: 'Siège Social - La Défense',
    description: 'Fuite d\'eau constatée dans les sanitaires du 2e étage. Le gardien a été prévenu et une intervention plomberie a été demandée.',
    agent: 'M. Traoré',
    is_visible_client: true,
  },
  {
    id: 2,
    type: 'Observation',
    date: '2026-04-05',
    heure: '07:30',
    site: 'Siège Social - La Défense',
    description: 'Sol du hall d\'entrée très sale suite aux intempéries de la nuit. Nettoyage renforcé effectué avec passage supplémentaire de l\'autolaveuse.',
    agent: 'M. Traoré',
    is_visible_client: true,
  },
  {
    id: 3,
    type: 'Intervention',
    date: '2026-04-04',
    heure: '14:00',
    site: 'Entrepôt Logistique - Gennevilliers',
    description: 'Décapage et remise en cire du sol de la zone de réception. Travaux réalisés conformément au cahier des charges.',
    agent: 'M. Ndiaye',
    is_visible_client: true,
  },
  {
    id: 4,
    type: 'Information',
    date: '2026-04-04',
    heure: '09:00',
    site: 'Boutique Centre-Ville - Paris 8e',
    description: 'Remplacement du produit vitre habituel par un produit écologique certifié Ecolabel. Résultat identique sans traces.',
    agent: 'Mme Camara',
    is_visible_client: true,
  },
  {
    id: 5,
    type: 'Sécurité',
    date: '2026-04-03',
    heure: '22:30',
    site: 'Siège Social - La Défense',
    description: 'Porte de secours du sous-sol trouvée ouverte lors de la ronde. Porte sécurisée et signalement transmis au responsable sécurité.',
    agent: 'M. Traoré',
    is_visible_client: true,
  },
  {
    id: 6,
    type: 'Maintenance',
    date: '2026-04-03',
    heure: '13:45',
    site: 'Entrepôt Logistique - Gennevilliers',
    description: 'Entretien préventif de l\'autolaveuse réalisé. Changement des brosses et vérification du système d\'aspiration.',
    agent: 'M. Ndiaye',
    is_visible_client: true,
  },
  {
    id: 7,
    type: 'Observation',
    date: '2026-04-02',
    heure: '08:00',
    site: 'Boutique Centre-Ville - Paris 8e',
    description: 'Éclairage de la réserve arrière défaillant (2 néons grillés). Signalement fait au gestionnaire de l\'immeuble.',
    agent: 'Mme Camara',
    is_visible_client: true,
  },
  {
    id: 8,
    type: 'Intervention',
    date: '2026-04-01',
    heure: '06:30',
    site: 'Siège Social - La Défense',
    description: 'Shampoing moquette effectué dans la salle de réunion principale (prévu au planning trimestriel). Séchage estimé à 4h.',
    agent: 'Mme Diallo',
    is_visible_client: true,
  },
];

export default function ClientMainsCourantesPage() {
  const [dateDebut, setDateDebut] = useState('2026-04-01');
  const [dateFin, setDateFin] = useState('2026-04-05');
  const [siteFilter, setSiteFilter] = useState<string>('all');

  const sites = Array.from(new Set(mockEvents.map((e) => e.site)));

  // Filter only visible events
  const visibleEvents = mockEvents.filter((e) => e.is_visible_client);

  const filteredEvents = visibleEvents.filter((e) => {
    const matchSite = siteFilter === 'all' || e.site === siteFilter;
    const matchDate = e.date >= dateDebut && e.date <= dateFin;
    return matchSite && matchDate;
  });

  // Group by date
  const grouped = filteredEvents.reduce<Record<string, MCEvent[]>>(
    (acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-600" />
            Mains courantes
          </h1>
          <p className="text-gray-500 mt-1">
            Événements et observations sur vos sites
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Download className="h-4 w-4" />
          Exporter en PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Filter className="h-4 w-4" />
          Filtres
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Date début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Date fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Site</label>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tous les sites</option>
              {sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
      </p>

      {/* Timeline */}
      {sortedDates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun événement pour la période sélectionnée</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-semibold text-gray-600 capitalize whitespace-nowrap">
                  {formatDate(date)}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Events */}
              <div className="space-y-3">
                {grouped[date].map((event) => {
                  const config = typeConfig[event.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {/* Type icon */}
                        <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                          <Icon className={`h-4 w-4 ${config.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                              {event.type}
                            </span>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.heure}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.site}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {event.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Rapporté par {event.agent}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
