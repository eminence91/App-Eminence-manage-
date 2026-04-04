'use client';

import { AlertTriangle } from 'lucide-react';

interface Expiration {
  id: string;
  agent: string;
  type: string;
  dateExpiration: string;
  joursRestants: number;
}

const mockExpirations: Expiration[] = [
  { id: '1', agent: 'Fatou D.', type: 'Titre de séjour', dateExpiration: '02/05/2026', joursRestants: 28 },
  { id: '2', agent: 'Ibrahim S.', type: 'Visite médicale', dateExpiration: '15/06/2026', joursRestants: 72 },
  { id: '3', agent: 'Mohamed K.', type: 'Carte d\'identité', dateExpiration: '10/09/2026', joursRestants: 159 },
  { id: '4', agent: 'Sophie M.', type: 'Habilitation sécurité', dateExpiration: '20/04/2026', joursRestants: 16 },
];

function getColor(jours: number) {
  if (jours < 30) return { bar: 'bg-danger', text: 'text-danger' };
  if (jours <= 90) return { bar: 'bg-warning', text: 'text-warning' };
  return { bar: 'bg-success', text: 'text-success' };
}

interface Props {
  className?: string;
}

export default function WidgetExpirations({ className }: Props) {
  const sorted = [...mockExpirations].sort((a, b) => a.joursRestants - b.joursRestants);

  return (
    <div className={className}>
      <div className="space-y-4">
        {sorted.map((exp) => {
          const couleur = getColor(exp.joursRestants);
          const pct = Math.min((exp.joursRestants / 180) * 100, 100);
          return (
            <div key={exp.id}>
              <div className="flex items-start justify-between mb-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    {exp.joursRestants < 30 && (
                      <AlertTriangle size={14} className="text-danger shrink-0" />
                    )}
                    {exp.type}
                  </p>
                  <p className="text-xs text-muted">{exp.agent}</p>
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ml-2 ${couleur.text}`}>
                  {exp.joursRestants} jours
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${couleur.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-0.5">Expire le {exp.dateExpiration}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
