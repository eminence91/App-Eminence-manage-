'use client';

interface CategorieHeures {
  label: string;
  heures: number;
  couleur: string;
}

const mockData: CategorieHeures[] = [
  { label: 'Heures normales', heures: 1248, couleur: 'bg-primary-500' },
  { label: 'Heures supp. 25%', heures: 86, couleur: 'bg-primary-300' },
  { label: 'Heures supp. 50%', heures: 42, couleur: 'bg-warning' },
  { label: 'Heures de nuit', heures: 64, couleur: 'bg-purple' },
  { label: 'Heures dimanche/férié', heures: 28, couleur: 'bg-danger' },
];

const totalSupp = mockData.slice(1).reduce((s, c) => s + c.heures, 0);
const maxHeures = Math.max(...mockData.map((c) => c.heures));

interface Props {
  className?: string;
}

export default function WidgetHeuresSupp({ className }: Props) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-foreground">{totalSupp}h</span>
        <span className="text-sm text-muted">heures supplémentaires ce mois</span>
      </div>
      <div className="space-y-3">
        {mockData.map((cat) => (
          <div key={cat.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted">{cat.label}</span>
              <span className="text-xs font-medium text-foreground">{cat.heures}h</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${cat.couleur}`}
                style={{ width: `${(cat.heures / maxHeures) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
