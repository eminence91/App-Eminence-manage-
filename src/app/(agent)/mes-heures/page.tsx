'use client';

import React, { useState } from 'react';
import { Clock, TrendingUp, Moon, Sun, Calendar } from 'lucide-react';

interface DayEntry {
  date: string;
  dayLabel: string;
  planned: number;
  actual: number;
}

const mockWeek: DayEntry[] = [
  { date: '2026-03-30', dayLabel: 'Lundi', planned: 7, actual: 7.25 },
  { date: '2026-03-31', dayLabel: 'Mardi', planned: 7, actual: 7 },
  { date: '2026-04-01', dayLabel: 'Mercredi', planned: 7, actual: 7.5 },
  { date: '2026-04-02', dayLabel: 'Jeudi', planned: 7, actual: 6.75 },
  { date: '2026-04-03', dayLabel: "Vendredi", planned: 7, actual: 3.5 },
];

const totalPlanned = mockWeek.reduce((s, d) => s + d.planned, 0);
const totalActual = mockWeek.reduce((s, d) => s + d.actual, 0);
const weekProgress = Math.min((totalActual / totalPlanned) * 100, 100);

const overtime = {
  total: 4.5,
  nuit: 2,
  dimanche: 1.5,
  ferie: 1,
};

function formatHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h${mins.toString().padStart(2, '0')}` : `${hrs}h`;
}

function getDeltaStyle(delta: number) {
  if (delta > 0.5) return 'text-orange-600 bg-orange-50';
  if (delta < -0.5) return 'text-red-600 bg-red-50';
  return 'text-green-600 bg-green-50';
}

function getProgressColor(actual: number, planned: number) {
  const ratio = actual / planned;
  if (ratio > 1.1) return 'bg-orange-500';
  if (ratio >= 0.9) return 'bg-green-500';
  return 'bg-red-500';
}

export default function MesHeuresPage() {
  const [selectedWeek] = useState('Semaine du 30 mars');

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold text-gray-900">Mes heures</h1>

      {/* Week summary card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-700">{selectedWeek}</h3>
          </div>
          <span className="text-xs text-gray-400">Semaine en cours</span>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-gray-900">{formatHours(totalActual)}</span>
            <span className="text-gray-400">/ {formatHours(totalPlanned)} planifiées</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all ${
                weekProgress > 100
                  ? 'bg-orange-500'
                  : weekProgress >= 80
                  ? 'bg-green-500'
                  : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min(weekProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">0h</span>
            <span className="text-[10px] text-gray-400">{formatHours(totalPlanned)}</span>
          </div>
        </div>

        {/* Delta */}
        {totalActual !== totalPlanned && (
          <div
            className={`text-center text-sm font-medium rounded-lg py-1.5 mt-1 ${
              totalActual > totalPlanned
                ? 'bg-orange-50 text-orange-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {totalActual > totalPlanned
              ? `+${formatHours(totalActual - totalPlanned)} au-dessus du planning`
              : `-${formatHours(totalPlanned - totalActual)} en-dessous du planning`}
          </div>
        )}
      </div>

      {/* Daily breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Détail par jour</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {mockWeek.map((day) => {
            const delta = day.actual - day.planned;
            const isToday = day.date === '2026-04-03';
            return (
              <div
                key={day.date}
                className={`px-4 py-3 ${isToday ? 'bg-primary-50/50' : ''}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isToday ? 'text-primary-700' : 'text-gray-800'}`}>
                      {day.dayLabel}
                    </span>
                    {isToday && (
                      <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full font-medium">
                        Aujourd&apos;hui
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDeltaStyle(delta)}`}>
                    {delta > 0 ? '+' : ''}{formatHours(Math.abs(delta))}
                    {delta === 0 && ' ✓'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(day.actual, day.planned)}`}
                        style={{
                          width: `${Math.min((day.actual / day.planned) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500 min-w-[120px] justify-end">
                    <span>
                      <span className="text-gray-400">Prévu</span> {formatHours(day.planned)}
                    </span>
                    <span>
                      <span className="text-gray-400">Réel</span>{' '}
                      <span className="font-medium text-gray-700">{formatHours(day.actual)}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heures supplémentaires du mois */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            Heures supplémentaires — Avril 2026
          </h3>
        </div>

        <div className="text-center mb-4">
          <p className="text-3xl font-bold text-orange-600">{formatHours(overtime.total)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total heures supplémentaires</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-indigo-50 rounded-xl p-3 text-center">
            <Moon className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-indigo-700">{formatHours(overtime.nuit)}</p>
            <p className="text-[10px] text-indigo-500 uppercase tracking-wide">Nuit</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <Sun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-700">{formatHours(overtime.dimanche)}</p>
            <p className="text-[10px] text-amber-500 uppercase tracking-wide">Dimanche</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <Calendar className="w-4 h-4 text-red-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-700">{formatHours(overtime.ferie)}</p>
            <p className="text-[10px] text-red-500 uppercase tracking-wide">Férié</p>
          </div>
        </div>
      </div>
    </div>
  );
}
