'use client';

import { Package, AlertTriangle, RotateCcw } from 'lucide-react';

interface StockItem {
  id: string;
  nom: string;
  quantite: number;
  seuil: number;
}

interface RetourItem {
  id: string;
  nom: string;
  agent: string;
  dateRetour: string;
}

const mockStocks: StockItem[] = [
  { id: '1', nom: 'Gilets haute visibilité', quantite: 3, seuil: 10 },
  { id: '2', nom: 'Talkies-walkies', quantite: 2, seuil: 5 },
  { id: '3', nom: 'Badges visiteurs', quantite: 8, seuil: 20 },
];

const mockRetours: RetourItem[] = [
  { id: '1', nom: 'Radio Motorola', agent: 'Mohamed K.', dateRetour: '06/04/2026' },
  { id: '2', nom: 'Clés site Vélizy', agent: 'Ibrahim S.', dateRetour: '08/04/2026' },
];

interface Props {
  className?: string;
}

export default function WidgetStocks({ className }: Props) {
  return (
    <div className={className}>
      {/* Low stock */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-warning" />
          Stock bas
        </h4>
        <div className="space-y-0.5">
          {mockStocks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Package size={14} className="text-muted shrink-0" />
                <span className="text-sm text-foreground truncate">{item.nom}</span>
              </div>
              <span className="text-xs font-medium text-danger whitespace-nowrap ml-2">
                {item.quantite} / {item.seuil}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending returns */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <RotateCcw size={14} className="text-info" />
          Retours en attente
        </h4>
        <div className="space-y-0.5">
          {mockRetours.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{item.nom}</p>
                <p className="text-xs text-muted">{item.agent}</p>
              </div>
              <span className="text-xs text-muted whitespace-nowrap ml-2">{item.dateRetour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
