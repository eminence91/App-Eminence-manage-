'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, User, Heart, MapPin, Briefcase, Save, Upload } from 'lucide-react';

interface CollaborateurFormData {
  type: string;
  photo: File | null;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  genre: string;
  dateNaissance: string;
  villeNaissance: string;
  nationalite: string;
  numeroSecu: string;
  pays: string;
  codePostal: string;
  ville: string;
  adresse: string;
  matricule: string;
  dateAnciennete: string;
  licenceTerrain: boolean;
}

interface CollaborateurFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: CollaborateurFormData) => void;
  initialData?: Partial<CollaborateurFormData>;
}

const defaultData: CollaborateurFormData = {
  type: 'Agent de propreté',
  photo: null,
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  genre: '',
  dateNaissance: '',
  villeNaissance: '',
  nationalite: 'Française',
  numeroSecu: '',
  pays: 'France',
  codePostal: '',
  ville: '',
  adresse: '',
  matricule: '',
  dateAnciennete: '',
  licenceTerrain: false,
};

const formTabs = [
  { id: 'personnel', label: 'Personnel', icon: <User size={16} /> },
  { id: 'etatcivil', label: 'État civil', icon: <Heart size={16} /> },
  { id: 'adresse', label: 'Adresse', icon: <MapPin size={16} /> },
  { id: 'professionnel', label: 'Professionnel', icon: <Briefcase size={16} /> },
];

const collaborateurTypes = ['Agent de propreté', 'Chef d\'équipe', 'Inspecteur', 'Administratif', 'Responsable de secteur'];

function generateMatricule() {
  return 'COL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CollaborateurForm({ isOpen, onClose, onSave, initialData }: CollaborateurFormProps) {
  const [activeTab, setActiveTab] = useState('personnel');
  const [form, setForm] = useState<CollaborateurFormData>({ ...defaultData, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultData, ...initialData, matricule: initialData?.matricule || generateMatricule() });
      setErrors({});
      setActiveTab('personnel');
    }
  }, [isOpen, initialData]);

  const update = useCallback((field: keyof CollaborateurFormData, value: string | boolean | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.prenom.trim()) errs.prenom = 'Le prénom est requis';
    if (!form.nom.trim()) errs.nom = 'Le nom est requis';
    if (!form.email.trim()) errs.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email invalide';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setActiveTab('personnel');
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
          <h2 className="font-semibold text-lg">{initialData?.nom ? 'Modifier le collaborateur' : 'Nouveau collaborateur'}</h2>
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
            {activeTab === 'personnel' && (
              <div className="relative max-w-2xl">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-200" />
                <div className="space-y-8">
                  <div className="relative pl-12">
                    <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><User size={16} /></div>
                    <h3 className="text-base font-semibold mb-4">Informations personnelles</h3>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Type</label>
                        <select value={form.type} onChange={e => update('type', e.target.value)} className={inputClass}>
                          {collaborateurTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Photo</label>
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload size={18} className="text-muted" />
                          <span className="text-sm text-muted">{form.photo ? form.photo.name : 'Ajouter une photo'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => update('photo', e.target.files?.[0] || null)} />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Prénom *</label>
                          <input value={form.prenom} onChange={e => update('prenom', e.target.value)} placeholder="Prénom" className={`${inputClass} ${errors.prenom ? 'border-danger' : ''}`} />
                          {errors.prenom && <p className={errorClass}>{errors.prenom}</p>}
                        </div>
                        <div>
                          <label className={labelClass}>Nom *</label>
                          <input value={form.nom} onChange={e => update('nom', e.target.value)} placeholder="Nom" className={`${inputClass} ${errors.nom ? 'border-danger' : ''}`} />
                          {errors.nom && <p className={errorClass}>{errors.nom}</p>}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@exemple.fr" className={`${inputClass} ${errors.email ? 'border-danger' : ''}`} />
                        {errors.email && <p className={errorClass}>{errors.email}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Téléphone</label>
                          <input value={form.telephone} onChange={e => update('telephone', e.target.value)} placeholder="06 12 34 56 78" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Genre</label>
                          <select value={form.genre} onChange={e => update('genre', e.target.value)} className={inputClass}>
                            <option value="">Non renseigné</option>
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'etatcivil' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold mb-4">État civil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date de naissance</label>
                    <input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ville de naissance</label>
                    <input value={form.villeNaissance} onChange={e => update('villeNaissance', e.target.value)} placeholder="Ville de naissance" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nationalité</label>
                    <input value={form.nationalite} onChange={e => update('nationalite', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>N° Sécurité sociale</label>
                    <input value={form.numeroSecu} onChange={e => update('numeroSecu', e.target.value)} placeholder="1 XX XX XX XXX XXX XX" className={inputClass} />
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
                    <label className={labelClass}>Code postal</label>
                    <input value={form.codePostal} onChange={e => update('codePostal', e.target.value)} placeholder="75001" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Ville</label>
                    <input value={form.ville} onChange={e => update('ville', e.target.value)} placeholder="Paris" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Adresse</label>
                  <input value={form.adresse} onChange={e => update('adresse', e.target.value)} placeholder="Numéro et nom de rue" className={inputClass} />
                </div>
              </div>
            )}

            {activeTab === 'professionnel' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold mb-4">Informations professionnelles</h3>
                <div>
                  <label className={labelClass}>Matricule</label>
                  <input value={form.matricule} onChange={e => update('matricule', e.target.value)} className={inputClass} />
                  <p className="text-xs text-muted mt-1">Généré automatiquement si laissé vide</p>
                </div>
                <div>
                  <label className={labelClass}>Date d&apos;ancienneté</label>
                  <input type="date" value={form.dateAnciennete} onChange={e => update('dateAnciennete', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${form.licenceTerrain ? 'bg-primary-500' : 'bg-gray-300'}`} onClick={() => update('licenceTerrain', !form.licenceTerrain)}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.licenceTerrain ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm font-medium">Licence terrain</span>
                  </label>
                  <p className="text-xs text-muted mt-1">Autorise l&apos;accès à l&apos;application mobile terrain</p>
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
