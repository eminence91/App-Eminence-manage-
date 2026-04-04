'use client';

import { useState } from 'react';
import {
  Plus, Search, FileText, Eye, Edit, Send, RefreshCw,
  DollarSign, Clock, CheckCircle, AlertTriangle, ExternalLink
} from 'lucide-react';

type FactureStatus = 'brouillon' | 'envoyee' | 'payee' | 'en_retard';

interface Facture {
  id: string;
  reference: string;
  client: string;
  montantTTC: number;
  statut: FactureStatus;
  dateEmission: string;
  dateEcheance: string;
  pennylaneSynced: boolean;
}

const mockFactures: Facture[] = [
  {
    id: 'fac-001',
    reference: 'FAC-2026-001',
    client: 'Groupe Immobilier Haussmann',
    montantTTC: 15360.00,
    statut: 'payee',
    dateEmission: '2026-03-01',
    dateEcheance: '2026-03-31',
    pennylaneSynced: true,
  },
  {
    id: 'fac-002',
    reference: 'FAC-2026-002',
    client: 'Boulangerie Dupont & Fils',
    montantTTC: 2880.00,
    statut: 'envoyee',
    dateEmission: '2026-03-15',
    dateEcheance: '2026-04-15',
    pennylaneSynced: true,
  },
  {
    id: 'fac-003',
    reference: 'FAC-2026-003',
    client: 'Mme. Catherine Lefèvre',
    montantTTC: 1020.00,
    statut: 'en_retard',
    dateEmission: '2026-02-01',
    dateEcheance: '2026-03-01',
    pennylaneSynced: false,
  },
  {
    id: 'fac-004',
    reference: 'FAC-2026-004',
    client: 'NetPro Services',
    montantTTC: 3840.00,
    statut: 'payee',
    dateEmission: '2026-02-15',
    dateEcheance: '2026-03-15',
    pennylaneSynced: true,
  },
  {
    id: 'fac-005',
    reference: 'AV-2026-001',
    client: 'Résidences du Parc SAS',
    montantTTC: -540.00,
    statut: 'brouillon',
    dateEmission: '2026-04-01',
    dateEcheance: '2026-05-01',
    pennylaneSynced: false,
  },
];

const statusConfig: Record<FactureStatus, { label: string; color: string; icon: React.ReactNode }> = {
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700', icon: <FileText className="w-3.5 h-3.5" /> },
  envoyee: { label: 'Envoyée', color: 'bg-blue-100 text-blue-800', icon: <Send className="w-3.5 h-3.5" /> },
  payee: { label: 'Payée', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  en_retard: { label: 'En retard', color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

export default function FacturesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockFactures.filter(f =>
    f.reference.toLowerCase().includes(search.toLowerCase()) ||
    f.client.toLowerCase().includes(search.toLowerCase())
  );

  const formatMontant = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  const totalFacture = mockFactures.filter(f => f.montantTTC > 0).reduce((s, f) => s + f.montantTTC, 0);
  const totalPaye = mockFactures.filter(f => f.statut === 'payee').reduce((s, f) => s + f.montantTTC, 0);
  const totalEnAttente = mockFactures.filter(f => f.statut === 'envoyee').reduce((s, f) => s + f.montantTTC, 0);
  const totalEnRetard = mockFactures.filter(f => f.statut === 'en_retard').reduce((s, f) => s + f.montantTTC, 0);

  const summaryCards = [
    { label: 'Total facturé', value: formatMontant(totalFacture), color: 'bg-primary-50 text-primary-700', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'En attente', value: formatMontant(totalEnAttente), color: 'bg-blue-50 text-blue-700', icon: <Clock className="w-5 h-5" /> },
    { label: 'Payé', value: formatMontant(totalPaye), color: 'bg-green-50 text-green-700', icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'En retard', value: formatMontant(totalEnRetard), color: 'bg-red-50 text-red-700', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Factures & Avoirs</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-surface rounded-card shadow-card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-muted">{card.label}</p>
                <p className="text-lg font-bold text-foreground">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Rechercher une facture..."
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
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Montant TTC</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date échéance</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">PennyLane</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(fac => (
                <tr key={fac.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-primary-600">{fac.reference}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{fac.client}</td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${fac.montantTTC < 0 ? 'text-red-600' : 'text-foreground'}`}>
                    {formatMontant(fac.montantTTC)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[fac.statut].color}`}>
                      {statusConfig[fac.statut].icon}
                      {statusConfig[fac.statut].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{new Date(fac.dateEcheance).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-center">
                    {fac.pennylaneSynced ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Synchronisé
                      </span>
                    ) : (
                      <span className="text-xs text-muted">Non synchronisé</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Voir">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </button>
                      {fac.pennylaneSynced && (
                        <button className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors" title="Voir dans PennyLane">
                          <ExternalLink className="w-4 h-4" />
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
