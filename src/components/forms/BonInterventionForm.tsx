'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Camera, Trash2, RotateCcw } from 'lucide-react';

interface BonInterventionFormData {
  siteId: string;
  description: string;
  etatSite: string;
  photos: File[];
  observations: string;
  signatureAgent: string;
  signatureClient: string;
}

interface BonInterventionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: BonInterventionFormData) => void;
}

const defaultData: BonInterventionFormData = {
  siteId: '',
  description: '',
  etatSite: 'Bon',
  photos: [],
  observations: '',
  signatureAgent: '',
  signatureClient: '',
};

const mockSites = [
  { id: '1', nom: 'Tour Montparnasse - Niv. 3' },
  { id: '2', nom: 'Centre Commercial Vélizy 2' },
  { id: '3', nom: 'Gare de Lyon - Hall 1' },
  { id: '4', nom: 'Résidence Les Jardins' },
];

const etatOptions = ['Bon', 'Moyen', 'Mauvais'];

function SignaturePad({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const getCtx = () => canvasRef.current?.getContext('2d') || null;

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
  };

  useEffect(() => {
    if (!value && canvasRef.current) {
      const ctx = getCtx();
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-muted">{label}</label>
        <button type="button" onClick={clear} className="flex items-center gap-1 text-xs text-muted hover:text-danger transition-colors">
          <RotateCcw size={12} /> Effacer
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="w-full h-32 border border-border rounded-lg bg-gray-50 cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  );
}

export default function BonInterventionForm({ isOpen, onClose, onSave }: BonInterventionFormProps) {
  const [form, setForm] = useState<BonInterventionFormData>({ ...defaultData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...defaultData });
      setErrors({});
      setPhotoPreviewUrls([]);
    }
  }, [isOpen]);

  const update = useCallback((field: keyof BonInterventionFormData, value: string | File[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setForm(prev => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
    const urls = newFiles.map(f => URL.createObjectURL(f));
    setPhotoPreviewUrls(prev => [...prev, ...urls]);
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
    URL.revokeObjectURL(photoPreviewUrls[index]);
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.siteId) errs.siteId = 'Le site est requis';
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full h-full lg:w-[90%] lg:h-[90%] lg:rounded-xl lg:shadow-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary-500 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold text-lg">Bon d&apos;intervention</h2>
          <button onClick={onClose} className="p-1 bg-white/20 rounded hover:bg-white/30"><X size={18} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Site */}
            <div>
              <label className={labelClass}>Site *</label>
              <select value={form.siteId} onChange={e => update('siteId', e.target.value)} className={`${inputClass} ${errors.siteId ? 'border-danger' : ''}`}>
                <option value="">Sélectionner un site...</option>
                {mockSites.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
              {errors.siteId && <p className={errorClass}>{errors.siteId}</p>}
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description du travail</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="Décrivez les travaux effectués..." className={inputClass} />
            </div>

            {/* État du site */}
            <div>
              <label className={labelClass}>État du site</label>
              <select value={form.etatSite} onChange={e => update('etatSite', e.target.value)} className={inputClass}>
                {etatOptions.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Photos */}
            <div>
              <label className={labelClass}>Photos</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
                {photoPreviewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera size={20} className="text-muted mb-1" />
                  <span className="text-xs text-muted">Ajouter</span>
                  <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={e => addPhotos(e.target.files)} />
                </label>
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className={labelClass}>Observations</label>
              <textarea value={form.observations} onChange={e => update('observations', e.target.value)} rows={3} placeholder="Observations complémentaires..." className={inputClass} />
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SignaturePad
                label="Signature de l'agent"
                value={form.signatureAgent}
                onChange={v => update('signatureAgent', v)}
              />
              <SignaturePad
                label="Signature du client"
                value={form.signatureClient}
                onChange={v => update('signatureClient', v)}
              />
            </div>
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
