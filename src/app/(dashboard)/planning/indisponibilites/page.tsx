'use client';

import { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

interface Unavailability {
  id: string;
  collaborator: string;
  type: string;
  typeColor: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
}

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} /> },
  approved: { label: 'Approuvée', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> },
  rejected: { label: 'Refusée', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> },
};

const mockData: Unavailability[] = [
  { id: '1', collaborator: 'Aminata C.', type: 'Congés payés', typeColor: 'bg-blue-500', startDate: '15/04/2026', endDate: '22/04/2026', reason: 'Vacances familiales', status: 'pending', days: 6 },
  { id: '2', collaborator: 'Ibrahim S.', type: 'Événement familial', typeColor: 'bg-purple-500', startDate: '10/04/2026', endDate: '10/04/2026', reason: 'Mariage', status: 'pending', days: 1 },
  { id: '3', collaborator: 'Fatou D.', type: 'Maladie', typeColor: 'bg-red-500', startDate: '01/04/2026', endDate: '03/04/2026', reason: 'Certificat médical fourni', status: 'approved', days: 3 },
  { id: '4', collaborator: 'Mamadou T.', type: 'Sans solde', typeColor: 'bg-gray-500', startDate: '20/03/2026', endDate: '21/03/2026', reason: 'Raison personnelle', status: 'approved', days: 2 },
  { id: '5', collaborator: 'Mohamed K.', type: 'Congés payés', typeColor: 'bg-blue-500', startDate: '05/03/2026', endDate: '08/03/2026', reason: '', status: 'rejected', days: 4 },
];

export default function IndisponibilitesPage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = mockData.filter(u => {
    if (filter !== 'all' && u.status !== filter) return false;
    if (search && !u.collaborator.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Indisponibilités</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
          <Plus size={16} /> Nouvelle indisponibilité
        </button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un collaborateur..." className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex gap-2">
          {[{ key: 'all', label: 'Toutes' }, { key: 'pending', label: 'En attente' }, { key: 'approved', label: 'Approuvées' }, { key: 'rejected', label: 'Refusées' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1 text-xs rounded-full border ${filter === f.key ? 'bg-primary-500 text-white border-primary-500' : 'border-border text-muted'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase">Collaborateur</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase hidden md:table-cell">Dates</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase hidden md:table-cell">Jours</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase">Statut</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const cfg = statusConfig[u.status];
              return (
                <tr key={u.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{u.collaborator}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-sm">
                      <span className={`w-3 h-3 rounded-full ${u.typeColor}`} />
                      {u.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-muted flex items-center gap-1">
                      <Calendar size={14} /> {u.startDate} — {u.endDate}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm font-medium">{u.days}j</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.status === 'pending' && (
                      <div className="flex items-center gap-1 justify-end">
                        <button className="text-xs px-2 py-1 bg-success text-white rounded hover:bg-green-600">Approuver</button>
                        <button className="text-xs px-2 py-1 bg-danger text-white rounded hover:bg-red-600">Refuser</button>
                      </div>
                    )}
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
