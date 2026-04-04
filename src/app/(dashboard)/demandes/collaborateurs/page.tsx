'use client';

import { useState } from 'react';
import {
  Calendar, Clock, User, CheckCircle, XCircle,
  Filter, MessageSquare, AlertCircle
} from 'lucide-react';

type LeaveType = 'conges_payes' | 'maladie' | 'sans_solde' | 'evenement_familial';
type RequestStatus = 'en_attente' | 'approuvee' | 'refusee';

interface LeaveRequest {
  id: string;
  collaborateur: string;
  photo: string;
  type: LeaveType;
  dateDebut: string;
  dateFin: string;
  nbJours: number;
  motif: string;
  statut: RequestStatus;
  dateCreation: string;
}

const mockRequests: LeaveRequest[] = [
  {
    id: 'dem-001',
    collaborateur: 'Marie Dubois',
    photo: 'MD',
    type: 'conges_payes',
    dateDebut: '2026-04-15',
    dateFin: '2026-04-22',
    nbJours: 5,
    motif: 'Vacances familiales',
    statut: 'en_attente',
    dateCreation: '2026-03-28',
  },
  {
    id: 'dem-002',
    collaborateur: 'Jean-Pierre Martin',
    photo: 'JM',
    type: 'maladie',
    dateDebut: '2026-04-01',
    dateFin: '2026-04-03',
    nbJours: 3,
    motif: 'Certificat médical fourni',
    statut: 'approuvee',
    dateCreation: '2026-03-31',
  },
  {
    id: 'dem-003',
    collaborateur: 'Fatima Benali',
    photo: 'FB',
    type: 'evenement_familial',
    dateDebut: '2026-05-10',
    dateFin: '2026-05-12',
    nbJours: 3,
    motif: 'Mariage de ma fille',
    statut: 'en_attente',
    dateCreation: '2026-03-25',
  },
  {
    id: 'dem-004',
    collaborateur: 'Karim Zidane',
    photo: 'KZ',
    type: 'sans_solde',
    dateDebut: '2026-06-01',
    dateFin: '2026-06-14',
    nbJours: 10,
    motif: 'Voyage à l\'étranger',
    statut: 'refusee',
    dateCreation: '2026-03-15',
  },
  {
    id: 'dem-005',
    collaborateur: 'Sophie Laurent',
    photo: 'SL',
    type: 'conges_payes',
    dateDebut: '2026-04-28',
    dateFin: '2026-04-30',
    nbJours: 3,
    motif: 'Pont du 1er mai',
    statut: 'en_attente',
    dateCreation: '2026-04-01',
  },
  {
    id: 'dem-006',
    collaborateur: 'Thomas Petit',
    photo: 'TP',
    type: 'maladie',
    dateDebut: '2026-03-20',
    dateFin: '2026-03-21',
    nbJours: 2,
    motif: 'Grippe',
    statut: 'approuvee',
    dateCreation: '2026-03-20',
  },
];

const leaveTypeConfig: Record<LeaveType, { label: string; color: string }> = {
  conges_payes: { label: 'Congés payés', color: 'bg-blue-100 text-blue-800' },
  maladie: { label: 'Maladie', color: 'bg-red-100 text-red-800' },
  sans_solde: { label: 'Sans solde', color: 'bg-gray-100 text-gray-800' },
  evenement_familial: { label: 'Événement familial', color: 'bg-purple-100 text-purple-800' },
};

const statusConfig: Record<RequestStatus, { label: string; color: string }> = {
  en_attente: { label: 'En attente', color: 'bg-amber-100 text-amber-800' },
  approuvee: { label: 'Approuvée', color: 'bg-green-100 text-green-800' },
  refusee: { label: 'Refusée', color: 'bg-red-100 text-red-800' },
};

type FilterTab = 'toutes' | 'en_attente' | 'approuvee' | 'refusee';

export default function DemandesCollaborateursPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('toutes');
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approuver' | 'refuser' | null>(null);
  const [comment, setComment] = useState('');
  const [requests, setRequests] = useState(mockRequests);

  const pendingCount = requests.filter(r => r.statut === 'en_attente').length;

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'toutes') return true;
    return r.statut === activeTab;
  });

  const handleAction = (id: string, type: 'approuver' | 'refuser') => {
    setActionId(id);
    setActionType(type);
    setComment('');
  };

  const confirmAction = () => {
    if (!actionId || !actionType) return;
    setRequests(prev =>
      prev.map(r =>
        r.id === actionId
          ? { ...r, statut: actionType === 'approuver' ? 'approuvee' as RequestStatus : 'refusee' as RequestStatus }
          : r
      )
    );
    setActionId(null);
    setActionType(null);
    setComment('');
  };

  const tabs: { key: FilterTab; label: string; color: string }[] = [
    { key: 'toutes', label: 'Toutes', color: 'bg-primary-500 text-white' },
    { key: 'en_attente', label: 'En attente', color: 'bg-amber-500 text-white' },
    { key: 'approuvee', label: 'Approuvées', color: 'bg-green-500 text-white' },
    { key: 'refusee', label: 'Refusées', color: 'bg-red-500 text-white' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Demandes collaborateurs</h1>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {pendingCount} en attente
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? tab.color
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.key === 'en_attente' && pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/30">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Collaborateur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Dates</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Nb jours</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Motif</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Statut</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                        {req.photo}
                      </div>
                      <span className="text-sm font-medium text-foreground">{req.collaborateur}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${leaveTypeConfig[req.type].color}`}>
                      {leaveTypeConfig[req.type].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    <div>Du {new Date(req.dateDebut).toLocaleDateString('fr-FR')}</div>
                    <div className="text-muted">Au {new Date(req.dateFin).toLocaleDateString('fr-FR')}</div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-foreground">{req.nbJours}</td>
                  <td className="px-4 py-3 text-sm text-muted max-w-[200px] truncate">{req.motif}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[req.statut].color}`}>
                      {statusConfig[req.statut].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {req.statut === 'en_attente' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAction(req.id, 'approuver')}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'refuser')}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Refuser"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {actionId && actionType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface rounded-card shadow-modal p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {actionType === 'approuver' ? 'Approuver la demande' : 'Refuser la demande'}
            </h3>
            <p className="text-sm text-muted mb-4">
              {requests.find(r => r.id === actionId)?.collaborateur} — {leaveTypeConfig[requests.find(r => r.id === actionId)!.type].label}
            </p>
            <label className="block text-sm font-medium text-foreground mb-1">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="Ajouter un commentaire..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setActionId(null); setActionType(null); }}
                className="px-4 py-2 text-sm rounded-lg border border-border text-muted hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-sm rounded-lg text-white transition-colors ${
                  actionType === 'approuver'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approuver' ? 'Approuver' : 'Refuser'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
