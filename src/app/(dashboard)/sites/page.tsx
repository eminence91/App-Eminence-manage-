'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, LayoutGrid, List, Building2, MapPin,
  Users, ChevronRight, MoreVertical
} from 'lucide-react';

interface Site {
  id: string;
  nom: string;
  client: string;
  adresse: string;
  ville: string;
  codePostal: string;
  couleur: string;
  nbAgents: number;
  statut: 'actif' | 'inactif' | 'suspendu';
  photo?: string;
}

const MOCK_SITES: Site[] = [
  {
    id: '1',
    nom: 'Clinique de Neuilly',
    client: 'Groupe Santé Plus',
    adresse: '12 avenue Charles de Gaulle',
    ville: 'Neuilly-sur-Seine',
    codePostal: '92200',
    couleur: '#009688',
    nbAgents: 8,
    statut: 'actif',
  },
  {
    id: '2',
    nom: 'Bureaux Tour Montparnasse',
    client: 'Immo Gestion SA',
    adresse: '33 avenue du Maine',
    ville: 'Paris',
    codePostal: '75015',
    couleur: '#2196f3',
    nbAgents: 12,
    statut: 'actif',
  },
  {
    id: '3',
    nom: 'Centre Commercial Vélizy',
    client: 'Unibail-Rodamco',
    adresse: '2 avenue de l\'Europe',
    ville: 'Vélizy-Villacoublay',
    codePostal: '78140',
    couleur: '#ff9800',
    nbAgents: 15,
    statut: 'actif',
  },
  {
    id: '4',
    nom: 'Résidence Les Jardins',
    client: 'Nexity Immobilier',
    adresse: '8 rue des Lilas',
    ville: 'Boulogne-Billancourt',
    codePostal: '92100',
    couleur: '#4caf50',
    nbAgents: 4,
    statut: 'actif',
  },
  {
    id: '5',
    nom: 'Lycée Victor Hugo',
    client: 'Région Île-de-France',
    adresse: '27 rue de Sèvres',
    ville: 'Issy-les-Moulineaux',
    codePostal: '92130',
    couleur: '#9c27b0',
    nbAgents: 6,
    statut: 'suspendu',
  },
  {
    id: '6',
    nom: 'Hôtel Marriott Rive Gauche',
    client: 'Marriott International',
    adresse: '17 boulevard Saint-Jacques',
    ville: 'Paris',
    codePostal: '75014',
    couleur: '#f44336',
    nbAgents: 10,
    statut: 'inactif',
  },
];

const statutConfig = {
  actif: { label: 'Actif', color: 'bg-success text-white' },
  inactif: { label: 'Inactif', color: 'bg-gray-400 text-white' },
  suspendu: { label: 'Suspendu', color: 'bg-warning text-white' },
};

export default function SitesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = MOCK_SITES.filter(
    (s) =>
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.client.toLowerCase().includes(search.toLowerCase()) ||
      s.ville.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sites</h1>
          <p className="text-sm text-muted mt-1">
            {MOCK_SITES.length} sites au total
          </p>
        </div>
        <button
          onClick={() => router.push('/sites/nouveau')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm shadow-card"
        >
          <Plus className="w-4 h-4" />
          Nouveau site
        </button>
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Rechercher un site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`p-2.5 transition-colors ${
              view === 'grid'
                ? 'bg-primary-500 text-white'
                : 'text-muted hover:bg-gray-50'
            }`}
            title="Vue grille"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2.5 transition-colors ${
              view === 'list'
                ? 'bg-primary-500 text-white'
                : 'text-muted hover:bg-gray-50'
            }`}
            title="Vue liste"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-muted">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour &quot;{search}&quot;
        </p>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((site) => {
            const cfg = statutConfig[site.statut];
            return (
              <div
                key={site.id}
                onClick={() => router.push(`/sites/${site.id}`)}
                className="bg-surface rounded-card shadow-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
              >
                {/* Photo / Placeholder */}
                <div
                  className="h-36 flex items-center justify-center relative"
                  style={{ backgroundColor: `${site.couleur}15` }}
                >
                  <Building2
                    className="w-14 h-14 opacity-30"
                    style={{ color: site.couleur }}
                  />
                  {/* Color dot */}
                  <div
                    className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: site.couleur }}
                  />
                  {/* Status badge */}
                  <span
                    className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary-600 transition-colors">
                        {site.nom}
                      </h3>
                      <p className="text-sm text-muted truncate mt-0.5">
                        {site.client}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1 rounded hover:bg-gray-100 text-muted"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{site.ville} ({site.codePostal})</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Users className="w-3.5 h-3.5" />
                      <span>{site.nbAgents} agent{site.nbAgents > 1 ? 's' : ''}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Nom
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                    Adresse
                  </th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Nb agents
                  </th>
                  <th className="text-center text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Statut
                  </th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((site) => {
                  const cfg = statutConfig[site.statut];
                  return (
                    <tr
                      key={site.id}
                      onClick={() => router.push(`/sites/${site.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: site.couleur }}
                          />
                          <span className="font-medium text-sm text-foreground">
                            {site.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted hidden sm:table-cell">
                        {site.client}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                        {site.adresse}, {site.ville}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-muted">
                          <Users className="w-3.5 h-3.5" />
                          {site.nbAgents}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-muted" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-surface rounded-card shadow-card p-12 text-center">
          <Building2 className="w-12 h-12 text-muted mx-auto mb-3 opacity-40" />
          <p className="text-foreground font-medium">Aucun site trouvé</p>
          <p className="text-sm text-muted mt-1">
            Essayez de modifier votre recherche
          </p>
        </div>
      )}
    </div>
  );
}
