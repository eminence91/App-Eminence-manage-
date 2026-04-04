'use client';

import { useState } from 'react';
import {
  Package, QrCode, AlertTriangle, RotateCcw, UserCheck,
  FileDown, Search, ToggleLeft, ToggleRight, Eye, EyeOff,
  Shirt, CreditCard, Droplets, Car, Plus
} from 'lucide-react';

type StockMode = 'simplifie' | 'complet';
type SimplifiedTab = 'par_agent' | 'par_site';
type MaterialType = 'tenue' | 'badge' | 'consommable' | 'vehicule';
type LoanStatus = 'en_cours' | 'rendu' | 'en_retard';

interface AgentMaterial {
  id: string;
  collaborateur: string;
  materiel: string;
  quantite: number;
  datePret: string;
  dateRetour: string | null;
  statut: LoanStatus;
}

interface SiteMaterial {
  id: string;
  site: string;
  materiels: string[];
  visibleAgent: boolean;
}

interface StockReference {
  id: string;
  nom: string;
  type: MaterialType;
  quantite: number;
  prixUnitaire: number;
  seuilAlerte: number;
  qrCode: string;
}

const mockAgentMaterials: AgentMaterial[] = [
  { id: 'am-1', collaborateur: 'Marie Dubois', materiel: 'Tunique verte T. M', quantite: 2, datePret: '2026-01-15', dateRetour: null, statut: 'en_cours' },
  { id: 'am-2', collaborateur: 'Marie Dubois', materiel: 'Badge accès site A', quantite: 1, datePret: '2026-01-15', dateRetour: null, statut: 'en_cours' },
  { id: 'am-3', collaborateur: 'Jean-Pierre Martin', materiel: 'Pantalon noir T. L', quantite: 2, datePret: '2025-11-01', dateRetour: null, statut: 'en_cours' },
  { id: 'am-4', collaborateur: 'Fatima Benali', materiel: 'Aspirateur Kärcher T12/1', quantite: 1, datePret: '2026-02-01', dateRetour: '2026-03-15', statut: 'rendu' },
  { id: 'am-5', collaborateur: 'Karim Zidane', materiel: 'Clés véhicule Kangoo #3', quantite: 1, datePret: '2026-01-10', dateRetour: null, statut: 'en_retard' },
  { id: 'am-6', collaborateur: 'Sophie Laurent', materiel: 'Kit produits entretien', quantite: 1, datePret: '2026-03-01', dateRetour: null, statut: 'en_cours' },
];

const mockSiteMaterials: SiteMaterial[] = [
  { id: 'sm-1', site: 'Tour Haussmann - Hall A', materiels: ['Aspirateur industriel', 'Chariot de ménage', 'Kit sols'], visibleAgent: true },
  { id: 'sm-2', site: 'Boulangerie Dupont - Central', materiels: ['Nettoyeur vapeur', 'Kit vitrerie'], visibleAgent: true },
  { id: 'sm-3', site: 'Résidence du Parc - Bât. C', materiels: ['Monobrosse', 'Autolaveuse compacte', 'Chariot'], visibleAgent: false },
  { id: 'sm-4', site: 'Bureau NetPro - Strasbourg', materiels: ['Kit bureau', 'Aspirateur compact'], visibleAgent: true },
];

const mockStockRefs: StockReference[] = [
  { id: 'sr-1', nom: 'Tunique verte', type: 'tenue', quantite: 25, prixUnitaire: 18.50, seuilAlerte: 5, qrCode: 'TUN-001' },
  { id: 'sr-2', nom: 'Pantalon noir', type: 'tenue', quantite: 18, prixUnitaire: 22.00, seuilAlerte: 5, qrCode: 'PAN-001' },
  { id: 'sr-3', nom: 'Badge accès universel', type: 'badge', quantite: 3, prixUnitaire: 8.00, seuilAlerte: 5, qrCode: 'BDG-001' },
  { id: 'sr-4', nom: 'Gants nitrile (boîte 100)', type: 'consommable', quantite: 45, prixUnitaire: 12.50, seuilAlerte: 10, qrCode: 'GLV-001' },
  { id: 'sr-5', nom: 'Produit sol concentré 5L', type: 'consommable', quantite: 8, prixUnitaire: 35.00, seuilAlerte: 10, qrCode: 'PRD-001' },
  { id: 'sr-6', nom: 'Kangoo utilitaire', type: 'vehicule', quantite: 3, prixUnitaire: 0, seuilAlerte: 0, qrCode: 'VEH-001' },
];

const typeConfig: Record<MaterialType, { label: string; color: string; icon: React.ReactNode }> = {
  tenue: { label: 'Tenue', color: 'bg-blue-100 text-blue-800', icon: <Shirt className="w-3.5 h-3.5" /> },
  badge: { label: 'Badge', color: 'bg-purple-100 text-purple-800', icon: <CreditCard className="w-3.5 h-3.5" /> },
  consommable: { label: 'Consommable', color: 'bg-amber-100 text-amber-800', icon: <Droplets className="w-3.5 h-3.5" /> },
  vehicule: { label: 'Véhicule', color: 'bg-green-100 text-green-800', icon: <Car className="w-3.5 h-3.5" /> },
};

