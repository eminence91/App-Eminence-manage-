'use client';

import { useState } from 'react';
import {
  Download, FileText, FileSpreadsheet, File,
  Users, MapPin, Receipt, Calendar, CheckCircle
} from 'lucide-react';

type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ExportItem {
  id: string;
  titre: string;
  description: string;
  format: ExportFormat;
  categorie: 'collaborateurs' | 'terrain' | 'facturation';
}

const exportItems: ExportItem[] = [
  { id: 'e-1', titre: 'Registre du personnel', description: 'Liste complète des collaborateurs avec informations contractuelles', format: 'excel', categorie: 'collaborateurs' },
  { id: 'e-2', titre: 'Prépaie mensuelle', description: 'Données de paie du mois en cours avec heures et primes', format: 'excel', categorie: 'collaborateurs' },
  { id: 'e-3', titre: 'Heures détaillées', description: 'Détail des heures travaillées par collaborateur et par site', format: 'excel', categorie: 'collaborateurs' },
  { id: 'e-4', titre: 'Indisponibilités', description: 'Récapitulatif des congés, absences et indisponibilités', format: 'excel', categorie: 'collaborateurs' },
  { id: 'e-5', titre: 'Bons de remise matériel', description: 'Bons de remise de matériel signés par les collaborateurs', format: 'pdf', categorie: 'collaborateurs' },
  { id: 'e-6', titre: 'Fiches de renseignement', description: 'Fiches individuelles avec coordonnées et informations administratives', format: 'pdf', categorie: 'collaborateurs' },
  { id: 'e-7', titre: 'Mains courantes', description: 'Rapports de main courante des agents sur le terrain', format: 'pdf', categorie: 'terrain' },
  { id: 'e-8', titre: 'Bons d\'intervention', description: 'Bons d\'intervention signés par les clients', format: 'pdf', categorie: 'terrain' },
  { id: 'e-9', titre: 'Journal des pointages GPS', description: 'Historique complet des pointages avec coordonnées GPS', format: 'excel', categorie: 'terrain' },
  { id: 'e-10', titre: 'Balance clients', description: 'Solde de chaque client avec détail des factures', format: 'excel', categorie: 'facturation' },
  { id: 'e-11', titre: 'Journal des ventes', description: 'Toutes les ventes et avoirs enregistrés sur la période', format: 'excel', categorie: 'facturation' },
  { id: 'e-12', titre: 'Données PennyLane', description: 'Export compatible pour import dans PennyLane', format: 'csv', categorie: 'facturation' },
];

const formatConfig: Record<ExportFormat, { label: string; color: string; icon: React.ReactNode }> = {
  pdf: { label: 'PDF', color: 'bg-red-100 text-red-700', icon: <FileText className="w-4 h-4" /> },
  excel: { label: 'Excel', color: 'bg-green-100 text-green-700', icon: <FileSpreadsheet className="w-4 h-4" /> },
  csv: { label: 'CSV', color: 'bg-blue-100 text-blue-700', icon: <File className="w-4 h-4" /> },
};

const categorieConfig = {
  collaborateurs: { label: 'Collaborateurs', icon: <Users className="w-5 h-5" />, color: 'text-purple-600' },
  terrain: { label: 'Terrain', icon: <MapPin className="w-5 h-5" />, color: 'text-blue-600' },
  facturation: { label: 'Facturation', icon: <Receipt className="w-5 h-5" />, color: 'text-primary-600' },
};

export default function ExportsPage() {
  const [dateDebut, setDateDebut] = useState('2026-03-01');
  const [dateFin, setDateFin] = useState('2026-03-31');
  const [toast, setToast] = useState<string | null>(null);

  const handleExport = (item: ExportItem) => {
    setToast(`Export généré : ${item.titre}`);
    setTimeout(() => setToast(null), 3000);
  };

  const categories = ['collaborateurs', 'terrain', 'facturation'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Exports de données</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted" />
            <span className="text-muted">Du</span>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <span className="text-muted">au</span>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Export Categories */}
      {categories.map(cat => {
        const config = categorieConfig[cat];
        const items = exportItems.filter(e => e.categorie === cat);

        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-4">
              <span className={config.color}>{config.icon}</span>
              <h2 className="text-lg font-semibold text-foreground">{config.label}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => {
                const fmt = formatConfig[item.format];
                return (
                  <div key={item.id} className="bg-surface rounded-card shadow-card p-4 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`${fmt.color} p-2 rounded-lg`}>{fmt.icon}</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${fmt.color}`}>
                        {fmt.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{item.titre}</h3>
                    <p className="text-xs text-muted flex-1 mb-3">{item.description}</p>
                    <button
                      onClick={() => handleExport(item)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-foreground text-white px-4 py-3 rounded-lg shadow-modal flex items-center gap-2 animate-in z-50">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}
