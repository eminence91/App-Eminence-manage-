'use client';

import React, { useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SiteMarkerSite {
  name: string;
  lat: number;
  lng: number;
  color: string;
}

export interface SiteMarkerProps {
  map?: google.maps.Map;
  site: SiteMarkerSite;
  isSelected?: boolean;
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SiteMarker({ map, site, isSelected = false, onClick }: SiteMarkerProps) {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    const marker = new google.maps.Marker({
      position: { lat: site.lat, lng: site.lng },
      map,
      title: site.name,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        fillColor: site.color,
        fillOpacity: 1,
        strokeColor: isSelected ? '#000000' : '#ffffff',
        strokeWeight: isSelected ? 3 : 2,
        scale: isSelected ? 8 : 6,
      },
      zIndex: isSelected ? 100 : 10,
    });

    const info = new google.maps.InfoWindow({
      content: `<div style="font-family:sans-serif;padding:4px 8px;">
        <strong style="color:${site.color}">${site.name}</strong>
      </div>`,
    });

    marker.addListener('click', () => {
      info.open(map, marker);
      onClick?.();
    });

    if (isSelected) {
      info.open(map, marker);
    }

    markerRef.current = marker;
    infoRef.current = info;

    return () => {
      info.close();
      marker.setMap(null);
    };
  }, [map, site, isSelected, onClick]);

  return null;
}
