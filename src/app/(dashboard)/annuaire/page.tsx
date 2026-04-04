'use client';

import { useState } from 'react';
import { Search, Phone, Mail, MapPin, User } from 'lucide-react';

interface Agent {
  id: string;
  nom: string;
  prenom: string;
  initiales: string;
  poste: string;
  telephone: string;
  email: string;
  siteAffecte: string;
  couleur: string;
}

const mockAgents: Agent[] = [
  {
    id: 'a-1',
    nom: 'Dubois',
    prenom: 'Marie',
    initiales: 'MD',
    poste: 'Agent de propreté',
    telephone: '06 12 34 56 78',
    email: 'marie.dubois@eminence-proprete.fr',
    siteAffecte: 'Tour Haussmann - Hall A',
    couleur: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'a-2',
    nom: 'Martin',
    prenom: 'Jean-Pierre',
    initiales: 'JM',
    poste: 'Chef d\'équipe',
    telephone: '06 23 45 67 89',
    email: 'jp.martin@eminence-proprete.fr',
    siteAffecte: 'Tour Haussmann - Hall B',
    couleur: 'bg-green-100 text-green-700',
  },
  {
    id: 'a-3',
    nom: 'Benali',
    prenom: 'Fatima',
    initiales: 'FB',
    poste: 'Agent de propreté',
    telephone: '06 34 56 78 90',
    email: 'fatima.benali@eminence-proprete.fr',
    siteAffecte: 'Résidence du Parc - Bât. A',
    couleur: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'a-4',
    nom: 'Zidane',
    prenom: 'Karim',
    initiales: 'KZ',
    poste: 'Agent polyvalent',
    telephone: '06 45 67 89 01',
    email: 'karim.zidane@eminence-proprete.fr',
    siteAffecte: 'Boulangerie Dupont - Central',
    couleur: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'a-5',
    nom: 'Laurent',
    prenom: 'Sophie',
    initiales: 'SL',
    poste: 'Responsable terrain',
    telephone: '06 56 78 90 12',
    email: 'sophie.laurent@eminence-proprete.fr',
    siteAffecte: 'Multi-sites',
    couleur: 'bg-red-100 text-red-700',
  },
  {
    id: 'a-6',
    nom: 'Petit',
    prenom: 'Thomas',
    initiales: 'TP',
    poste: 'Agent de propreté',
    telephone: '06 67 89 01 23',
    email: 'thomas.petit@eminence-proprete.fr',
    siteAffecte: 'Bureau NetPro - Strasbourg',
    couleur: 'bg-primary-100 text-primary-700',
  },
];

export default function AnnuairePage() {
  const [search, setSearch] = useState('');

  const filtered = mockAgents.filter(a =>
    `${a.prenom} ${a.nom}`.toLowerCase().includes(search.toLowerCase()) ||
    a.poste.toLowerCase().includes(search.toLowerCase()) ||
    a.siteAffecte.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Annuaire</h1>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Rechercher un collaborateur, poste, site..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(agent => (
          <div key={agent.id} className="bg-surface rounded-card shadow-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-full ${agent.couleur} flex items-center justify-center text-lg font-bold shrink-0`}>
                {agent.initiales}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground">{agent.prenom} {agent.nom}</h3>
                <p className="text-sm text-muted mt-0.5">{agent.poste}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <a
                href={`tel:${agent.telephone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-sm text-foreground hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-muted shrink-0" />
                {agent.telephone}
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-3 text-sm text-foreground hover:text-primary-600 transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-muted shrink-0" />
                <span className="truncate">{agent.email}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{agent.siteAffecte}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
