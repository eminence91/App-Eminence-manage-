'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapPin, Maximize, Minimize, Layers } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  color?: string;
}

export interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  onClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (markerId: string) => void;
  children?: React.ReactNode;
}

// Extend Window for Google Maps callback
declare global {
  interface Window {
    google: typeof google;
    __gmapsCallback?: () => void;
  }
}

// ---------------------------------------------------------------------------
// Hook – load Google Maps JS API once
// ---------------------------------------------------------------------------
let loadPromise: Promise<void> | null = null;

function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if (loadPromise) return loadPromise;
  if (typeof window !== 'undefined' && window.google?.maps) {
    return Promise.resolve();
  }
  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__gmapsCallback`;
    script.async = true;
    script.defer = true;
    window.__gmapsCallback = () => {
      resolve();
      delete window.__gmapsCallback;
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Échec du chargement de Google Maps'));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function GoogleMap({
  center = { lat: 48.8566, lng: 2.3522 },
  zoom = 14,
  markers = [],
  className = '',
  onClick,
  onMarkerClick,
  children,
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [loaded, setLoaded] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load API
  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMapsApi(apiKey)
      .then(() => setLoaded(true))
      .catch(() => setLoaded(false));
  }, [apiKey]);

  // Init map
  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    if (mapRef.current) return;
    mapRef.current = new google.maps.Map(containerRef.current, {
      center,
      zoom,
      mapTypeId: mapType,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    });
    if (onClick) {
      mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) onClick(e.latLng.lat(), e.latLng.lng());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // Update center / zoom
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setCenter(center);
    mapRef.current.setZoom(zoom);
  }, [center, zoom]);

  // Map type toggle
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setMapTypeId(mapType);
  }, [mapType]);

  // Markers
  useEffect(() => {
    if (!mapRef.current) return;
    // Clear old
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    // Add new
    markers.forEach((mk) => {
      const marker = new google.maps.Marker({
        position: { lat: mk.lat, lng: mk.lng },
        map: mapRef.current!,
        title: mk.label,
        icon: mk.color
          ? {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: mk.color,
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 10,
            }
          : undefined,
      });
      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(mk.id));
      }
      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  // No API key placeholder
  if (!apiKey) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 ${className}`}
        style={{ minHeight: 300 }}
      >
        <MapPin className="w-12 h-12 mb-3 text-gray-400" />
        <p className="text-sm font-medium">Carte Google Maps</p>
        <p className="text-xs mt-1">
          Configurez <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${className}`} style={{ minHeight: 300 }}>
      {/* Map container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Controls overlay */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        {/* Map type toggle */}
        <button
          onClick={() => setMapType((t) => (t === 'roadmap' ? 'satellite' : 'roadmap'))}
          className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow text-xs font-medium text-gray-700 hover:bg-white transition"
        >
          <Layers className="w-3.5 h-3.5" />
          {mapType === 'roadmap' ? 'Satellite' : 'Plan'}
        </button>
        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center bg-white/90 backdrop-blur w-8 h-8 rounded-lg shadow text-gray-700 hover:bg-white transition"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* Loading indicator */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
        </div>
      )}

      {/* Children (rendered outside map for overlays / legend) */}
      {children}
    </div>
  );
}
