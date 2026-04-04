'use client';

import { useState } from 'react';
import {
  Plus, Edit, Trash2, X, Clock, Calculator, Save
} from 'lucide-react';

type Frequency = 'quotidienne' | 'hebdomadaire' | 'mensuelle' | 'ponctuelle';
type BillingMode = 'forfait' | 'horaire' | 'surface';

interface Operation {
  id: string;
  nom: string;
  surface: number;
  rendement: number;
  dureeAnnexe: number;
}

interface PrestationType {
  id: string;
  nom: string;
  frequence: Frequency;
  facturation: BillingMode;
  postes: number;
  operations: Operation[];
  dureeCalculee: number;
}

const frequencyLabels: Record<Frequency, string> = {
  quotidienne: 'Quotidienne',
  hebdomadaire: 'Hebdomadaire',
  mensuelle: 'Mensuelle',
  ponctuelle: 'Ponctuelle',
};

const billingLabels: Record<BillingMode, string> = {
  forfait: 'Forfait',
  horaire: 'Horaire',
  surface: 'Au m\u00b2',
};

const calcDuration = (ops: Operation[]): number => {
  return ops.reduce((total, op) => {
    const dureeOperation = op.rendement > 0 ? (op.surface / op.rendement) * 60 : 0;
    return total + dureeOperation + op.dureeAnnexe;
  }, 0);
};

const mockPrestations: PrestationType[] = [
  {
    id: 'pt-1',
    nom: 'Entretien courant bureaux',
    frequence: 'quotidienne',
    facturation: 'forfait',
    postes: 2,
    operations: [
      { id: 'op-1', nom: 'Aspiration sols', surface: 500, rendement: 300, dureeAnnexe: 10 },
      { id: 'op-2', nom: 'Lavage sols', surface: 500, rendement: 200, dureeAnnexe: 15 },
      { id: 'op-3', nom: 'Dépoussiérage mobilier', surface: 200, rendement: 150, dureeAnnexe: 5 },
    ],
    dureeCalculee: 0,
  },
  {
    id: 'pt-2',
    nom: 'Nettoyage vitres',
    frequence: 'mensuelle',
    facturation: 'surface',
    postes: 1,
    operations: [
      { id: 'op-4', nom: 'Lavage vitres intérieures', surface: 120, rendement: 40, dureeAnnexe: 20 },
      { id: 'op-5', nom: 'Lavage vitres extérieures', surface: 120, rendement: 30, dureeAnnexe: 30 },
    ],
    dureeCalculee: 0,
  },
  {
    id: 'pt-3',
    nom: 'Remise en état après travaux',
    frequence: 'ponctuelle',
    facturation: 'horaire',
    postes: 3,
    operations: [
      { id: 'op-6', nom: 'Déblaiement gravats', surface: 100, rendement: 50, dureeAnnexe: 30 },
      { id: 'op-7', nom: 'Nettoyage intensif sols', surface: 100, rendement: 80, dureeAnnexe: 20 },
      { id: 'op-8', nom: 'Nettoyage surfaces', surface: 200, rendement: 100, dureeAnnexe: 15 },
    ],
    dureeCalculee: 0,
  },
];

// Pre-calculate durations
mockPrestations.forEach(p => {
  p.dureeCalculee = calcDuration(p.operations);
});

