'use client';

import { useState } from 'react';
import {
  MessageSquare, Clock, CheckCircle, AlertCircle, Search
} from 'lucide-react';

type RequestType = 'reclamation' | 'intervention' | 'modification' | 'information';
type ClientRequestStatus = 'en_attente' | 'en_cours' | 'resolu';

interface ClientRequest {
  id: string;
  client: string;
  type: RequestType;
  sujet: string;
  description: string;
  date: string;
  statut: ClientRequestStatus;
}

const mockClientRequests: ClientRequest[] = [
  {
    id: 'cr-001',
    client: 'Groupe Immobilier Haussmann',
    type: 'reclamation',
    sujet: 'Nettoyage insuffisant hall B',
    description: 'Le hall B du bâtiment principal n\'a pas été nettoyé correctement vendredi dernier. Les sols sont encore tachés.',
    date: '2026-04-01',
    statut: 'en_attente',
  },
  {
    id: 'cr-002',
    client: 'Boulangerie Dupont & Fils',
    type: 'intervention',
    sujet: 'Nettoyage exceptionnel vitrine',
    description: 'Demande de nettoyage exceptionnel des vitrines pour l\'inauguration de la nouvelle boutique.',
    date: '2026-03-28',
    statut: 'en_cours',
  },
  {
    id: 'cr-003',
    client: 'Résidences du Parc SAS',
    type: 'modification',
    sujet: 'Changement d\'horaires',
    description: 'Souhaite modifier les horaires d\'intervention du mardi au jeudi, passage de 6h à 8h.',
    date: '2026-03-25',
    statut: 'resolu',
  },
  {
    id: 'cr-004',
    client: 'Mme. Catherine Lefèvre',
    type: 'information',
    sujet: 'Demande de devis supplémentaire',
    description: 'Demande de devis pour le nettoyage des moquettes de l\'appartement du 3e étage.',
    date: '2026-04-02',
    statut: 'en_attente',
  },
];

const typeConfig: Record<RequestType, { label: string; color: string }> = {
  reclamation: { label: 'Réclamation', color: 'bg-red-100 text-red-800' },
  intervention: { label: 'Intervention', color: 'bg-blue-100 text-blue-800' },
  modification: { label: 'Modification', color: 'bg-amber-100 text-amber-800' },
  information: { label: 'Information', color: 'bg-gray-100 text-gray-800' },
};

const statusConfig: Record<ClientRequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  en_attente: { label: 'En attente', color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-3.5 h-3.5" /> },
  en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  resolu: { label: 'Résolu', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

export default function DemandesClientsPage() {
  const [search, setSearch] = useState('');

  const filtered = mockClientRequests.filter(r =>
    r.client.toLowerCase().includes(search.toLowerCase()) ||
    r.sujet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Demandes clients</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Sujet</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{req.client}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[req.type].color}`}>
                      {typeConfig[req.type].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{req.sujet}</td>
                  <td className="px-4 py-3 text-sm text-muted max-w-[250px] truncate">{req.description}</td>
                  <td className="px-4 py-3 text-sm text-muted">{new Date(req.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[req.statut].color}`}>
                      {statusConfig[req.statut].icon}
                      {statusConfig[req.statut].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
