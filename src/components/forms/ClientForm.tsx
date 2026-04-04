'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Info, MapPin, Briefcase, Save, Upload } from 'lucide-react';

interface ClientFormData {
  type: string;
  nom: string;
  logo: File | null;
  siret: string;
  tva: string;
  email: string;
  telephone: string;
  identifiant: string;
  pays: string;
  codePostal: string;
  ville: string;
  adresse: string;
  complement: string;
  bonCommande: string;
  remiseType: string;
  remiseValeur: string;
  commentaires: string;
  coordonneesFactor: string;
}

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
}

const defaultData: ClientFormData = {
  type: 'Entreprise',
  nom: '',
  logo: null,
  siret: '',
  tva: '',
  email: '',
  telephone: '',
  identifiant: '',
  pays: 'France',
  codePostal: '',
  ville: '',
  adresse: '',
  complement: '',
  bonCommande: '',
  remiseType: '€',
  remiseValeur: '',
  commentaires: '',
  coordonneesFactor: '',
};

const formTabs = [
  { id: 'general', label: 'Général', icon: <Info size={16} /> },
  { id: 'adresse', label: 'Adresse', icon: <MapPin size={16} /> },
  { id: 'commercial', label: 'Commercial', icon: <Briefcase size={16} /> },
];

const clientTypes = ['Entreprise', 'Particulier', 'Association', 'Organisme public', 'Prospect', 'Sous-traitance'];

function generateId() {
  return 'CLI-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ClientForm({ isOpen, onClose, onSave, initialData }: ClientFormProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState<ClientFormData>({ ...defaultData, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultData, ...initialData, identifiant: initialData?.identifiant || generateId() });
      setErrors({});
      setActiveTab('general');
    }
  }, [isOpen, initialData]);

  const update = useCallback((field: keyof ClientFormData, value: string | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.nom.trim()) errs.nom = 'Le nom est requis';
    if (!form.email.trim()) errs.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email invalide';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      if (errors.nom || errors.email) setActiveTab('general');
      return;
    }
    onSave?.(form);
  };

  if (!isOpen) return null;

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none';
  const labelClass = 'block text-sm font-medium text-muted mb-1';
  const errorClass = 'text-xs text-danger mt-1';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full h-full lg:w-[90%] lg:h-[90%] lg:rounded-xl lg:shadow-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary-500 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold text-lg">{initialData?.nom ? 'Modifier le client' : 'Nouveau client'}</h2>
          <button onClick={onClose} className="p-1 bg-white/20 rounded hover:bg-white/30"><X size={18} /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left tabs */}
          <div className="w-52 bg-gray-50 border-r border-border flex-shrink-0 hidden lg:block">
            {formTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-600 border-l-3 border-primary-500 font-medium' : 'text-muted hover:bg-gray-100'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden flex border-b border-border overflow-x-auto flex-shrink-0 absolute top-[53px] left-0 right-0 bg-white z-10">
            {formTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-500' : 'text-muted border-b-2 border-transparent'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-14 lg:pt-6">
            {activeTab === 'general' && (
              <div className="relative max-w-2xl">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-200" />
                <div className="space-y-8">
                  <div className="relative pl-12">
                    <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><Info size={16} /></div>
                    <h3 className="text-base font-semibold mb-4">Informations générales</h3>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Type</label>
                        <select value={form.type} onChange={e => update('type', e.target.value)} className={inputClass}>
                          {clientTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Nom *</label>
                        <input value={form.nom} onChange={e => update('nom', e.target.value)} placeholder="Nom du client" className={`${inputClass} ${errors.nom ? 'border-danger' : ''}`} />
                        {errors.nom && <p className={errorClass}>{errors.nom}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Logo</label>
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload size={18} className="text-muted" />
                          <span className="text-sm text-muted">{form.logo ? form.logo.name : 'Choisir un fichier'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => update('logo', e.target.files?.[0] || null)} />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>SIRET</label>
                          <input value={form.siret} onChange={e => update('siret', e.target.value)} placeholder="N° SIRET" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>N° TVA</label>
                          <input value={form.tva} onChange={e => update('tva', e.target.value)} placeholder="N° TVA intracommunautaire" className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Email *</label>
                          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@exemple.fr" className={`${inputClass} ${errors.email ? 'border-danger' : ''}`} />
                          {errors.email && <p className={errorClass}>{errors.email}</p>}
                        </div>
                        <div>
                          <label className={labelClass}>Téléphone</label>
                          <input value={form.telephone} onChange={e => update('telephone', e.target.value)} placeholder="01 23 45 67 89" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Identifiant</label>
                        <input value={form.identifiant} onChange={e => update('identifiant', e.target.value)} className={inputClass} />
                        <p className="text-xs text-muted mt-1">Généré automatiquement si laissé vide</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adresse' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold mb-4">Adresse</h3>
                <div>
                  <label className={labelClass}>Pays</label>
                  <input value={form.pays} onChange={e => update('pays', e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Code postal *</label>
                    <input value={form.codePostal} onChange={e => update('codePostal', e.target.value)} placeholder="75001" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ville *</label>
                    <input value={form.ville} onChange={e => update('ville', e.target.value)} placeholder="Paris" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Adresse *</label>
                  <input value={form.adresse} onChange={e => update('adresse', e.target.value)} placeholder="Numéro et nom de rue" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Complément</label>
                  <input value={form.complement} onChange={e => update('complement', e.target.value)} placeholder="Bâtiment, étage, etc." className={inputClass} />
                </div>
              </div>
            )}

            {activeTab === 'commercial' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold mb-4">Informations commerciales</h3>
                <div>
                  <label className={labelClass}>N° bon de commande</label>
                  <input value={form.bonCommande} onChange={e => update('bonCommande', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Remise</label>
                  <div className="flex gap-2">
                    <select value={form.remiseType} onChange={e => update('remiseType', e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none w-20">
                      <option value="€">€</option>
                      <option value="%">%</option>
                    </select>
                    <input type="number" value={form.remiseValeur} onChange={e => update('remiseValeur', e.target.value)} placeholder="0" className={`flex-1 ${inputClass}`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Commentaires</label>
                  <textarea value={form.commentaires} onChange={e => update('commentaires', e.target.value)} rows={4} placeholder="Notes internes..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Coordonnées FACTOR</label>
                  <textarea value={form.coordonneesFactor} onChange={e => update('coordonneesFactor', e.target.value)} rows={3} placeholder="Coordonnées bancaires..." className={inputClass} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 flex items-center justify-end bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:bg-gray-100 rounded-lg">Annuler</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600">
              <Save size={18} /> ENREGISTRER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
