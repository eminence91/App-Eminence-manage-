'use client';

import React, { useState, useMemo } from 'react';
import { Search, Phone, Trash2, Star, Filter } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AgentSelectorAgent {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  hasLicense: boolean;
  rating: number;        // 0-5
  city?: string | null;
  phone?: string | null;
  totalHours?: number;   // planned hours
  isAvailable?: boolean;
}

export interface AssignedAgent {
  agentId: string;
  positionTitle: string;
}

export interface AgentSelectorProps {
  agents: AgentSelectorAgent[];
  assignedIds: string[];
  onAssign: (id: string) => void;
  onUnassign: (id: string) => void;
  positions: number;
  assignedPositions?: Record<string, string>; // agentId -> position title
  onPositionTitleChange?: (agentId: string, title: string) => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function AgentAvatar({ agent }: { agent: AgentSelectorAgent }) {
  const initials = `${agent.firstName[0] || ''}${agent.lastName[0] || ''}`.toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0 overflow-hidden">
      {agent.avatarUrl ? (
        <img src={agent.avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

function LicenseBadge({ hasLicense }: { hasLicense: boolean }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
        hasLicense ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
      }`}
    >
      {hasLicense ? 'Avec licence' : 'Sans licence'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AgentSelector({
  agents,
  assignedIds,
  onAssign,
  onUnassign,
  positions,
  assignedPositions = {},
  onPositionTitleChange,
}: AgentSelectorProps) {
  const [search, setSearch] = useState('');
  const [filterLicense, setFilterLicense] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const assignedSet = useMemo(() => new Set(assignedIds), [assignedIds]);

  const availableAgents = useMemo(() => {
    return agents.filter((a) => {
      if (assignedSet.has(a.id)) return false;
      if (search) {
        const q = search.toLowerCase();
        const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
        if (!fullName.includes(q)) return false;
      }
      if (filterLicense && !a.hasLicense) return false;
      if (filterAvailable && a.isAvailable === false) return false;
      if (filterRating !== null && a.rating < filterRating) return false;
      return true;
    });
  }, [agents, assignedSet, search, filterLicense, filterAvailable, filterRating]);

  const assignedAgents = useMemo(
    () => agents.filter((a) => assignedSet.has(a.id)),
    [agents, assignedSet]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* ========== LEFT - Available ========== */}
      <div className="flex-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="p-3 border-b border-gray-200 bg-gray-50 space-y-2">
          <p className="text-xs font-semibold text-gray-600">Agents disponibles</p>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un agent..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
          </div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filterLicense}
                onChange={(e) => setFilterLicense(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-[10px] text-gray-600">Avec licence</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-[10px] text-gray-600">Dispo.</span>
            </label>
            <select
              value={filterRating ?? ''}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
              className="text-[10px] text-gray-600 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">Note</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {availableAgents.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">Aucun agent disponible</p>
          )}
          {availableAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onAssign(agent.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-teal-50 transition text-left"
            >
              <AgentAvatar agent={agent} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-gray-800 uppercase">
                    {agent.lastName}
                  </span>
                  <span className="text-xs text-gray-600">{agent.firstName}</span>
                  <LicenseBadge hasLicense={agent.hasLicense} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={agent.rating} />
                  {agent.phone && <Phone className="w-3 h-3 text-gray-400" />}
                  {agent.city && (
                    <span className="text-[10px] text-gray-400">{agent.city}</span>
                  )}
                </div>
              </div>
              {agent.totalHours != null && (
                <span className="flex-shrink-0 text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {agent.totalHours}h
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ========== RIGHT - Assigned ========== */}
      <div className="flex-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <p className="text-xs font-semibold text-gray-600">
            Agents affectés{' '}
            <span className="font-normal text-gray-400">
              {assignedAgents.length}/{positions} élément{positions > 1 ? 's' : ''}
            </span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {assignedAgents.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">
              Cliquez sur un agent pour l{"'"}affecter
            </p>
          )}
          {assignedAgents.map((agent) => (
            <div key={agent.id} className="px-3 py-2.5">
              <div className="flex items-center gap-3">
                <AgentAvatar agent={agent} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-gray-800 uppercase">
                      {agent.lastName}
                    </span>
                    <span className="text-xs text-gray-600">{agent.firstName}</span>
                    <LicenseBadge hasLicense={agent.hasLicense} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={agent.rating} />
                    {agent.city && (
                      <span className="text-[10px] text-gray-400">{agent.city}</span>
                    )}
                    {agent.totalHours != null && (
                      <span className="text-[10px] text-gray-500">{agent.totalHours}h</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onUnassign(agent.id)}
                  className="flex-shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {/* Position title input */}
              <input
                type="text"
                placeholder="Intitulé du poste"
                value={assignedPositions[agent.id] || ''}
                onChange={(e) => onPositionTitleChange?.(agent.id, e.target.value)}
                className="mt-2 w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
