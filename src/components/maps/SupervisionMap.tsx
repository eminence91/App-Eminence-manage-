'use client';

import React, { useMemo } from 'react';
import GoogleMap from './GoogleMap';
import type { AgentMarkerStatus } from './AgentMarker';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SupervisionAgent {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: AgentMarkerStatus;
}

export interface SupervisionSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  perimeterRadius: number;
}

export interface SupervisionMapProps {
  agents: SupervisionAgent[];
  sites: SupervisionSite[];
  selectedAgentId?: string;
  onAgentSelect?: (agentId: string) => void;
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------
const STATUS_META: Record<AgentMarkerStatus, { color: string; label: string }> = {
  on_site: { color: '#16a34a', label: 'Sur site' },
  out_of_perimeter: { color: '#dc2626', label: 'Hors périmètre' },
  emergency: { color: '#dc2626', label: 'Urgence' },
  late: { color: '#ea580c', label: 'En retard' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SupervisionMap({
  agents,
  sites,
  selectedAgentId,
  onAgentSelect,
}: SupervisionMapProps) {
  // Auto-center on active agents, fall back to first site or Paris
  const center = useMemo(() => {
    const activeAgents = agents.filter((a) => a.lat && a.lng);
    if (activeAgents.length > 0) {
      const avgLat = activeAgents.reduce((s, a) => s + a.lat, 0) / activeAgents.length;
      const avgLng = activeAgents.reduce((s, a) => s + a.lng, 0) / activeAgents.length;
      return { lat: avgLat, lng: avgLng };
    }
    if (sites.length > 0) {
      return { lat: sites[0].lat, lng: sites[0].lng };
    }
    return { lat: 48.8566, lng: 2.3522 };
  }, [agents, sites]);

  // Build map markers
  const mapMarkers = useMemo(() => {
    const agentMarkers = agents.map((a) => ({
      id: `agent-${a.id}`,
      lat: a.lat,
      lng: a.lng,
      label: a.name,
      color: STATUS_META[a.status].color,
    }));
    const siteMarkers = sites.map((s) => ({
      id: `site-${s.id}`,
      lat: s.lat,
      lng: s.lng,
      label: s.name,
      color: s.color,
    }));
    return [...siteMarkers, ...agentMarkers];
  }, [agents, sites]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <GoogleMap
        center={center}
        zoom={13}
        markers={mapMarkers}
        className="w-full h-full min-h-[400px] rounded-xl"
        onMarkerClick={(id) => {
          if (id.startsWith('agent-') && onAgentSelect) {
            onAgentSelect(id.replace('agent-', ''));
          }
        }}
      >
        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Légende</p>
          <div className="flex flex-col gap-1.5">
            {(Object.entries(STATUS_META) as [AgentMarkerStatus, { color: string; label: string }][]).map(
              ([key, meta]) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-[11px] text-gray-600">{meta.label}</span>
                </div>
              )
            )}
            <div className="border-t border-gray-200 my-1" />
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm flex-shrink-0 bg-gray-400 border border-white shadow-sm" />
              <span className="text-[11px] text-gray-600">Site</span>
            </div>
          </div>
        </div>

        {/* Selected agent info */}
        {selectedAgentId && (() => {
          const agent = agents.find((a) => a.id === selectedAgentId);
          if (!agent) return null;
          const meta = STATUS_META[agent.status];
          return (
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 max-w-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="text-sm font-semibold text-gray-800">{agent.name}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: meta.color }}>
                {meta.label}
              </p>
            </div>
          );
        })()}
      </GoogleMap>

      {/* Agent / Site counters */}
      <div className="absolute top-3 right-14 z-10 flex gap-2">
        <span className="bg-white/90 backdrop-blur text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full shadow">
          {agents.length} agent{agents.length > 1 ? 's' : ''}
        </span>
        <span className="bg-white/90 backdrop-blur text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full shadow">
          {sites.length} site{sites.length > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
