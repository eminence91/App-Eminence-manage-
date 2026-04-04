'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Loader2, CheckCircle, AlertTriangle, Navigation } from 'lucide-react';
import { isWithinPerimeter, calculateDistance } from '@/lib/geo/perimeter';

interface PointageGPSProps {
  siteLat: number;
  siteLng: number;
  siteRadius: number;
  onPointage?: (data: {
    latitude: number;
    longitude: number;
    isWithinPerimeter: boolean;
    distance: number;
    timestamp: Date;
  }) => void;
  className?: string;
}

export default function PointageGPS({
  siteLat,
  siteLng,
  siteRadius,
  onPointage,
  className = '',
}: PointageGPSProps) {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inPerimeter, setInPerimeter] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [gpsActive, setGpsActive] = useState(false);

  // Check GPS availability
  useEffect(() => {
    setGpsActive('geolocation' in navigator);
  }, []);

  const capturePosition = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setError('La géolocalisation n\'est pas disponible sur cet appareil');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const dist = calculateDistance(lat, lng, siteLat, siteLng);
      const withinPerimeter = isWithinPerimeter(lat, lng, siteLat, siteLng, siteRadius);

      setPosition({ lat, lng });
      setDistance(Math.round(dist));
      setInPerimeter(withinPerimeter);

      onPointage?.({
        latitude: lat,
        longitude: lng,
        isWithinPerimeter: withinPerimeter,
        distance: Math.round(dist),
        timestamp: new Date(),
      });
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permission de géolocalisation refusée. Activez-la dans les paramètres.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Position indisponible. Vérifiez votre GPS.');
            break;
          case err.TIMEOUT:
            setError('Délai d\'attente dépassé. Réessayez.');
            break;
        }
      } else {
        setError('Erreur lors de la capture GPS');
      }
    } finally {
      setLoading(false);
    }
  }, [siteLat, siteLng, siteRadius, onPointage]);

  return (
    <div className={`bg-surface rounded-card shadow-card p-4 ${className}`}>
      {/* GPS Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${gpsActive ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs text-muted">
            {gpsActive ? 'GPS actif' : 'GPS indisponible'}
          </span>
        </div>
        {position && (
          <span className="text-xs text-muted">
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </span>
        )}
      </div>

      {/* Capture button */}
      <button
        onClick={capturePosition}
        disabled={loading || !gpsActive}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Capture GPS en cours...
          </>
        ) : (
          <>
            <Navigation size={20} />
            Capturer ma position
          </>
        )}
      </button>

      {/* Result */}
      {inPerimeter !== null && distance !== null && (
        <div className={`mt-3 p-3 rounded-lg flex items-center gap-3 ${inPerimeter ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {inPerimeter ? (
            <CheckCircle size={24} className="text-success flex-shrink-0" />
          ) : (
            <AlertTriangle size={24} className="text-danger flex-shrink-0" />
          )}
          <div>
            <p className={`text-sm font-medium ${inPerimeter ? 'text-green-700' : 'text-red-700'}`}>
              {inPerimeter ? 'Dans le périmètre du site' : 'Hors du périmètre du site'}
            </p>
            <p className="text-xs text-muted">
              Distance : {distance}m (périmètre : {siteRadius}m)
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </p>
        </div>
      )}
    </div>
  );
}
