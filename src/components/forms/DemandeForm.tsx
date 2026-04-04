'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface DemandeFormData {
  type: string;
  dateDebut: string;
  dateFin: string;
  motif: string;
}

interface DemandeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: DemandeFormData) => void;
}

const defaultData: DemandeFormData = {
  type: 'Congés payés',
  dateDebut: '',
  dateFin: '',
  motif: '',
};

const demandeTypes = ['Congés payés', 'Maladie', 'Sans solde', 'Événement familial', 'Autre'];

export default function DemandeForm({ isOpen, onClose, onSave }: DemandeFormProps) {
  const [form, setForm] = useState<DemandeFormData>({ ...defaultData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultData });
      setErrors({});
    }
  }, [isOpen]);

  const update = (field: keyof DemandeFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
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

  if (!isOpen) return null;

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none';
  const labelClass = 'block text-sm font-medium text-muted mb-1';
  const errorClass = 'text-xs text-danger mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-md mx-4 rounded-xl shadow-modal animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Nouvelle demande</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:bg-gray-100 transition-colors"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className={labelClass}>Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)} className={inputClass}>
              {demandeTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
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
            <textarea value={form.motif} onChange={e => update('motif', e.target.value)} rows={3} placeholder="Précisez le motif de votre demande..." className={inputClass} />
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
