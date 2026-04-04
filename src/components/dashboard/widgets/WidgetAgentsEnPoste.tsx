'use client';

import { User } from 'lucide-react';

interface AgentPoste {
  id: string;
  nom: string;
  initiales: string;
  status: 'en_poste' | 'en_retard' | 'absent' | 'pas_de_service';
}

const statusDot: Record<AgentPoste['status'], string> = {
  en_poste: 'bg-success',
  en_retard: 'bg-warning',
  absent: 'bg-danger',
  pas_de_service: 'bg-gray-400',
};

const mockAgents: AgentPoste[] = [
  { id: '1', nom: 'Mohamed K.', initiales: 'MK', status: 'en_poste' },
  { id: '2', nom: 'Fatou D.', initiales: 'FD', status: 'en_poste' },
  { id: '3', nom: 'Ibrahim S.', initiales: 'IS', status: 'en_retard' },
  { id: '4', nom: 'Aminata C.', initiales: 'AC', status: 'en_poste' },
  { id: '5', nom: 'Jean-Pierre L.', initiales: 'JL', status: 'absent' },
  { id: '6', nom: 'Sophie M.', initiales: 'SM', status: 'pas_de_service' },
];

interface Props {
  className?: string;
}

export default function WidgetAgentsEnPoste({ className }: Props) {
  const enPoste = mockAgents.filter((a) => a.status === 'en_poste').length;
  const total = mockAgents.length;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <User size={16} className="text-primary-500" />
        <span className="text-sm font-medium text-foreground">
          {enPoste} en poste / {total} total
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {mockAgents.map((agent) => (
          <div key={agent.id} className="flex flex-col items-center gap-1.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
                {agent.initiales}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusDot[agent.status]}`}
              />
            </div>
            <span className="text-xs text-muted text-center leading-tight truncate w-full">
              {agent.nom}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
