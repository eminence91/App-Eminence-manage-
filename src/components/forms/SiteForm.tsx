'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Info, MapPin, Save, Upload, Plus, Crosshair } from 'lucide-react';

interface SiteFormData {
  nom: string;
  couleur: string;
  clientId: string;
  photo: File | null;
  pays: string;
  codePostal: string;
  ville: string;
  adresse: string;
  complement: string;
  latitude: string;
  longitude: string;
  perimetre: number;
}

interface SiteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: SiteFormData) => void;
  initialData?: Partial<SiteFormData>;
}

const defaultData: SiteFormData = {
  nom: '',
  couleur: '#14b8a6',
  clientId: '',
  photo: null,
  pays: 'France',
  codePostal: '',
  ville: '',
  adresse: '',
  complement: '',
  latitude: '',
  longitude: '',
  perimetre: 200,
};

const formTabs = [
  { id: 'general', label: 'Général', icon: <Info size={16} /> },
  { id: 'adresse', label: 'Adresse & Carte', icon: <MapPin size={16} /> },
];

const mockClients = [
  { id: '1', nom: 'Groupe Nexity' },
  { id: '2', nom: 'Carrefour Property' },
  { id: '3', nom: 'SNCF Gares' },
  { id: '4', nom: 'Mairie de Paris' },
];

export default function SiteForm({ isOpen, onClose, onSave, initialData }: SiteFormProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [form, setForm] = useState<SiteFormData>({ ...defaultData, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultData, ...initialData });
      setErrors({});
      setActiveTab('general');
    }
  }, [isOpen, initialData]);

  const update = useCallback((field: keyof SiteFormData, value: string | number | File | null) => {
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
    if (!form.clientId) errs.clientId = 'Le client est requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      if (errors.nom || errors.clientId) setActiveTab('general');
      return;
    }
    onSave?.(form);
  };

  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        setForm(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      });
    }
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
          <h2 className="font-semibold text-lg">{initialData?.nom ? 'Modifier le site' : 'Nouveau site'}</h2>
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
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold mb-4">Informations du site</h3>
                <div>
                  <label className={labelClass}>Nom *</label>
                  <div className="flex gap-2">
                    <input value={form.nom} onChange={e => update('nom', e.target.value)} placeholder="Nom du site" className={`flex-1 ${inputClass} ${errors.nom ? 'border-danger' : ''}`} />
                    <input type="color" value={form.couleur} onChange={e => update('couleur', e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer p-1" title="Couleur du site" />
                  </div>
                  {errors.nom && <p className={errorClass}>{errors.nom}</p>}
                </div>
                <div>
                  <label className={labelClass}>Client *</label>
                  <div className="flex gap-2">
                    <select value={form.clientId} onChange={e => update('clientId', e.target.value)} className={`flex-1 ${inputClass} ${errors.clientId ? 'border-danger' : ''}`}>
                      <option value="">Sélectionner un client...</option>
                      {mockClients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    <button className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600" title="Nouveau client"><Plus size={16} /></button>
                  </div>
                  {errors.clientId && <p className={errorClass}>{errors.clientId}</p>}
                </div>
                <div>
                  <label className={labelClass}>Photo</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload size={24} className="text-muted" />
                    <div className="text-center">
                      <p className="text-sm text-muted">{form.photo ? form.photo.name : 'Cliquez pour ajouter une photo'}</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG (max. 5 Mo)</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => update('photo', e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'adresse' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold mb-4">Adresse & Carte</h3>
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
                  <div className="flex gap-2">
                    <input value={form.adresse} onChange={e => update('adresse', e.target.value)} placeholder="Numéro et nom de rue" className={`flex-1 ${inputClass}`} />
                    <button onClick={handleGeolocation} className="p-2 border border-border rounded-lg hover:bg-gray-50" title="Géolocaliser"><Crosshair size={16} className="text-primary-500" /></button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Complément</label>
                  <input value={form.complement} onChange={e => update('complement', e.target.value)} placeholder="Bâtiment, étage, etc." className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input value={form.latitude} onChange={e => update('latitude', e.target.value)} placeholder="Auto" className={`${inputClass} bg-gray-50`} readOnly />
                  </div>
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input value={form.longitude} onChange={e => update('longitude', e.target.value)} placeholder="Auto" className={`${inputClass} bg-gray-50`} readOnly />
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="w-full h-48 bg-gray-100 rounded-lg border border-border flex items-center justify-center">
                  <div className="text-center text-muted">
                    <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Carte (intégration cartographique requise)</p>
                    {form.latitude && <p className="text-xs mt-1">{form.latitude}, {form.longitude}</p>}
                  </div>
                </div>

                {/* Perimeter slider */}
                <div>
                  <label className={labelClass}>Périmètre de pointage : {form.perimetre}m</label>
                  <input type="range" min={100} max={500} step={10} value={form.perimetre} onChange={e => update('perimetre', parseInt(e.target.value))} className="w-full accent-primary-500" />
                  <div className="flex justify-between text-xs text-muted">
                    <span>100m</span>
                    <span>500m</span>
                  </div>
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