export default function PrestationsTypesPage() {
  const [prestations, setPrestations] = useState(mockPrestations);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [formNom, setFormNom] = useState('');
  const [formFreq, setFormFreq] = useState<Frequency>('quotidienne');
  const [formBilling, setFormBilling] = useState<BillingMode>('forfait');
  const [formPostes, setFormPostes] = useState(1);
  const [formOps, setFormOps] = useState<Operation[]>([
    { id: 'new-op-1', nom: '', surface: 0, rendement: 0, dureeAnnexe: 0 },
  ]);

  const openCreate = () => {
    setEditId(null);
    setFormNom('');
    setFormFreq('quotidienne');
    setFormBilling('forfait');
    setFormPostes(1);
    setFormOps([{ id: 'new-op-1', nom: '', surface: 0, rendement: 0, dureeAnnexe: 0 }]);
    setShowForm(true);
  };

  const openEdit = (p: PrestationType) => {
    setEditId(p.id);
    setFormNom(p.nom);
    setFormFreq(p.frequence);
    setFormBilling(p.facturation);
    setFormPostes(p.postes);
    setFormOps([...p.operations]);
    setShowForm(true);
  };

  const addOperation = () => {
    setFormOps(prev => [...prev, { id: `new-op-${Date.now()}`, nom: '', surface: 0, rendement: 0, dureeAnnexe: 0 }]);
  };

  const removeOperation = (id: string) => {
    setFormOps(prev => prev.filter(o => o.id !== id));
  };

  const updateOperation = (id: string, field: keyof Operation, value: string | number) => {
    setFormOps(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const formDuration = calcDuration(formOps);

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Types de prestations</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle prestation
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Nom</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Fréquence</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Facturation</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Postes</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Durée calculée</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prestations.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{p.nom}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {frequencyLabels[p.frequence]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {billingLabels[p.facturation]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-foreground">{p.postes}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-sm text-foreground">
                      <Clock className="w-3.5 h-3.5 text-muted" />
                      {formatDuration(p.dureeCalculee)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-surface rounded-card shadow-modal p-6 w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {editId ? 'Modifier la prestation' : 'Nouvelle prestation'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nom</label>
                  <input
                    type="text"
                    value={formNom}
                    onChange={(e) => setFormNom(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Nom de la prestation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Postes</label>
                  <input
                    type="number"
                    value={formPostes}
                    onChange={(e) => setFormPostes(Number(e.target.value))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Fréquence</label>
                  <select
                    value={formFreq}
                    onChange={(e) => setFormFreq(e.target.value as Frequency)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {Object.entries(frequencyLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Mode de facturation</label>
                  <select
                    value={formBilling}
                    onChange={(e) => setFormBilling(e.target.value as BillingMode)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {Object.entries(billingLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Operations Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-foreground">Opérations</label>
                  <button
                    onClick={addOperation}
                    className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-border">
                        <th className="text-left px-3 py-2 text-xs font-semibold text-muted">Nom</th>
                        <th className="text-center px-3 py-2 text-xs font-semibold text-muted">Surface (m\u00b2)</th>
                        <th className="text-center px-3 py-2 text-xs font-semibold text-muted">Rendement (m\u00b2/h)</th>
                        <th className="text-center px-3 py-2 text-xs font-semibold text-muted">Durée annexe (min)</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formOps.map(op => (
                        <tr key={op.id} className="border-b border-border last:border-0">
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={op.nom}
                              onChange={(e) => updateOperation(op.id, 'nom', e.target.value)}
                              className="w-full border border-border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                              placeholder="Nom de l'opération"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={op.surface}
                              onChange={(e) => updateOperation(op.id, 'surface', Number(e.target.value))}
                              className="w-full border border-border rounded px-2 py-1 text-sm text-center focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={op.rendement}
                              onChange={(e) => updateOperation(op.id, 'rendement', Number(e.target.value))}
                              className="w-full border border-border rounded px-2 py-1 text-sm text-center focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={op.dureeAnnexe}
                              onChange={(e) => updateOperation(op.id, 'dureeAnnexe', Number(e.target.value))}
                              className="w-full border border-border rounded px-2 py-1 text-sm text-center focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {formOps.length > 1 && (
                              <button onClick={() => removeOperation(op.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Auto-calculated duration */}
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                <Calculator className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Durée calculée automatiquement</p>
                  <p className="text-xs text-primary-700">
                    Formule : (surface / rendement) x 60 + durée annexe par opération
                  </p>
                </div>
                <span className="ml-auto text-lg font-bold text-primary-700">{formatDuration(formDuration)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border text-muted hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
