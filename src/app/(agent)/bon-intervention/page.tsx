'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Trash2,
  Check,
  RotateCcw,
  FileText,
  Send,
  Plus,
  X,
} from 'lucide-react';

interface SignaturePadProps {
  label: string;
  onClear: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

function SignaturePad({ label, onClear, canvasRef }: SignaturePadProps) {
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e: TouchEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      }
      return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
    };

    const start = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      isDrawing.current = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const move = (e: TouchEvent | MouseEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const end = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);

    return () => {
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', end);
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', end);
      canvas.removeEventListener('mouseleave', end);
    };
  }, [canvasRef]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <button
          onClick={handleClear}
          type="button"
          className="flex items-center gap-1 text-xs text-gray-500 active:text-red-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Effacer
        </button>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none"
          style={{ height: '140px' }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-center">
        Signez avec votre doigt dans la zone ci-dessus
      </p>
    </div>
  );
}

export default function BonInterventionPage() {
  const [formData, setFormData] = useState({
    siteState: 'conforme',
    workDone: '',
    productsUsed: [] as string[],
    remarks: '',
    clientPresent: false,
    qualityCheck: false,
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const agentCanvasRef = useRef<HTMLCanvasElement>(null);
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);

  const productOptions = [
    'Détergent multi-surfaces',
    'Désinfectant virucide',
    'Dégraissant cuisine',
    'Nettoyant vitres',
    'Produit sol',
    'Détartrant sanitaires',
  ];

  const toggleProduct = (product: string) => {
    setFormData((prev) => ({
      ...prev,
      productsUsed: prev.productsUsed.includes(product)
        ? prev.productsUsed.filter((p) => p !== product)
        : [...prev.productsUsed, product],
    }));
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, url]);
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-green-100 rounded-full p-5 mb-4">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Bon envoyé !</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Le bon d&apos;intervention a été enregistré et sera transmis au client.
        </p>
        <a
          href="/service-actif"
          className="py-3 px-8 bg-primary-600 text-white font-semibold rounded-xl active:scale-[0.97] transition-all"
        >
          Retour au service
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 pb-8">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary-700" />
        <h1 className="text-lg font-bold text-gray-900">Bon d&apos;intervention</h1>
      </div>

      {/* Service info header */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 mb-5 text-sm">
        <p className="font-semibold text-primary-800">Tour Montparnasse — Étage 12</p>
        <p className="text-primary-600 mt-0.5">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-5">
        {/* État du site */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            État du site à l&apos;arrivée
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['conforme', 'dégradé', 'sale'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, siteState: val }))}
                className={`py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                  formData.siteState === val
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Description du travail */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Description du travail effectué
          </label>
          <textarea
            value={formData.workDone}
            onChange={(e) => setFormData((p) => ({ ...p, workDone: e.target.value }))}
            placeholder="Décrivez les tâches réalisées..."
            className="w-full border border-gray-300 rounded-xl p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>

        {/* Produits utilisés */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Produits utilisés
          </label>
          <div className="flex flex-wrap gap-2">
            {productOptions.map((product) => (
              <button
                key={product}
                type="button"
                onClick={() => toggleProduct(product)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  formData.productsUsed.includes(product)
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 active:bg-gray-200'
                }`}
              >
                {formData.productsUsed.includes(product) && '✓ '}
                {product}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer active:bg-gray-100">
            <input
              type="checkbox"
              checked={formData.clientPresent}
              onChange={(e) =>
                setFormData((p) => ({ ...p, clientPresent: e.target.checked }))
              }
              className="w-5 h-5 rounded accent-primary-600"
            />
            <span className="text-sm text-gray-700">Client présent sur site</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer active:bg-gray-100">
            <input
              type="checkbox"
              checked={formData.qualityCheck}
              onChange={(e) =>
                setFormData((p) => ({ ...p, qualityCheck: e.target.checked }))
              }
              className="w-5 h-5 rounded accent-primary-600"
            />
            <span className="text-sm text-gray-700">Contrôle qualité effectué</span>
          </label>
        </div>

        {/* Remarques */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Remarques / Observations
          </label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData((p) => ({ ...p, remarks: e.target.value }))}
            placeholder="Signaler un problème, une dégradation..."
            className="w-full border border-gray-300 rounded-xl p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>

        {/* Photos */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Photos
          </label>
          <div className="flex flex-wrap gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer active:bg-gray-50">
              <Plus className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-400 mt-0.5">Ajouter</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoCapture}
              />
            </label>
          </div>
        </div>

        {/* Signature Agent */}
        <SignaturePad
          label="Signature de l'agent"
          canvasRef={agentCanvasRef}
          onClear={() => {}}
        />

        {/* Signature Client */}
        <SignaturePad
          label="Signature du client"
          canvasRef={clientCanvasRef}
          onClear={() => {}}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Send className="w-5 h-5" />
          Valider et envoyer
        </button>
      </div>
    </div>
  );
}