const loanStatusConfig: Record<LoanStatus, { label: string; color: string }> = {
  en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  rendu: { label: 'Rendu', color: 'bg-green-100 text-green-800' },
  en_retard: { label: 'En retard', color: 'bg-red-100 text-red-800' },
};

export default function StocksPage() {
  const [mode, setMode] = useState<StockMode>('simplifie');
  const [simplifiedTab, setSimplifiedTab] = useState<SimplifiedTab>('par_agent');
  const [siteVisibility, setSiteVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(mockSiteMaterials.map(s => [s.id, s.visibleAgent]))
  );

  const lowStockItems = mockStockRefs.filter(s => s.quantite <= s.seuilAlerte && s.seuilAlerte > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Gestion des stocks</h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
            <FileDown className="w-4 h-4" />
            Bon de remise de matériel
          </button>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('simplifie')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'simplifie' ? 'bg-white shadow text-foreground' : 'text-muted'
              }`}
            >
              Simplifié
            </button>
            <button
              onClick={() => setMode('complet')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'complet' ? 'bg-white shadow text-foreground' : 'text-muted'
              }`}
            >
              Complet
            </button>
          </div>
        </div>
      </div>

      {mode === 'simplifie' ? (
        <>
          {/* Simplified Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setSimplifiedTab('par_agent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                simplifiedTab === 'par_agent' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Par agent
            </button>
            <button
              onClick={() => setSimplifiedTab('par_site')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                simplifiedTab === 'par_site' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Par site
            </button>
          </div>

          {simplifiedTab === 'par_agent' ? (
            <div className="bg-surface rounded-card shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Collaborateur</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Matériel</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Qté</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date prêt</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date retour</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAgentMaterials.map(item => (
                      <tr key={item.id} className="border-b border-border hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{item.collaborateur}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{item.materiel}</td>
                        <td className="px-4 py-3 text-sm text-center text-foreground">{item.quantite}</td>
                        <td className="px-4 py-3 text-sm text-muted">{new Date(item.datePret).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {item.dateRetour ? new Date(item.dateRetour).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${loanStatusConfig[item.statut].color}`}>
                            {loanStatusConfig[item.statut].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-card shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Site</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Matériels</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Visible agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSiteMaterials.map(site => (
                      <tr key={site.id} className="border-b border-border hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{site.site}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {site.materiels.map((m, i) => (
                              <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{m}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSiteVisibility(prev => ({ ...prev, [site.id]: !prev[site.id] }))}
                            className={`p-1.5 rounded-lg transition-colors ${
                              siteVisibility[site.id] ? 'text-primary-600 bg-primary-50' : 'text-gray-400 bg-gray-50'
                            }`}
                          >
                            {siteVisibility[site.id] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Complete Mode - Dashboard Alerts */}
          {lowStockItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Alertes stock bas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                    <span className="text-sm text-foreground">{item.nom}</span>
                    <span className="text-sm font-semibold text-amber-700">{item.quantite} restant(s) (seuil: {item.seuilAlerte})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock References Table */}
          <div className="bg-surface rounded-card shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Références en stock</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Nom</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Type</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Quantité</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Prix unitaire</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Seuil alerte</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">QR Code</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStockRefs.map(ref => (
                    <tr key={ref.id} className={`border-b border-border hover:bg-gray-50 ${ref.quantite <= ref.seuilAlerte && ref.seuilAlerte > 0 ? 'bg-amber-50' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{ref.nom}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[ref.type].color}`}>
                          {typeConfig[ref.type].icon}
                          {typeConfig[ref.type].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-foreground">{ref.quantite}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">
                        {ref.prixUnitaire > 0 ? `${ref.prixUnitaire.toFixed(2)} \u20ac` : '—'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-muted">{ref.seuilAlerte > 0 ? ref.seuilAlerte : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <QrCode className="w-3.5 h-3.5" />
                          {ref.qrCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors" title="Attribuer">
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors" title="Retour">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Returns */}
          <div className="bg-surface rounded-card shadow-card p-4">
            <h2 className="font-semibold text-foreground mb-3">Retours en attente</h2>
            <div className="space-y-2">
              {mockAgentMaterials.filter(a => a.statut === 'en_retard').map(item => (
                <div key={item.id} className="flex items-center justify-between bg-red-50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.collaborateur}</p>
                    <p className="text-xs text-muted">{item.materiel}</p>
                  </div>
                  <span className="text-xs font-medium text-red-700">Prêté le {new Date(item.datePret).toLocaleDateString('fr-FR')}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
