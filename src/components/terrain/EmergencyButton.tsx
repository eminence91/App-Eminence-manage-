'use client';

import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

export default function EmergencyButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {/* Floating Emergency Button */}
      <button
        onClick={() => setShowDialog(true)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-red-600 rounded-full shadow-lg flex items-center justify-center animate-pulse hover:bg-red-700 active:scale-95 transition-transform"
        aria-label="Appel d'urgence"
      >
        <Phone className="w-6 h-6 text-white" />
      </button>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
            <div className="bg-red-600 p-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Appel d&apos;urgence</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-600 mb-5 text-center">
                Appeler le numéro d&apos;urgence ?
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+33123456789"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-red-600 text-white rounded-xl font-semibold text-lg active:scale-95 transition-transform"
                >
                  <Phone className="w-5 h-5" />
                  Urgence 1 — Responsable
                </a>
                <a
                  href="tel:+33198765432"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-orange-500 text-white rounded-xl font-semibold text-lg active:scale-95 transition-transform"
                >
                  <Phone className="w-5 h-5" />
                  Urgence 2 — Astreinte
                </a>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="w-full mt-4 py-3 text-gray-500 font-medium rounded-xl border border-gray-200 active:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
