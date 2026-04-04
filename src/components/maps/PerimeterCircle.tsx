'use client';

import React, { useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PerimeterCircleProps {
  map?: google.maps.Map;
  center: { lat: number; lng: number };
  radius: number; // metres
  color?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PerimeterCircle({
  map,
  center,
  radius,
  color = '#0d9488',
}: PerimeterCircleProps) {
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    const circle = new google.maps.Circle({
      map,
      center,
      radius,
      fillColor: color,
      fillOpacity: 0.12,
      strokeColor: color,
      strokeOpacity: 0.7,
      strokeWeight: 2,
      clickable: false,
    });

    circleRef.current = circle;

    return () => {
      circle.setMap(null);
    };
  }, [map, center, radius, color]);

  // Update on prop changes without recreating
  useEffect(() => {
    if (!circleRef.current) return;
    circleRef.current.setCenter(center);
    circleRef.current.setRadius(radius);
  }, [center, radius]);

  return null;
}
