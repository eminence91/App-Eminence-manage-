'use client';

interface JourData {
  jour: string;
  planifie: number;
  realise: number;
}

const mockData: JourData[] = [
  { jour: 'Lundi', planifie: 48, realise: 45 },
  { jour: 'Mardi', planifie: 52, realise: 50 },
  { jour: 'Mercredi', planifie: 44, realise: 42 },
  { jour: 'Jeudi', planifie: 56, realise: 54 },
  { jour: 'Vendredi', planifie: 50, realise: 48 },
  { jour: 'Samedi', planifie: 24, realise: 22 },
  { jour: 'Dimanche', planifie: 16, realise: 14 },
];

const maxVal = 60;

interface Props {
  className?: string;
}

export default function WidgetGraphiques({ className }: Props) {
  return (
    <div className={className}>
      <div className="space-y-4">
        {mockData.map((d) => (
          <div key={d.jour} className="flex items-center gap-3">
            <span className="text-xs text-muted w-12 shrink-0">{d.jour.slice(0, 3)}</span>
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-200 rounded-full"
                  style={{ width: `${(d.planifie / maxVal) * 100}%` }}
                />
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(d.realise / maxVal) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-muted w-16 text-right shrink-0">
              {d.realise}h / {d.planifie}h
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-200" />
          <span className="text-xs text-muted">Planifié</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-xs text-muted">Réalisé</span>
        </div>
      </div>
    </div>
  );
}
