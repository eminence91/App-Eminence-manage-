'use client';

import { FileText } from 'lucide-react';

interface BonIntervention {
  id: string;
  reference: string;
  agent: string;
  site: string;
  date: string;
  status: 'valide' | 'en_attente' | 'brouillon';
}

const statusConfig = {
  valide: { label: 'Validé', color: 'bg-success text-white' },
  en_attente: { label: 'En attente', color: 'bg-warning text-white' },
  brouillon: { label: 'Brouillon', color: 'bg-gray-400 text-white' },
};

const mockBons: BonIntervention[] = [
  { id: '1', reference: 'BI-2026-0412', agent: 'Mohamed K.', site: 'Clinique de Neuilly', date: '04/04/2026', status: 'en_attente' },
  { id: '2', reference: 'BI-2026-0411', agent: 'Fatou D.', site: 'Tour Montparnasse', date: '03/04/2026', status: 'valide' },
  { id: '3', reference: 'BI-2026-0410', agent: 'Ibrahim S.', site: 'Centre Vélizy', date: '02/04/2026', status: 'brouillon' },
];

interface Props {
  className?: string;
}

export default function WidgetBonsIntervention({ className }: Props) {
  return (
    <div className={className}>
      <div className="space-y-0.5">
        {mockBons.map((bon) => {
          const cfg = statusConfig[bon.status];
          return (
            <div
              key={bon.id}
              className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
            >
              <FileText size={16} className="text-primary-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {bon.reference}
                </p>
                <p className="text-xs text-muted">
                  {bon.agent} — {bon.site} — {bon.date}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
