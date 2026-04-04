'use client';

import { useState } from 'react';
import {
  Plus, Search, FileText, MoreHorizontal, Send,
  CheckCircle, XCircle, Edit, Eye, Copy
} from 'lucide-react';

type DevisStatus = 'brouillon' | 'envoye' | 'accepte' | 'refuse';

interface Devis {
  id: string;
  reference: string;
  client: string;
  montantHT: number;
  montantTTC: number;
  statut: DevisStatus;
  date: string;
  validite: string;
}

const mockDevis: Devis[] = [
  {
    id: 'dv-001',
    reference: 'DEV-2026-001',
    client: 'Résidences du Parc SAS',
    montantHT: 4500.00,
    montantTTC: 5400.00,
    statut: 'envoye',
    date: '2026-03-15',
    validite: '2026-04-15',
  },
  {
    id: 'dv-002',
    reference: 'DEV-2026-002',
    client: 'Groupe Immobilier Haussmann',
    montantHT: 12800.00,
    montantTTC: 15360.00,
    statut: 'accepte',
    date: '2026-03-01',
    validite: '2026-04-01',
  },
  {
    id: 'dv-003',
    reference: 'DEV-2026-003',
    client: 'Mme. Catherine Lefèvre',
    montantHT: 850.00,
    montantTTC: 1020.00,
    statut: 'brouillon',
    date: '2026-04-01',
    validite: '2026-05-01',
  },
  {
    id: 'dv-004',
    reference: 'DEV-2026-004',
    client: 'NetPro Services',
    montantHT: 3200.00,
    montantTTC: 3840.00,
    statut: 'refuse',
    date: '2026-02-20',
    validite: '2026-03-20',
  },
];

const statusConfig: Record<DevisStatus, { label: string; color: string }> = {
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  envoye: { label: 'Envoyé', color: 'bg-blue-100 text-blue-800' },
  accepte: { label: 'Accepté', color: 'bg-green-100 text-green-800' },
  refuse: { label: 'Refusé', color: 'bg-red-100 text-red-800' },
};

export default function DevisPage() {
  const [search, setSearch] = useState('');

  const filtered = mockDevis.filter(d =>
    d.reference.toLowerCase().includes(search.toLowerCase()) ||
    d.client.toLowerCase().includes(search.toLowerCase())
  );

  const formatMontant = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Devis</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" />
          Nouveau devis
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Rechercher un devis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Référence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Client</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Montant HT</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Montant TTC</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Validité</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(devis => (
                <tr key={devis.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-primary-600">{devis.reference}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{devis.client}</td>
                  <td className="px-4 py-3 text-sm text-foreground text-right">{formatMontant(devis.montantHT)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground text-right">{formatMontant(devis.montantTTC)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[devis.statut].color}`}>
                      {statusConfig[devis.statut].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{new Date(devis.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-sm text-muted">{new Date(devis.validite).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Voir">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" title="Dupliquer">
                        <Copy className="w-4 h-4" />
                      </button>
                      {devis.statut === 'brouillon' && (
                        <button className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors" title="Envoyer">
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
