'use client';

import { AlertTriangle, MapPin, Clock, Calendar } from 'lucide-react';

interface Alerte {
  id: string;
  titre: string;
  description: string;
  tempsEcoule: string;
  type: 'danger' | 'warning' | 'info';
  icon: React.ReactNode;
  lue: boolean;
}

const borderColors = {
  danger: 'border-l-danger bg-red-50',
  warning: 'border-l-warning bg-orange-50',
  info: 'border-l-info bg-blue-50',
};

const mockAlertes: Alerte[] = [
  {
    id: '1',
    titre: 'Sortie de périmètre',
    description: 'Ibrahim S. — Centre Commercial Vélizy',
    tempsEcoule: 'Il y a 5 min',
    type: 'danger',
    icon: <MapPin size={16} />,
    lue: false,
  },
  {
    id: '2',
    titre: 'Service non débuté',
    description: 'Résidence Les Jardins — retard 25 min',
    tempsEcoule: 'Il y a 12 min',
    type: 'warning',
    icon: <Clock size={16} />,
    lue: false,
  },
  {
    id: '3',
    titre: 'Incident signalé',
    description: 'Mohamed K. — Clinique de Neuilly',
    tempsEcoule: 'Il y a 30 min',
    type: 'danger',
    icon: <AlertTriangle size={16} />,
    lue: true,
  },
  {
    id: '4',
    titre: 'Demande de congé',
    description: 'Aminata C. — 15/04 au 22/04',
    tempsEcoule: 'Il y a 2h',
    type: 'info',
    icon: <Calendar size={16} />,
    lue: true,
  },
];

interface Props {
  className?: string;
}

export default function WidgetAlertes({ className }: Props) {
  const nonLues = mockAlertes.filter((a) => !a.lue).length;

  return (
    <div className={className}>
      {nonLues > 0 && (
        <div className="mb-3">
          <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {nonLues} non lue{nonLues > 1 ? 's' : ''}
          </span>
        </div>
      )}
      <div className="space-y-3">
        {mockAlertes.map((alerte) => (
          <div
            key={alerte.id}
            className={`border-l-4 ${borderColors[alerte.type]} p-3 rounded-r-lg`}
          >
            <div className="flex items-start gap-2">
              <span className="text-muted mt-0.5 shrink-0">{alerte.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {alerte.titre}
                  </p>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {alerte.tempsEcoule}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{alerte.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
