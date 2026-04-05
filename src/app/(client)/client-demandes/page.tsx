'use client';

import { useState } from 'react';
import {
  MessageSquarePlus,
  Plus,
  X,
  Send,
  Clock,
  Loader2,
  CheckCircle2,
  MessageSquare,
  MapPin,
  Calendar,
  Tag,
} from 'lucide-react';

type DemandeStatut = 'En attente' | 'En cours' | 'Résolu';
type DemandeType = 'Réclamation' | 'Demande de prestation' | 'Information' | 'Signalement' | 'Modification planning';

interface Demande {
  id: number;
  type: DemandeType;
  sujet: string;
  description: string;
  site: string;
  date: string;
  statut: DemandeStatut;
}

const statutConfig: Record<DemandeStatut, { bg: string; text: string; icon: typeof Clock }> = {
  'En attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  'En cours': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Loader2 },
  'Résolu': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
};

const typeConfig: Record<DemandeType, { bg: string; text: string }> = {
  'Réclamation': { bg: 'bg-red-100', text: 'text-red-800' },
  'Demande de prestation': { bg: 'bg-teal-100', text: 'text-teal-800' },
  'Information': { bg: 'bg-gray-100', text: 'text-gray-800' },
  'Signalement': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Modification planning': { bg: 'bg-purple-100', text: 'text-purple-800' },
};

const demandTypes: DemandeType[] = [
  'Réclamation',
  'Demande de prestation',
  'Information',
  'Signalement',
  'Modification planning',
];

const clientSites = [
  'Siège Social - La Défense',
  'Entrepôt Logistique - Gennevilliers',
  'Boutique Centre-Ville - Paris 8e',
];

const mockDemandes: Demande[] = [
  {
    id: 1,
    type: 'Réclamation',
    sujet: 'Qualité nettoyage sanitaires 3e étage',
    description: 'Les sanitaires du 3e étage n\'ont pas été correctement nettoyés lors des deux derniers passages. Traces de calcaire persistantes sur les robinets et miroirs.',
    site: 'Siège Social - La Défense',
    date: '2026-04-03',
    statut: 'En cours',
  },
  {
    id: 2,
    type: 'Demande de prestation',
    sujet: 'Nettoyage exceptionnel après travaux',
    description: 'Des travaux de peinture sont prévus du 14 au 16 avril dans nos bureaux. Nous souhaiterions un nettoyage complet après la fin des travaux le 17 avril.',
    site: 'Boutique Centre-Ville - Paris 8e',
    date: '2026-04-01',
    statut: 'En attente',
  },
  {
    id: 3,
    type: 'Modification planning',
    sujet: 'Décalage horaire prestation du vendredi',
    description: 'Nous souhaiterions décaler la prestation du vendredi de 06h-09h à 07h-10h en raison d\'une réunion matinale récurrente dans la salle principale.',
    site: 'Siège Social - La Défense',
    date: '2026-03-28',
    statut: 'Résolu',
  },
];

export default function ClientDemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>(mockDemandes);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: '' as DemandeType | '',
    sujet: '',
    description: '',
    site: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.sujet || !formData.description || !formData.site) return;

    const newDemande: Demande = {
      id: demandes.length + 1,
      type: formData.type as DemandeType,
      sujet: formData.sujet,
      description: formData.description,
      site: formData.site,
      date: new Date().toISOString().split('T')[0],
      statut: 'En attente',
    };

    setDemandes([newDemande, ...demandes]);
    setFormData({ type: '', sujet: '', description: '', site: '' });
    setShowModal(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquarePlus className="h-6 w-6 text-teal-600" />
            Mes demandes
          </h1>
          <p className="text-gray-500 mt-1">
            Soumettez et suivez vos demandes
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle demande
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {demandes.filter((d) => d.statut === 'En attente').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">En attente</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {demandes.filter((d) => d.statut === 'En cours').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">En cours</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {demandes.filter((d) => d.statut === 'Résolu').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Résolues</p>
        </div>
      </div>

      {/* Requests List */}
      {demandes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune demande pour le moment</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Créer votre première demande
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {demandes.map((demande) => {
            const sConfig = statutConfig[demande.statut];
            const tConfig = typeConfig[demande.type];
            const StatutIcon = sConfig.icon;
            return (
              <div
                key={demande.id}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${tConfig.bg} ${tConfig.text}`}>
                        {demande.type}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sConfig.bg} ${sConfig.text}`}>
                        <StatutIcon className="h-3 w-3" />
                        {demande.statut}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {demande.sujet}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {demande.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {demande.site}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {demande.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Nouvelle demande
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-gray-400" />
                    Type de demande
                  </span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as DemandeType })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un type</option>
                  {demandTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Site */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    Site concerné
                  </span>
                </label>
                <select
                  value={formData.site}
                  onChange={(e) =>
                    setFormData({ ...formData, site: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un site</option>
                  {clientSites.map((site) => (
                    <option key={site} value={site}>
                      {site}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sujet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={formData.sujet}
                  onChange={(e) =>
                    setFormData({ ...formData, sujet: e.target.value })
                  }
                  required
                  placeholder="Résumé de votre demande"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Décrivez votre demande en détail..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
