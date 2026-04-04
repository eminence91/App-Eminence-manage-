'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Clock,
  Play,
  Square,
  Pause,
  RotateCcw,
  AlertTriangle,
  FileText,
  Key,
  Camera,
  CheckCircle2,
  XCircle,
  Navigation,
} from 'lucide-react';

type ServiceStatus = 'not-started' | 'in-progress' | 'paused' | 'interrupted' | 'completed';

interface GpsCoords {
  lat: number;
  lng: number;
}

const SITE_COORDS: GpsCoords = { lat: 48.8422, lng: 2.3219 };
const GPS_PERIMETER = 200; // meters

function calculateDistance(a: GpsCoords, b: GpsCoords): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function ServiceActifPage() {
  const [status, setStatus] = useState<ServiceStatus>('not-started');
  const [gpsActive, setGpsActive] = useState(false);
  const [userCoords, setUserCoords] = useState<GpsCoords | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pauseStart, setPauseStart] = useState<Date | null>(null);
  const [totalPauseSeconds, setTotalPauseSeconds] = useState(0);
  const [showConsignes, setShowConsignes] = useState(false);
  const [showCles, setShowCles] = useState(false);
  const [showInterruption, setShowInterruption] = useState(false);
  const [interruptionReason, setInterruptionReason] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  // Mock GPS
  const captureGps = useCallback(() => {
    // Simulate GPS capture near site
    const mockLat = SITE_COORDS.lat + (Math.random() - 0.5) * 0.002;
    const mockLng = SITE_COORDS.lng + (Math.random() - 0.5) * 0.002;
    const coords = { lat: mockLat, lng: mockLng };
    setUserCoords(coords);
    setGpsActive(true);
    const dist = calculateDistance(coords, SITE_COORDS);
    setDistance(Math.round(dist));
    return coords;
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'in-progress') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // GPS polling
  useEffect(() => {
    captureGps();
    const interval = setInterval(captureGps, 10000);
    return () => clearInterval(interval);
  }, [captureGps]);

  const handlePriseDeService = () => {
    captureGps();
    setStartTime(new Date());
    setStatus('in-progress');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handlePause = () => {
    setPauseStart(new Date());
    setStatus('paused');
  };

  const handleReprise = () => {
    if (pauseStart) {
      const pauseDuration = Math.floor((Date.now() - pauseStart.getTime()) / 1000);
      setTotalPauseSeconds((prev) => prev + pauseDuration);
    }
    setPauseStart(null);
    setStatus('in-progress');
  };

  const handleInterruption = () => {
    setShowInterruption(true);
  };

  const confirmInterruption = () => {
    setStatus('interrupted');
    setShowInterruption(false);
    setEndTime(new Date());
    setShowSummary(true);
  };

  const handleFinDeService = () => {
    captureGps();
    setStatus('completed');
    setEndTime(new Date());
    setShowSummary(true);
  };

  const inPerimeter = distance !== null && distance <= GPS_PERIMETER;

  const statusConfig = {
    'not-started': { color: 'bg-gray-400', label: 'Pas débuté', ring: 'ring-gray-200' },
    'in-progress': { color: 'bg-green-500', label: 'En cours', ring: 'ring-green-200' },
    paused: { color: 'bg-yellow-500', label: 'En pause', ring: 'ring-yellow-200' },
    interrupted: { color: 'bg-orange-500', label: 'Interrompu', ring: 'ring-orange-200' },
    completed: { color: 'bg-gray-500', label: 'Terminé', ring: 'ring-gray-200' },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="p-4 space-y-4">
      {/* GPS indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${gpsActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-gray-500">{gpsActive ? 'GPS actif' : 'GPS inactif'}</span>
        </div>
        <Navigation className="w-4 h-4 text-gray-400" />
      </div>

      {/* Service info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Tour Montparnasse</h2>
            <p className="text-sm text-gray-500 mt-0.5">Étage 12 — Bureaux</p>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full ${currentStatus.color} ${currentStatus.ring} ring-4 flex items-center justify-center ${
                status === 'in-progress' ? 'animate-pulse' : ''
              }`}
            >
              {status === 'in-progress' && <Play className="w-5 h-5 text-white" fill="white" />}
              {status === 'paused' && <Pause className="w-5 h-5 text-white" />}
              {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
            </div>
            <span className="text-[10px] font-medium mt-1 text-gray-500">{currentStatus.label}</span>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>33 Avenue du Maine, 75015 Paris</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>06:00 - 09:00</span>
          </div>
          <div className="inline-block mt-1 text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
            Nettoyage bureaux
          </div>
        </div>

        {/* Distance indicator */}
        {distance !== null && (
          <div
            className={`mt-3 flex items-center gap-2 p-2 rounded-lg text-sm font-medium ${
              inPerimeter
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {inPerimeter ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 flex-shrink-0" />
            )}
            Vous êtes à {distance}m du site
          </div>
        )}
      </div>

      {/* PRISE DE SERVICE */}
      {status === 'not-started' && (
        <div className="space-y-3">
          <label className="block">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-3 cursor-pointer active:bg-gray-200 transition-colors">
              <Camera className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {photoTaken ? 'Photo prise ✓' : 'Prendre une photo (optionnel)'}
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={() => setPhotoTaken(true)}
              />
            </div>
          </label>
          <button
            onClick={handlePriseDeService}
            className="w-full py-5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-xl font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-7 h-7" fill="white" />
            PRISE DE SERVICE
          </button>
        </div>
      )}

      {/* During service controls */}
      {(status === 'in-progress' || status === 'paused') && (
        <div className="space-y-3">
          {/* Timer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Temps écoulé</p>
            <p className="text-4xl font-mono font-bold text-gray-900">
              {formatTime(elapsedSeconds)}
            </p>
            {totalPauseSeconds > 0 && (
              <p className="text-xs text-yellow-600 mt-1">
                Pause totale : {formatTime(totalPauseSeconds)}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            {status === 'in-progress' ? (
              <button
                onClick={handlePause}
                className="flex items-center justify-center gap-2 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl active:scale-[0.97] transition-all"
              >
                <Pause className="w-5 h-5" />
                PAUSE
              </button>
            ) : (
              <button
                onClick={handleReprise}
                className="flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl active:scale-[0.97] transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                REPRISE
              </button>
            )}
            <button
              onClick={handleInterruption}
              className="flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl active:scale-[0.97] transition-all"
            >
              <AlertTriangle className="w-5 h-5" />
              INTERRUPTION
            </button>
          </div>

          {/* Info buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowConsignes(true)}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl active:bg-gray-50"
            >
              <FileText className="w-4 h-4 text-primary-600" />
              Consignes
            </button>
            <button
              onClick={() => setShowCles(true)}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl active:bg-gray-50"
            >
              <Key className="w-4 h-4 text-blue-600" />
              Clés et accès
            </button>
          </div>

          {/* Bon d'intervention shortcut */}
          <a
            href="/bon-intervention"
            className="flex items-center justify-center gap-2 py-3 bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-xl active:bg-primary-100"
          >
            <FileText className="w-4 h-4" />
            Bon d&apos;intervention
          </a>

          {/* FIN DE SERVICE */}
          {status === 'in-progress' && (
            <button
              onClick={handleFinDeService}
              className="w-full py-5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xl font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 mt-2"
            >
              <Square className="w-6 h-6" fill="white" />
              FIN DE SERVICE
            </button>
          )}
        </div>
      )}

      {/* Completed state */}
      {status === 'completed' && !showSummary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Service terminé</h3>
          <p className="text-sm text-gray-500 mt-1">Bon travail !</p>
        </div>
      )}

      {/* Success animation overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-green-600/90 flex flex-col items-center justify-center text-white">
          <CheckCircle2 className="w-24 h-24 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold">Service démarré !</h3>
          <p className="text-green-100 mt-2 text-center px-6">
            {startTime && `Heure de début : ${startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
          {distance !== null && (
            <p className="text-green-100 mt-1">Position enregistrée — {distance}m du site</p>
          )}
        </div>
      )}

      {/* Summary modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé du service</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Heure d&apos;arrivée</span>
                  <span className="font-medium text-sm">
                    {startTime?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Heure de départ</span>
                  <span className="font-medium text-sm">
                    {endTime?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Durée réelle</span>
                  <span className="font-medium text-sm">{formatTime(elapsedSeconds)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Pauses</span>
                  <span className="font-medium text-sm">{formatTime(totalPauseSeconds)}</span>
                </div>
                {status === 'interrupted' && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Motif interruption</span>
                    <span className="font-medium text-sm text-orange-600">{interruptionReason || 'Non précisé'}</span>
                  </div>
                )}
              </div>

              {/* Optional end photo */}
              <label className="block mt-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-3 cursor-pointer active:bg-gray-200">
                  <Camera className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Ajouter une photo de fin (optionnel)</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <a
                  href="/bon-intervention"
                  className="py-3 bg-primary-600 text-white font-semibold rounded-xl text-center text-sm active:scale-[0.97] transition-all"
                >
                  Bon d&apos;intervention
                </a>
                <button
                  onClick={() => setShowSummary(false)}
                  className="py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm active:scale-[0.97] transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consignes modal */}
      {showConsignes && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Consignes du service</h3>
              <button onClick={() => setShowConsignes(false)} className="p-2 text-gray-400">✕</button>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">• Utiliser les produits écologiques fournis</li>
              <li className="flex gap-2">• Vider toutes les corbeilles de l&apos;étage</li>
              <li className="flex gap-2">• Nettoyer les vitres intérieures (bureau direction)</li>
              <li className="flex gap-2">• Aspirer moquettes salles de réunion</li>
            </ul>
          </div>
        </div>
      )}

      {/* Clés modal */}
      {showCles && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Clés et accès</h3>
              <button onClick={() => setShowCles(false)} className="p-2 text-gray-400">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="font-medium text-blue-800">Badge N°4523</p>
                <p className="text-blue-600 mt-0.5">Boîte à clés entrée parking niveau -1</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="font-medium text-blue-800">Code ascenseur</p>
                <p className="text-blue-600 mt-0.5">7491#</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interruption modal */}
      {showInterruption && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Motif de l&apos;interruption</h3>
            <textarea
              value={interruptionReason}
              onChange={(e) => setInterruptionReason(e.target.value)}
              placeholder="Décrivez la raison de l'interruption..."
              className="w-full border border-gray-300 rounded-xl p-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setShowInterruption(false)}
                className="py-3 bg-gray-200 text-gray-700 font-medium rounded-xl text-sm"
              >
                Annuler
              </button>
              <button
                onClick={confirmInterruption}
                className="py-3 bg-orange-500 text-white font-semibold rounded-xl text-sm active:scale-[0.97] transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
