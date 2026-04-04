'use client';

import { useState } from 'react';
import { FileText, Search, Download, Eye, Send, Plus, Calendar, CheckCircle, Clock } from 'lucide-react';

interface BonIntervention {
  id: string;
  reference: string;
  agent: string;
  site: string;
  client: string;
  date: string;
  status: 'draft' | 'completed' | 'sent';
  description: string;
  hasSignatureAgent: boolean;
  hasSignatureClient: boolean;
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-200 text-gray-700' },
  completed: { label: 'Complété', color: 'bg-success text-white' },
  sent: { label: 'Envoyé', color: 'bg-info text-white' },
};

const mockBons: BonIntervention[] = [
  { id: '1', reference: 'BI-2026-001', agent: 'Mohamed K.', site: 'Clinique de Neuilly', client: 'Groupe Hospitalier Paris', date: '03/04/2026', status: 'completed', description: 'Nettoyage complet des locaux — RAS', hasSignatureAgent: true, hasSignatureClient: true },
  { id: '2', reference: 'BI-2026-002', agent: 'Fatou D.', site: 'Bureaux Tour Montparnasse', client: 'SCI Montparnasse', date: '03/04/2026', status: 'sent', description: 'Nettoyage + signalement dégât des eaux', hasSignatureAgent: true, hasSignatureClient: true },
  { id: '3', reference: 'BI-2026-003', agent: 'Ibrahim S.', site: 'Centre Commercial Vélizy', client: 'Unibail-Rodamco', date: '02/04/2026', status: 'completed', description: 'Remise en état après travaux', hasSignatureAgent: true, hasSignatureClient: false },
  { id: '4', reference: 'BI-2026-004', agent: 'Aminata C.', site: 'Résidence Les Jardins', client: 'Nexity Résidences', date: '02/04/2026', status: 'draft', description: 'En cours de rédaction', hasSignatureAgent: false, hasSignatureClient: false },
];

export default function BonsInterventionPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockBons.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return b.agent.toLowerCase().includes(s) || b.site.toLowerCase().includes(s) || b.reference.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Bons d&apos;intervention</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
          <Plus size={16} /> Nouveau bon
        </button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex gap-2">
          {[{ key: 'all', label: 'Tous' }, { key: 'draft', label: 'Brouillons' }, { key: 'completed', label: 'Complétés' }, { key: 'sent', label: 'Envoyés' }].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)} className={`px-3 py-1 text-xs rounded-full border ${statusFilter === f.key ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase">Référence</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase">Agent</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase hidden md:table-cell">Site / Client</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase">Statut</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase hidden md:table-cell">Signatures</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(bon => {
              const cfg = statusConfig[bon.status];
              return (
                <tr key={bon.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-primary-500">{bon.reference}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{bon.agent}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-foreground">{bon.site}</p>
                    <p className="text-xs text-muted">{bon.client}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-muted flex items-center gap-1"><Calendar size={14} /> {bon.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${bon.hasSignatureAgent ? 'text-success' : 'text-muted'}`}>
                        {bon.hasSignatureAgent ? <CheckCircle size={14} /> : <Clock size={14} />} Agent
                      </span>
                      <span className={`text-xs ${bon.hasSignatureClient ? 'text-success' : 'text-muted'}`}>
                        {bon.hasSignatureClient ? <CheckCircle size={14} /> : <Clock size={14} />} Client
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="p-1.5 hover:bg-gray-100 rounded" title="Voir"><Eye size={16} className="text-muted" /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded" title="PDF"><Download size={16} className="text-muted" /></button>
                      {bon.status === 'completed' && (
                        <button className="p-1.5 hover:bg-gray-100 rounded" title="Envoyer"><Send size={16} className="text-primary-500" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
