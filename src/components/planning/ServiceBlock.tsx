'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ServiceBlockAgent {
  id: string;
  name: string;
}

export interface ServiceBlockData {
  id: string;
  siteName: string;
  startTime: string;   // HH:mm
  endTime: string;      // HH:mm
  agents: ServiceBlockAgent[];
  color?: string;
}

export interface ServiceBlockProps {
  service: ServiceBlockData;
  isDraft?: boolean;
  color?: string;
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ServiceBlock({
  service,
  isDraft = false,
  color,
  onClick,
}: ServiceBlockProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const bg = color || service.color || '#0d9488';

  // Duration in hours for proportional height (min 2rem)
  const [sh, sm] = service.startTime.split(':').map(Number);
  const [eh, em] = service.endTime.split(':').map(Number);
  const durationH = Math.max((eh * 60 + em - (sh * 60 + sm)) / 60, 0.5);
  const minHeight = Math.max(durationH * 2.5, 2.5); // rem

  const draftBg = isDraft
    ? `repeating-linear-gradient(45deg, ${bg}22, ${bg}22 6px, ${bg}44 6px, ${bg}44 12px)`
    : undefined;

  return (
    <div
      className="relative group cursor-pointer rounded-md shadow-sm transition-transform hover:scale-[1.02] overflow-hidden"
      style={{
        minHeight: `${minHeight}rem`,
        backgroundColor: isDraft ? 'transparent' : `${bg}22`,
        backgroundImage: draftBg,
        borderLeft: `3px solid ${bg}`,
      }}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Content */}
      <div className="px-2 py-1.5">
        <p
          className="text-[11px] font-semibold truncate"
          style={{ color: bg }}
        >
          {service.startTime} - {service.endTime}
        </p>
        {service.agents.length > 0 && (
          <p className="text-[10px] text-gray-600 truncate mt-0.5">
            {service.agents[0].name}
          </p>
        )}
        {service.agents.length > 1 && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-500">
              +{service.agents.length - 1}
            </span>
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl pointer-events-none">
          <p className="font-semibold">{service.siteName}</p>
          <p className="text-gray-300 mt-1">
            {service.startTime} - {service.endTime}
          </p>
          {isDraft && (
            <span className="inline-block mt-1 px-1.5 py-0.5 bg-orange-500/30 text-orange-300 rounded text-[10px]">
              Brouillon
            </span>
          )}
          {service.agents.length > 0 && (
            <div className="mt-2 border-t border-gray-700 pt-2 space-y-0.5">
              {service.agents.map((a) => (
                <p key={a.id} className="text-gray-300">{a.name}</p>
              ))}
            </div>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
