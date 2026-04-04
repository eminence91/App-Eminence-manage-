'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import ServiceBlock from './ServiceBlock';
import type { ServiceBlockData } from './ServiceBlock';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type PlanningViewType = 'day' | 'week' | 'month' | '4weeks';

export interface PlanningEntity {
  id: string;
  name: string;
  color?: string;
  avatarUrl?: string | null;
  totalHours?: number;
}

export interface PlanningService {
  id: string;
  entityId: string; // site or collaborator id
  date: string;     // YYYY-MM-DD
  startTime: string;
  endTime: string;
  siteName: string;
  agents: { id: string; name: string }[];
  isDraft?: boolean;
  color?: string;
}

export interface PlanningGridProps {
  view: PlanningViewType;
  date: Date;
  entities: PlanningEntity[];
  services: PlanningService[];
  mode: 'sites' | 'collaborators';
  onServiceClick?: (serviceId: string) => void;
  onCellClick?: (entityId: string, date: string) => void;
  onViewChange?: (view: PlanningViewType) => void;
  onDateChange?: (date: Date) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const VIEW_LABELS: Record<PlanningViewType, string> = {
  day: 'Jour',
  week: 'Semaine',
  month: 'Mois',
  '4weeks': '4 semaines',
};

function getDaysForView(view: PlanningViewType, date: Date): Date[] {
  switch (view) {
    case 'day':
      return [date];
    case 'week':
      const weekStart = startOfWeek(date, { locale: fr, weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
    case 'month': {
      const ms = startOfMonth(date);
      const me = endOfMonth(date);
      return eachDayOfInterval({ start: ms, end: me });
    }
    case '4weeks': {
      const ws = startOfWeek(date, { locale: fr, weekStartsOn: 1 });
      return eachDayOfInterval({ start: ws, end: addDays(ws, 27) });
    }
  }
}

function navigateDate(view: PlanningViewType, date: Date, direction: 1 | -1): Date {
  switch (view) {
    case 'day':
      return addDays(date, direction);
    case 'week':
      return addWeeks(date, direction);
    case 'month':
      return addMonths(date, direction);
    case '4weeks':
      return addWeeks(date, 4 * direction);
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PlanningGrid({
  view,
  date,
  entities,
  services,
  mode,
  onServiceClick,
  onCellClick,
  onViewChange,
  onDateChange,
}: PlanningGridProps) {
  const days = useMemo(() => getDaysForView(view, date), [view, date]);

  // Index services by entityId-date
  const serviceMap = useMemo(() => {
    const m = new Map<string, PlanningService[]>();
    services.forEach((s) => {
      const key = `${s.entityId}__${s.date}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(s);
    });
    return m;
  }, [services]);

  const colWidth = view === 'day' ? 'min-w-[200px]' : view === 'month' || view === '4weeks' ? 'min-w-[90px]' : 'min-w-[120px]';

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* ---- Toolbar ---- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDateChange?.(navigateDate(view, date, -1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDateChange?.(new Date())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition"
          >
            <Calendar className="w-4 h-4" />
            {"Aujourd'hui"}
          </button>
          <button
            onClick={() => onDateChange?.(navigateDate(view, date, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="ml-2 text-sm font-semibold text-gray-800 capitalize">
            {view === 'day'
              ? format(date, 'EEEE d MMMM yyyy', { locale: fr })
              : view === 'month'
              ? format(date, 'MMMM yyyy', { locale: fr })
              : `${format(days[0], 'd MMM', { locale: fr })} - ${format(days[days.length - 1], 'd MMM yyyy', { locale: fr })}`}
          </span>
        </div>

        {/* View selector */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {(Object.keys(VIEW_LABELS) as PlanningViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange?.(v)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                view === v
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Grid ---- */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full border-collapse table-fixed min-w-[600px]">
          {/* Header */}
          <thead className="sticky top-0 z-20 bg-white">
            <tr>
              {/* Entity col header */}
              <th className="sticky left-0 z-30 bg-gray-50 border-b border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-500 w-52 min-w-[208px]">
                {mode === 'sites' ? 'Sites' : 'Collaborateurs'}
              </th>
              {days.map((day) => {
                const today = isToday(day);
                return (
                  <th
                    key={day.toISOString()}
                    className={`border-b border-r border-gray-200 px-2 py-2 text-center ${colWidth} ${
                      today ? 'bg-teal-50' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`block text-[10px] uppercase tracking-wider ${today ? 'text-teal-600' : 'text-gray-400'}`}>
                      {format(day, 'EEE', { locale: fr })}
                    </span>
                    <span className={`block text-sm font-semibold mt-0.5 ${today ? 'text-teal-700' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {entities.map((entity) => (
              <tr key={entity.id} className="group">
                {/* Entity label */}
                <td className="sticky left-0 z-10 bg-white border-b border-r border-gray-200 px-3 py-2 group-hover:bg-gray-50 transition w-52 min-w-[208px]">
                  <div className="flex items-center gap-2">
                    {mode === 'sites' && entity.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entity.color }}
                      />
                    )}
                    {mode === 'collaborators' && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0 overflow-hidden">
                        {entity.avatarUrl ? (
                          <img src={entity.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          entity.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                        )}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{entity.name}</p>
                    </div>
                    {entity.totalHours != null && (
                      <span className="ml-auto flex-shrink-0 text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {entity.totalHours}h
                      </span>
                    )}
                  </div>
                </td>

                {/* Day cells */}
                {days.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const cellServices = serviceMap.get(`${entity.id}__${dateStr}`) || [];
                  const today = isToday(day);
                  return (
                    <td
                      key={day.toISOString()}
                      className={`border-b border-r border-gray-200 px-1 py-1 align-top ${colWidth} ${
                        today ? 'bg-teal-50/40' : ''
                      } hover:bg-gray-50 cursor-pointer transition`}
                      onClick={() => onCellClick?.(entity.id, dateStr)}
                    >
                      <div className="space-y-1">
                        {cellServices.map((s) => {
                          const blockData: ServiceBlockData = {
                            id: s.id,
                            siteName: s.siteName,
                            startTime: s.startTime,
                            endTime: s.endTime,
                            agents: s.agents,
                            color: s.color,
                          };
                          return (
                            <ServiceBlock
                              key={s.id}
                              service={blockData}
                              isDraft={s.isDraft}
                              color={s.color}
                              onClick={() => onServiceClick?.(s.id)}
                            />
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {entities.length === 0 && (
              <tr>
                <td colSpan={days.length + 1} className="text-center py-12 text-sm text-gray-400">
                  Aucun {mode === 'sites' ? 'site' : 'collaborateur'} à afficher
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
