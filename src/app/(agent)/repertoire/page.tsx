'use client';

import React, { useState } from 'react';
import { Search, Phone, MapPin, User } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  poste: string;
  phone: string;
  site: string;
  initials: string;
  avatarColor: string;
}

const mockCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Marie Dupont',
    poste: 'Responsable de secteur',
    phone: '+33612345678',
    site: 'Agence Paris Centre',
    initials: 'MD',
    avatarColor: 'bg-primary-500',
  },
  {
    id: '2',
    name: 'Jean-Pierre Martin',
    poste: 'Agent de propreté',
    phone: '+33623456789',
    site: 'Tour Montparnasse',
    initials: 'JM',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Fatima Benali',
    poste: 'Agent de propreté',
    phone: '+33634567890',
    site: 'Cabinet Dr. Martin',
    initials: 'FB',
    avatarColor: 'bg-purple-500',
  },
  {
    id: '4',
    name: 'Thomas Leroy',
    poste: 'Chef d\'équipe',
    phone: '+33645678901',
    site: 'Copropriété Haussmann',
    initials: 'TL',
    avatarColor: 'bg-orange-500',
  },
  {
    id: '5',
    name: 'Aminata Diallo',
    poste: 'Agent de propreté',
    phone: '+33656789012',
    site: 'Restaurant Le Petit Zinc',
    initials: 'AD',
    avatarColor: 'bg-pink-500',
  },
  {
    id: '6',
    name: 'Stéphane Moreau',
    poste: 'Inspecteur qualité',
    phone: '+33667890123',
    site: 'Agence Paris Centre',
    initials: 'SM',
    avatarColor: 'bg-green-600',
  },
];

export default function AnnuairePage() {
  const [search, setSearch] = useState('');

  const filtered = mockCollaborators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.poste.toLowerCase().includes(search.toLowerCase()) ||
      c.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold text-gray-900 mb-4">Annuaire</h1>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un collaborateur..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        {filtered.length} collaborateur{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Collaborators list */}
      <div className="space-y-2">
        {filtered.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3"
          >
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full ${person.avatarColor} flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white font-bold text-sm">{person.initials}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{person.name}</p>
              <p className="text-xs text-gray-500 truncate">{person.poste}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <p className="text-[11px] text-gray-400 truncate">{person.site}</p>
              </div>
            </div>

            {/* Call button */}
            <a
              href={`tel:${person.phone}`}
              className="w-11 h-11 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center active:bg-green-100 flex-shrink-0"
            >
              <Phone className="w-5 h-5 text-green-600" />
            </a>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Aucun résultat trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
