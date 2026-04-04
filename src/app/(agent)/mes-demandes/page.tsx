'use client';

import React, { useState } from 'react';
import { Plus, X, Calendar, Clock, ChevronRight } from 'lucide-react';

interface LeaveRequest {
  id: string;
  type: string;
  typeColor: string;
  dateFrom: string;
  dateTo: string;
  motif: string;
  status: 'en-attente' | 'approuvee' | 'refusee';
}

const mockRequests: LeaveRequest[] = [
  {
    id: '1',
    type: 'Congés payés',
    typeColor: 'bg-blue-100 text-blue-700',
    dateFrom: '2026-04-20',
    dateTo: '2026-04-24',
    motif: 'Vacances familiales',
    status: 'en-attente',
  },
  {
    id: '2',
    type: 'RTT',
    typeColor: 'bg-purple-100 text-purple-700',
    dateFrom: '2026-03-15',
    dateTo: '2026-03-15',
    motif: 'Rendez-vous médical',
    status: 'approuvee',
  },
  {
    id: '3',
    type: 'Congé maladie',
    typeColor: 'bg-red-100 text-red-700',
    dateFrom: '2026-02-10',
    dateTo: '2026-02-12',
    motif: 'Grippe',
    status: 'refusee',
  },
];

const leaveTypes = [
  'Congés payés',
  'RTT',
  'Congé maladie',
  'Congé sans solde',
  'Congé exceptionnel',
  'Récupération',
];

const statusConfig = {
  'en-attente': { label: 'En attente', bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  approuvee: { label: 'Approuvée', bg: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  refusee: { label: 'Refusée', bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export default function MesDemandesPage() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState(mockRequests);
  const [newRequest, setNewRequest] = useState({
    type: 'Congés payés',
    dateFrom: '',
    dateTo: '',
    motif: '',
  });

  // Leave balance
  const balance = { acquis: 25, pris: 12, restants: 13 };
  const balancePercent = (balance.pris / balance.acquis) * 100;

  const handleSubmit = () => {
    const req: LeaveRequest = {
      id: Date.now().toString(),
      type: newRequest.type,
      typeColor: 'bg-blue-100 text-blue-700',
      dateFrom: newRequest.dateFrom,
      dateTo: newRequest.dateTo,
      motif: newRequest.motif,
      status: 'en-attente',
    };
    setRequests((prev) => [req, ...prev]);
    setNewRequest({ type: 'Congés payés', dateFrom: '', dateTo: '', motif: '' });
    setShowForm(false);
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">Mes demandes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl active:scale-[0.97] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle demande
        </button>
      </div>

      {/* Leave balance card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Solde de congés</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-700">{balance.acquis}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Acquis</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{balance.pris}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Pris</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{balance.restants}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Restants</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-500 h-2.5 rounded-full transition-all"
            style={{ width: `${balancePercent}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right">
          {balance.pris}/{balance.acquis} jours utilisés
        </p>
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {requests.map((req) => {
          const sc = statusConfig[req.status];
          return (
            <div
              key={req.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${req.typeColor}`}>
                      {req.type}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${sc.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {formatDate(req.dateFrom)}
                      {req.dateFrom !== req.dateTo && ` → ${formatDate(req.dateTo)}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{req.motif}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 mt-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* New request form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-900">Nouvelle demande</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Type de demande
                </label>
                <select
                  value={newRequest.type}
                  onChange={(e) =>
                    setNewRequest((p) => ({ ...p, type: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {leaveTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date from */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Date du
                </label>
                <input
                  type="date"
                  value={newRequest.dateFrom}
                  onChange={(e) =>
                    setNewRequest((p) => ({ ...p, dateFrom: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              {/* Date to */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Date au
                </label>
                <input
                  type="date"
                  value={newRequest.dateTo}
                  onChange={(e) =>
                    setNewRequest((p) => ({ ...p, dateTo: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              {/* Motif */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Motif
                </label>
                <textarea
                  value={newRequest.motif}
                  onChange={(e) =>
                    setNewRequest((p) => ({ ...p, motif: e.target.value }))
                  }
                  placeholder="Précisez le motif de votre demande..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!newRequest.dateFrom || !newRequest.dateTo}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-bold rounded-xl active:scale-[0.98] transition-all"
              >
                Envoyer la demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
