'use client';

import React, { useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type AgentMarkerStatus = 'on_site' | 'out_of_perimeter' | 'emergency' | 'late';

export interface AgentMarkerAgent {
  name: string;
  lat: number;
  lng: number;
  status: AgentMarkerStatus;
}

export interface AgentMarkerProps {
  map?: google.maps.Map;
  agent: AgentMarkerAgent;
  onClick?: () => void;
}

const STATUS_COLORS: Record<AgentMarkerStatus, string> = {
  on_site: '#16a34a',          // green-600
  out_of_perimeter: '#dc2626', // red-600
  emergency: '#dc2626',        // red-600
  late: '#ea580c',             // orange-600
};

const STATUS_LABELS: Record<AgentMarkerStatus, string> = {
  on_site: 'Sur site',
  out_of_perimeter: 'Hors périmètre',
  emergency: 'Urgence',
  late: 'En retard',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AgentMarker({ map, agent, onClick }: AgentMarkerProps) {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);

  const color = STATUS_COLORS[agent.status];
  const needsPulse = agent.status === 'emergency' || agent.status === 'out_of_perimeter';

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    const marker = new google.maps.Marker({
      position: { lat: agent.lat, lng: agent.lng },
      map,
      title: agent.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 10,
      },
      zIndex: needsPulse ? 200 : 50,
    });

    const info = new google.maps.InfoWindow({
      content: `<div style="font-family:sans-serif;padding:4px 8px;">
        <strong>${agent.name}</strong>
        <div style="margin-top:2px;font-size:12px;color:${color};">${STATUS_LABELS[agent.status]}</div>
      </div>`,
    });

    marker.addListener('click', () => {
      info.open(map, marker);
      onClick?.();
    });

    // Pulse animation for alerts via overlay
    if (needsPulse) {
      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function () {
        const div = document.createElement('div');
        div.style.cssText = `
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid ${color};
          animation: gmapPulse 1.5s ease-out infinite;
          pointer-events: none;
        `;
        // Add keyframe if not yet added
        if (!document.getElementById('gmap-pulse-style')) {
          const style = document.createElement('style');
          style.id = 'gmap-pulse-style';
          style.textContent = `
            @keyframes gmapPulse {
              0% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
              100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }
        pulseRef.current = div;
        const panes = this.getPanes();
        panes?.overlayLayer.appendChild(div);
      };
      overlay.draw = function () {
        const projection = this.getProjection();
        const pos = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(agent.lat, agent.lng)
        );
        if (pos && pulseRef.current) {
          pulseRef.current.style.left = `${pos.x}px`;
          pulseRef.current.style.top = `${pos.y}px`;
        }
      };
      overlay.onRemove = function () {
        pulseRef.current?.remove();
        pulseRef.current = null;
      };
      overlay.setMap(map);
    }

    markerRef.current = marker;
    infoRef.current = info;

    return () => {
      info.close();
      marker.setMap(null);
    };
  }, [map, agent, color, needsPulse, onClick]);

  return null;
}
