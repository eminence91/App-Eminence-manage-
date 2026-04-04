'use client';

import { Check, X } from 'lucide-react';

interface DemandeConge {
  id: string;
  nom: string;
  type: string;
  typeCouleur: string;
  dateDebut: string;
  dateFin: string;
}

const mockDemandes: DemandeConge[] = [
  { id: '1', nom: 'Aminata C.', type: 'Congés payés', typeCouleur: 'bg-info text-white', dateDebut: '15/04', dateFin: '22/04' },
  { id: '2', nom: 'Ibrahim S.', type: 'Événement familial', typeCouleur: 'bg-purple text-white', dateDebut: '10/04', dateFin: '10/04' },
  { id: '3', nom: 'Fatou D.', type: 'Maladie', typeCouleur: 'bg-warning text-white', dateDebut: '05/04', dateFin: '07/04' },
];

interface Props {
  className?: string;
}

export default function WidgetDemandes({ className }: Props) {
  return (
    <div className={className}>
      <div className="mb-3">
        <span className="bg-info text-white text-xs px-2 py-0.5 rounded-full font-medium">
          {mockDemandes.length} en attente
        </span>
      </div>
      <div className="space-y-0.5">
        {mockDemandes.map((demande) => (
          <div
            key={demande.id}
            className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{demande.nom}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${demande.typeCouleur}`}>
                  {demande.type}
                </span>
                <span className="text-xs text-muted">
                  {demande.dateDebut}{demande.dateDebut !== demande.dateFin ? ` — ${demande.dateFin}` : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-3">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-colors"
                aria-label="Approuver"
              >
                <Check size={16} />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors"
                aria-label="Refuser"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
