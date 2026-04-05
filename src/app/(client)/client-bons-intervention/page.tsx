'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Download,
  FileDown,
  Eye,
  X,
  MapPin,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

type BonStatut = 'Terminé' | 'En cours' | 'Planifié' | 'Annulé';

interface BonIntervention {
  id: number;
  reference: string;
  site: string;
  agent: string;
  date: string;
  description: string;
  statut: BonStatut;
  details: {
    type_intervention: string;
    duree: string;
    observations: string;
    materiels: string[];
    signature_agent: boolean;
    signature_client: boolean;
  };
}

const statutConfig: Record<BonStatut, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  'Terminé': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
  'En cours': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
  'Planifié': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Calendar },
  'Annulé': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
};

const mockBons: BonIntervention[] = [
  {
    id: 1,
    reference: 'BI-2026-0412',
    site: 'Siège Social - La Défense',
    agent: 'M. Traoré',
    date: '2026-04-04',
    description: 'Shampoing moquette salle de réunion principale - intervention trimestrielle',
    statut: 'Terminé',
    details: {
      type_intervention: 'Nettoyage spécialisé',
      duree: '3h00',
      observations: 'Taches anciennes sur la moquette près de l\'entrée. Traitement spécifique appliqué avec produit détachant. Résultat satisfaisant, légère trace résiduelle signalée au client.',
      materiels: ['Injecteur-extracteur Kärcher', 'Produit shampoing moquette Ecolabel', 'Détachant professionnel'],
      signature_agent: true,
      signature_client: true,
    },
  },
  {
    id: 2,
    reference: 'BI-2026-0398',
    site: 'Entrepôt Logistique - Gennevilliers',
    agent: 'M. Ndiaye',
    date: '2026-04-03',
    description: 'Décapage et remise en cire du sol zone de réception',
    statut: 'Terminé',
    details: {
      type_intervention: 'Remise en état de sol',
      duree: '5h00',
      observations: 'Sol décapé sur 120m2. Application de 3 couches de cire métallisée. Temps de séchage respecté entre chaque couche. Zone balisée pendant les travaux.',
      materiels: ['Monobrosse haute vitesse', 'Décapant professionnel', 'Cire métallisée auto-brillante', 'Balises de sécurité'],
      signature_agent: true,
      signature_client: true,
    },
  },
  {
    id: 3,
    reference: 'BI-2026-0415',
    site: 'Boutique Centre-Ville - Paris 8e',
    agent: 'Mme Camara',
    date: '2026-04-08',
    description: 'Nettoyage vitrerie extérieure complète - intervention mensuelle',
    statut: 'Planifié',
    details: {
      type_intervention: 'Vitrerie',
      duree: '2h00 (estimé)',
      observations: 'Intervention planifiée. Accès nacelle non nécessaire (RDC). Vérification météo à J-1.',
      materiels: ['Kit vitrerie professionnel', 'Perche télescopique', 'Produit vitre Ecolabel'],
      signature_agent: false,
      signature_client: false,
    },
  },
  {
    id: 4,
    reference: 'BI-2026-0401',
    site: 'Siège Social - La Défense',
    agent: 'Mme Diallo',
    date: '2026-04-01',
    description: 'Désinfection complète des sanitaires suite à signalement hygiène',
    statut: 'Terminé',
    details: {
      type_intervention: 'Désinfection',
      duree: '2h30',
      observations: 'Désinfection réalisée sur les 4 blocs sanitaires (étages 1 à 4). Utilisation de produit virucide certifié EN 14476. Contrôle bactériologique prévu à J+3.',
      materiels: ['Produit virucide EN 14476', 'Pulvérisateur', 'EPI complets', 'Kit de prélèvement contrôle'],
      signature_agent: true,
      signature_client: true,
    },
  },
];

export default function ClientBonsInterventionPage() {
  const [selectedBon, setSelectedBon] = useState<BonIntervention | null>(null);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-teal-600" />
          Bons d&apos;intervention
        </h1>
        <p className="text-gray-500 mt-1">
          Consultez les bons d&apos;intervention réalisés sur vos sites
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Référence</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Site</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockBons.map((bon) => {
              const config = statutConfig[bon.statut];
              return (
                <tr key={bon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium text-teal-700">{bon.reference}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{bon.site}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-700">{bon.agent}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{bon.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{bon.description}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                      {bon.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBon(bon)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-teal-700 transition-colors"
                        title="Voir le détail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-teal-700 transition-colors"
                        title="Télécharger le PDF"
                      >
                        <FileDown className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {mockBons.map((bon) => {
          const config = statutConfig[bon.statut];
          return (
            <div
              key={bon.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-mono font-medium text-teal-700">{bon.reference}</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                  {bon.statut}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {bon.site}
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  {bon.agent}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  {bon.date}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">{bon.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBon(bon)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  Voir
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                  PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedBon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Bon d&apos;intervention {selectedBon.reference}
                </h2>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statutConfig[selectedBon.statut].bg} ${statutConfig[selectedBon.statut].text}`}>
                  {selectedBon.statut}
                </span>
              </div>
              <button
                onClick={() => setSelectedBon(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Site</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    {selectedBon.site}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agent</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-teal-600" />
                    {selectedBon.agent}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    {selectedBon.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type d&apos;intervention</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedBon.details.type_intervention}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Durée</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-teal-600" />
                    {selectedBon.details.duree}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedBon.description}</p>
              </div>

              {/* Observations */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Observations</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                  {selectedBon.details.observations}
                </p>
              </div>

              {/* Matériels */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Matériels utilisés</p>
                <ul className="space-y-1">
                  {selectedBon.details.materiels.map((m, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signatures */}
              <div className="flex gap-4 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {selectedBon.details.signature_agent ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span className="text-sm text-gray-600">Signature agent</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedBon.details.signature_client ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span className="text-sm text-gray-600">Signature client</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedBon(null)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Fermer
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors">
                <FileDown className="h-4 w-4" />
                Télécharger le PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
