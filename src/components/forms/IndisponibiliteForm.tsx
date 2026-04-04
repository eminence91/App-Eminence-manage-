'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface IndisponibiliteFormData {
  collaborateurId: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  motif: string;
}

interface IndisponibiliteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: IndisponibiliteFormData) => void;
}

const defaultData: IndisponibiliteFormData = {
  collaborateurId: '',
  type: 'Congés payés',
  dateDebut: '',
  dateFin: '',
  motif: '',
};

const indispoTypes = [
  { value: 'Congés payés', color: 'bg-blue-500' },
  { value: 'Maladie', color: 'bg-red-500' },
  { value: 'Sans solde', color: 'bg-gray-500' },
  { value: 'Événement familial', color: 'bg-purple-500' },
  { value: 'Vacataire', color: 'bg-amber-500' },
];

const mockCollaborateurs = [
  { id: '1', nom: 'Mohamed K.' },
  { id: '2', nom: 'Fatou D.' },
  { id: '3', nom: 'Ibrahim S.' },
  { id: '4', nom: 'Aminata C.' },
  { id: '5', nom: 'Mamadou T.' },
];

export default function IndisponibiliteForm({ isOpen, onClose, onSave }: IndisponibiliteFormProps) {
  const [form, setForm] = useState<IndisponibiliteFormData>({ ...defaultData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultData });
      setErrors({});
    }
  }, [isOpen]);

  const update = (field: keyof IndisponibiliteFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.collaborateurId) errs.collaborateurId = 'Le collaborateur est requis';
    if (!form.dateDebut) errs.dateDebut = 'La date de début est requise';
    if (!form.dateFin) errs.dateFin = 'La date de fin est requise';
    if (form.dateDebut && form.dateFin && form.dateDebut > form.dateFin) {
      errs.dateFin = 'La date de fin doit être après la date de début';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.(form);
  };

  const currentTypeColor = indispoTypes.find(t => t.value === form.type)?.color || 'bg-gray-500';

  if (!isOpen) return null;

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none';
  const labelClass = 'block text-sm font-medium text-muted mb-1';
  const errorClass = 'text-xs text-danger mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-md mx-4 rounded-xl shadow-modal animate-[fadeIn_0.2s_ease-out]">
        {/* Header with color indicator */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${currentTypeColor}`} />
            <h2 className="text-lg font-semibold text-foreground">Nouvelle indisponibilité</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:bg-gray-100 transition-colors"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className={labelClass}>Collaborateur *</label>
            <select value={form.collaborateurId} onChange={e => update('collaborateurId', e.target.value)} className={`${inputClass} ${errors.collaborateurId ? 'border-danger' : ''}`}>
              <option value="">Sélectionner un collaborateur...</option>
              {mockCollaborateurs.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
            {errors.collaborateurId && <p className={errorClass}>{errors.collaborateurId}</p>}
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <div className="relative">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${currentTypeColor}`} />
              <select value={form.type} onChange={e => update('type', e.target.value)} className={`${inputClass} pl-8`}>
                {indispoTypes.map(t => <option key={t.value} value={t.value}>{t.value}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date début *</label>
              <input type="date" value={form.dateDebut} onChange={e => update('dateDebut', e.target.value)} className={`${inputClass} ${errors.dateDebut ? 'border-danger' : ''}`} />
              {errors.dateDebut && <p className={errorClass}>{errors.dateDebut}</p>}
            </div>
            <div>
              <label className={labelClass}>Date fin *</label>
              <input type="date" value={form.dateFin} onChange={e => update('dateFin', e.target.value)} className={`${inputClass} ${errors.dateFin ? 'border-danger' : ''}`} />
              {errors.dateFin && <p className={errorClass}>{errors.dateFin}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>Motif</label>
            <textarea value={form.motif} onChange={e => update('motif', e.target.value)} rows={3} placeholder="Précisez le motif..." className={inputClass} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:bg-gray-100 rounded-lg">Annuler</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 text-sm">
            <Save size={16} /> ENREGISTRER
          </button>
        </div>
      </div>
    </div>
  );
}
