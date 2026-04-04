'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings, Plus, Loader2 } from 'lucide-react';
import DashboardGrid, { type WidgetConfig } from '@/components/dashboard/DashboardGrid';
import DashboardDataProvider, { useDashboardData } from '@/components/dashboard/DashboardDataProvider';
import WidgetServicesJour from '@/components/dashboard/widgets/WidgetServicesJour';
import WidgetAgentsEnPoste from '@/components/dashboard/widgets/WidgetAgentsEnPoste';
import WidgetAlertes from '@/components/dashboard/widgets/WidgetAlertes';
import WidgetDemandes from '@/components/dashboard/widgets/WidgetDemandes';
import WidgetHeuresSupp from '@/components/dashboard/widgets/WidgetHeuresSupp';
import WidgetGraphiques from '@/components/dashboard/widgets/WidgetGraphiques';
import WidgetExpirations from '@/components/dashboard/widgets/WidgetExpirations';
import WidgetStocks from '@/components/dashboard/widgets/WidgetStocks';
import WidgetBonsIntervention from '@/components/dashboard/widgets/WidgetBonsIntervention';

const STORAGE_KEY = 'eminence-dashboard-widgets';

const defaultWidgets: WidgetConfig[] = [
  { id: 'services-jour', type: 'services-jour', title: 'Services du jour', span: 2, isVisible: true },
  { id: 'alertes', type: 'alertes', title: 'Alertes', span: 1, isVisible: true },
  { id: 'graphiques', type: 'graphiques', title: 'Heures planifiées vs réalisées', span: 2, isVisible: true },
  { id: 'agents-en-poste', type: 'agents-en-poste', title: 'Agents en poste', span: 1, isVisible: true },
  { id: 'demandes', type: 'demandes', title: 'Demandes en attente', span: 1, isVisible: true },
  { id: 'heures-supp', type: 'heures-supp', title: 'Heures supplémentaires', span: 1, isVisible: true },
  { id: 'expirations', type: 'expirations', title: 'Expirations réglementaires', span: 1, isVisible: true },
  { id: 'stocks', type: 'stocks', title: 'Stocks & Matériel', span: 1, isVisible: true },
  { id: 'bons-intervention', type: 'bons-intervention', title: 'Bons d\'intervention', span: 1, isVisible: true },
];

function renderWidget(widget: WidgetConfig) {
  switch (widget.type) {
    case 'services-jour':
      return <WidgetServicesJour />;
    case 'agents-en-poste':
      return <WidgetAgentsEnPoste />;
    case 'alertes':
      return <WidgetAlertes />;
    case 'demandes':
      return <WidgetDemandes />;
    case 'heures-supp':
      return <WidgetHeuresSupp />;
    case 'graphiques':
      return <WidgetGraphiques />;
    case 'expirations':
      return <WidgetExpirations />;
    case 'stocks':
      return <WidgetStocks />;
    case 'bons-intervention':
      return <WidgetBonsIntervention />;
    default:
      return <p className="text-sm text-muted">Widget inconnu</p>;
  }
}

export default function DashboardPage() {
  return (
    <DashboardDataProvider>
      <DashboardContent />
    </DashboardDataProvider>
  );
}

function DashboardContent() {
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);
  const [hydrated, setHydrated] = useState(false);
  const { loading: statsLoading, error: statsError } = useDashboardData();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: WidgetConfig[] = JSON.parse(stored);
        // Merge with defaults to pick up any new widgets added later
        const knownIds = new Set(parsed.map((w) => w.id));
        const merged = [
          ...parsed,
          ...defaultWidgets.filter((w) => !knownIds.has(w.id)),
        ];
        setWidgets(merged);
      }
    } catch {
      // ignore invalid stored data
    }
    setHydrated(true);
  }, []);

  const handleReorder = useCallback((newOrder: WidgetConfig[]) => {
    setWidgets(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
  }, []);

  const hiddenWidgets = widgets.filter((w) => !w.isVisible);

  const restoreWidget = (id: string) => {
    const updated = widgets.map((w) =>
      w.id === id ? { ...w, isVisible: true } : w
    );
    setWidgets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetLayout = () => {
    setWidgets(defaultWidgets);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-sm text-muted">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {editMode && (
            <button
              onClick={resetLayout}
              className="px-3 py-1.5 text-sm rounded-lg bg-surface text-muted hover:bg-gray-100 border border-border transition-colors"
            >
              Réinitialiser
            </button>
          )}
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
              editMode
                ? 'bg-primary-500 text-white'
                : 'bg-surface text-muted hover:bg-gray-100 border border-border'
            }`}
          >
            <Settings size={16} />
            {editMode ? 'Terminer' : 'Personnaliser'}
          </button>
        </div>
      </div>

      {/* Supabase loading / error indicators */}
      {statsLoading && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 size={16} className="animate-spin" />
          Chargement des statistiques en temps réel...
        </div>
      )}
      {statsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {statsError} — Affichage des données de démonstration.
        </div>
      )}

      {/* Hidden widgets restore panel */}
      {editMode && hiddenWidgets.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-card p-4">
          <p className="text-sm font-medium text-foreground mb-2">
            Widgets masqués
          </p>
          <div className="flex flex-wrap gap-2">
            {hiddenWidgets.map((w) => (
              <button
                key={w.id}
                onClick={() => restoreWidget(w.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-lg hover:border-primary-400 transition-colors"
              >
                <Plus size={14} />
                {w.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Widget grid */}
      <DashboardGrid
        widgets={widgets}
        onReorder={handleReorder}
        editMode={editMode}
        renderWidget={renderWidget}
      />
    </div>
  );
}
