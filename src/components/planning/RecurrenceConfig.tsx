'use client';

import React, { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { format, eachDayOfInterval, parseISO, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'holidays_only';

export interface RecurrenceRule {
  pattern: RecurrencePattern;
  weekDays: number[];       // 0=Mon … 6=Sun for weekly
  monthDays: number[];      // 1-31 for monthly
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD
  excludeHolidays: boolean;
}

export interface RecurrenceConfigProps {
  value: RecurrenceRule;
  onChange: (rule: RecurrenceRule) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PATTERN_OPTIONS: { value: RecurrencePattern; label: string }[] = [
  { value: 'daily', label: 'Quotidienne' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuelle' },
  { value: 'holidays_only', label: 'Jours fériés uniquement' },
];

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function RecurrenceConfig({ value, onChange }: RecurrenceConfigProps) {
  const update = (partial: Partial<RecurrenceRule>) => {
    onChange({ ...value, ...partial });
  };

  const toggleWeekDay = (dayIndex: number) => {
    const days = value.weekDays.includes(dayIndex)
      ? value.weekDays.filter((d) => d !== dayIndex)
      : [...value.weekDays, dayIndex].sort();
    update({ weekDays: days });
  };

  const toggleMonthDay = (day: number) => {
    const days = value.monthDays.includes(day)
      ? value.monthDays.filter((d) => d !== day)
      : [...value.monthDays, day].sort((a, b) => a - b);
    update({ monthDays: days });
  };

  // Compute summary
  const summary = useMemo(() => {
    try {
      if (!value.startDate || !value.endDate) return null;
      const start = parseISO(value.startDate);
      const end = parseISO(value.endDate);
      if (end <= start) return null;

      const allDays = eachDayOfInterval({ start, end });
      let count = 0;

      allDays.forEach((d) => {
        const jsDay = d.getDay(); // 0=Sun
        const weekDay = jsDay === 0 ? 6 : jsDay - 1; // 0=Mon
        const monthDay = d.getDate();

        switch (value.pattern) {
          case 'daily':
            count++;
            break;
          case 'weekly':
            if (value.weekDays.includes(weekDay)) count++;
            break;
          case 'monthly':
            if (value.monthDays.includes(monthDay)) count++;
            break;
          case 'holidays_only':
            // Placeholder – real holiday logic would come from a data source
            count++;
            break;
        }
      });

      const totalDays = allDays.length;
      return {
        count,
        startFormatted: format(start, 'dd/MM', { locale: fr }),
        endFormatted: format(end, 'dd/MM', { locale: fr }),
        totalDays,
      };
    } catch {
      return null;
    }
  }, [value]);

  return (
    <div className="space-y-4">
      {/* Pattern selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Type de récurrence</label>
        <div className="grid grid-cols-2 gap-2">
          {PATTERN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ pattern: opt.value })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition ${
                value.pattern === opt.value
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekday checkboxes (weekly) */}
      {value.pattern === 'weekly' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Jours de la semaine</label>
          <div className="flex gap-1.5">
            {WEEKDAYS.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWeekDay(i)}
                className={`w-10 h-10 rounded-lg text-xs font-medium transition ${
                  value.weekDays.includes(i)
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month day selector */}
      {value.pattern === 'monthly' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Jours du mois</label>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleMonthDay(d)}
                className={`w-8 h-8 rounded text-[11px] font-medium transition ${
                  value.monthDays.includes(d)
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date de début</label>
          <input
            type="date"
            value={value.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date de fin</label>
          <input
            type="date"
            value={value.endDate}
            onChange={(e) => update({ endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Exclude holidays toggle */}
      {value.pattern !== 'holidays_only' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value.excludeHolidays}
            onChange={(e) => update({ excludeHolidays: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-xs text-gray-600">Exclure jours fériés</span>
        </label>
      )}

      {/* Summary */}
      {summary && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
          <p className="text-xs text-teal-800">
            <span className="font-semibold">{summary.count} récurrence{summary.count > 1 ? 's' : ''}</span>
            , du {summary.startFormatted} au {summary.endFormatted}
          </p>
        </div>
      )}
    </div>
  );
}
