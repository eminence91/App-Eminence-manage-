'use client';

import { Calendar, ChevronRight } from 'lucide-react';

interface ServiceJour {
  id: string;
  site: string;
  agents: string[];
  heureDebut: string;
  heureFin: string;
  status: 'en_cours' | 'planifie' | 'termine' | 'non_debute';
}

const statusConfig = {
  en_cours: { label: 'En cours', color: 'bg-success text-white' },
  planifie: { label: 'Planifié', color: 'bg-info text-white' },
  termine: { label: 'Terminé', color: 'bg-gray-400 text-white' },
  non_debute: { label: 'Non débuté', color: 'bg-warning text-white' },
};

const mockServices: ServiceJour[] = [
  { id: '1', site: 'Clinique de Neuilly', agents: ['Mohamed K.'], heureDebut: '08:00', heureFin: '16:00', status: 'en_cours' },
  { id: '2', site: 'Bureaux Tour Montparnasse', agents: ['Fatou D.', 'Jean-Pierre L.'], heureDebut: '06:00', heureFin: '14:00', status: 'termine' },
  { id: '3', site: 'Centre Commercial Vélizy', agents: ['Ibrahim S.'], heureDebut: '09:00', heureFin: '17:00', status: 'en_cours' },
  { id: '4', site: 'Résidence Les Jardins', agents: ['—'], heureDebut: '14:00', heureFin: '22:00', status: 'non_debute' },
  { id: '5', site: 'Hôpital Saint-Louis', agents: ['Aminata C.'], heureDebut: '07:00', heureFin: '15:00', status: 'planifie' },
];

interface Props {
  className?: string;
}

export default function WidgetServicesJour({ className }: Props) {
  return (
    <div className={className}>
      <div className="space-y-0.5">
        {mockServices.map((service) => {
          const cfg = statusConfig[service.status];
          return (
            <div
              key={service.id}
              className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
            >
              <Calendar size={16} className="text-primary-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {service.site}
                </p>
                <p className="text-xs text-muted">
                  {service.agents.join(', ')} — {service.heureDebut} - {service.heureFin}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${cfg.color}`}
              >
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <button className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
          Voir tout <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
