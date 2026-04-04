'use client';

import { useState } from 'react';
import {
  ChevronDown, ChevronRight, CheckCircle, Send, ExternalLink,
  Calendar, AlertCircle, Clock, Check, Minus
} from 'lucide-react';

type LineStatus = 'a_valider' | 'validee';
type ClotureStatus = 'ouverte' | 'validee' | 'envoyee';

interface AgentLine {
  id: string;
  agent: string;
  heuresPlanifiees: number;
  heuresPointees: number;
  heuresAjustees: number;
  tauxHoraire: number;
  statut: LineStatus;
}

interface SiteData {
  id: string;
  nom: string;
  agents: AgentLine[];
}

interface ClientData {
  id: string;
  nom: string;
  sites: SiteData[];
}

interface HistoryCloture {
  mois: string;
  statut: ClotureStatus;
  totalHT: number;
  dateValidation: string;
  dateEnvoi: string | null;
}

const mockData: ClientData[] = [
  {
    id: 'cl-1',
    nom: 'Groupe Immobilier Haussmann',
    sites: [
      {
        id: 'st-1',
        nom: 'Tour Haussmann - Hall A',
        agents: [
          { id: 'ag-1', agent: 'Marie Dubois', heuresPlanifiees: 120, heuresPointees: 118, heuresAjustees: 118, tauxHoraire: 22.50, statut: 'a_valider' },
          { id: 'ag-2', agent: 'Jean-Pierre Martin', heuresPlanifiees: 80, heuresPointees: 80, heuresAjustees: 80, tauxHoraire: 22.50, statut: 'a_valider' },
        ],
      },
      {
        id: 'st-2',
        nom: 'Tour Haussmann - Hall B',
        agents: [
          { id: 'ag-3', agent: 'Fatima Benali', heuresPlanifiees: 100, heuresPointees: 95, heuresAjustees: 95, tauxHoraire: 21.00, statut: 'a_valider' },
          { id: 'ag-4', agent: 'Thomas Petit', heuresPlanifiees: 60, heuresPointees: 62, heuresAjustees: 62, tauxHoraire: 21.00, statut: 'a_valider' },
        ],
      },
    ],
  },
  {
    id: 'cl-2',
    nom: 'Boulangerie Dupont & Fils',
    sites: [
      {
        id: 'st-3',
        nom: 'Boulangerie Central',
        agents: [
          { id: 'ag-5', agent: 'Sophie Laurent', heuresPlanifiees: 40, heuresPointees: 40, heuresAjustees: 40, tauxHoraire: 20.00, statut: 'a_valider' },
          { id: 'ag-6', agent: 'Karim Zidane', heuresPlanifiees: 40, heuresPointees: 38, heuresAjustees: 38, tauxHoraire: 20.00, statut: 'a_valider' },
        ],
      },
      {
        id: 'st-4',
        nom: 'Boulangerie Annexe',
        agents: [
          { id: 'ag-7', agent: 'Marie Dubois', heuresPlanifiees: 20, heuresPointees: 20, heuresAjustees: 20, tauxHoraire: 22.50, statut: 'a_valider' },
          { id: 'ag-8', agent: 'Thomas Petit', heuresPlanifiees: 20, heuresPointees: 18, heuresAjustees: 18, tauxHoraire: 21.00, statut: 'a_valider' },
        ],
      },
    ],
  },
  {
    id: 'cl-3',
    nom: 'Résidences du Parc SAS',
    sites: [
      {
        id: 'st-5',
        nom: 'Résidence Bâtiment A',
        agents: [
          { id: 'ag-9', agent: 'Fatima Benali', heuresPlanifiees: 50, heuresPointees: 50, heuresAjustees: 50, tauxHoraire: 21.00, statut: 'a_valider' },
          { id: 'ag-10', agent: 'Jean-Pierre Martin', heuresPlanifiees: 50, heuresPointees: 48, heuresAjustees: 48, tauxHoraire: 22.50, statut: 'a_valider' },
        ],
      },
      {
        id: 'st-6',
        nom: 'Résidence Bâtiment B',
        agents: [
          { id: 'ag-11', agent: 'Sophie Laurent', heuresPlanifiees: 30, heuresPointees: 30, heuresAjustees: 30, tauxHoraire: 20.00, statut: 'a_valider' },
          { id: 'ag-12', agent: 'Karim Zidane', heuresPlanifiees: 30, heuresPointees: 28, heuresAjustees: 28, tauxHoraire: 20.00, statut: 'a_valider' },
        ],
      },
    ],
  },
];

const mockHistory: HistoryCloture[] = [
  { mois: 'Février 2026', statut: 'envoyee', totalHT: 18450.00, dateValidation: '2026-03-05', dateEnvoi: '2026-03-06' },
  { mois: 'Janvier 2026', statut: 'envoyee', totalHT: 17200.00, dateValidation: '2026-02-04', dateEnvoi: '2026-02-05' },
  { mois: 'Décembre 2025', statut: 'envoyee', totalHT: 16800.00, dateValidation: '2026-01-06', dateEnvoi: '2026-01-07' },
];

const months = [
  'Mars 2026', 'Février 2026', 'Janvier 2026', 'Décembre 2025', 'Novembre 2025',
];

export default function ClotureMensuellePage() {
  const [selectedMonth, setSelectedMonth] = useState('Mars 2026');
  const [data, setData] = useState<ClientData[]>(mockData);
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set(['cl-1']));
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set(['st-1']));
  const [clotureStatus, setClotureStatus] = useState<ClotureStatus>('ouverte');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleClient = (id: string) => {
    setExpandedClients(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSite = (id: string) => {
    setExpandedSites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const updateHeuresAjustees = (agentId: string, value: number) => {
    setData(prev =>
      prev.map(client => ({
        ...client,
        sites: client.sites.map(site => ({
          ...site,
          agents: site.agents.map(agent =>
            agent.id === agentId ? { ...agent, heuresAjustees: value } : agent
          ),
        })),
      }))
    );
  };

  const validateLine = (agentId: string) => {
    setData(prev =>
      prev.map(client => ({
        ...client,
        sites: client.sites.map(site => ({
          ...site,
          agents: site.agents.map(agent =>
            agent.id === agentId ? { ...agent, statut: 'validee' as LineStatus } : agent
          ),
        })),
      }))
    );
  };

  const validateAll = () => {
    setData(prev =>
      prev.map(client => ({
        ...client,
        sites: client.sites.map(site => ({
          ...site,
          agents: site.agents.map(agent => ({ ...agent, statut: 'validee' as LineStatus })),
        })),
      }))
    );
    setClotureStatus('validee');
  };

  const allValidated = data.every(c => c.sites.every(s => s.agents.every(a => a.statut === 'validee')));

  const totalHT = data.reduce((total, client) =>
    total + client.sites.reduce((sTotal, site) =>
      sTotal + site.agents.reduce((aTotal, agent) =>
        aTotal + agent.heuresAjustees * agent.tauxHoraire, 0), 0), 0);

  const sendToPennylane = () => {
    setClotureStatus('envoyee');
    setShowConfirmation(true);
  };

  const statusBadge: Record<ClotureStatus, { label: string; color: string }> = {
    ouverte: { label: 'Ouverte', color: 'bg-amber-100 text-amber-800' },
    validee: { label: 'Validée', color: 'bg-green-100 text-green-800' },
    envoyee: { label: 'Envoyée à PennyLane', color: 'bg-primary-100 text-primary-800' },
  };

  const historyStatusBadge: Record<ClotureStatus, { label: string; color: string }> = statusBadge;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Clôture mensuelle</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusBadge[clotureStatus].color}`}>
            {statusBadge[clotureStatus].label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirmation */}
      {showConfirmation && (
        <div className="bg-primary-50 border border-primary-200 rounded-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-primary-600" />
            <div>
              <p className="font-semibold text-primary-800">Clôture envoyée avec succès</p>
              <p className="text-sm text-primary-700">Les données de {selectedMonth} ont été transmises à PennyLane.</p>
            </div>
          </div>
          <a href="#" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Voir dans PennyLane
          </a>
        </div>
      )}

      {/* Total */}
      <div className="bg-surface rounded-card shadow-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Total HT du mois</p>
          <p className="text-2xl font-bold text-foreground">{totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
        </div>
        <div className="flex items-center gap-3">
          {!allValidated && clotureStatus === 'ouverte' && (
            <button
              onClick={validateAll}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Tout valider
            </button>
          )}
          {(allValidated || clotureStatus === 'validee') && clotureStatus !== 'envoyee' && (
            <button
              onClick={sendToPennylane}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              <Send className="w-4 h-4" />
              Envoyer à PennyLane
            </button>
          )}
        </div>
      </div>

      {/* Accordion: Client > Site > Agent */}
      <div className="space-y-3">
        {data.map(client => {
          const clientExpanded = expandedClients.has(client.id);
          const clientTotal = client.sites.reduce((t, s) =>
            t + s.agents.reduce((at, a) => at + a.heuresAjustees * a.tauxHoraire, 0), 0);

          return (
            <div key={client.id} className="bg-surface rounded-card shadow-card overflow-hidden">
              {/* Client Header */}
              <button
                onClick={() => toggleClient(client.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {clientExpanded ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronRight className="w-5 h-5 text-muted" />}
                  <span className="font-semibold text-foreground">{client.nom}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{clientTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} HT</span>
              </button>

              {clientExpanded && (
                <div className="border-t border-border">
                  {client.sites.map(site => {
                    const siteExpanded = expandedSites.has(site.id);
                    const siteTotal = site.agents.reduce((t, a) => t + a.heuresAjustees * a.tauxHoraire, 0);

                    return (
                      <div key={site.id} className="border-b border-border last:border-0">
                        {/* Site Header */}
                        <button
                          onClick={() => toggleSite(site.id)}
                          className="w-full flex items-center justify-between px-6 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {siteExpanded ? <ChevronDown className="w-4 h-4 text-muted" /> : <ChevronRight className="w-4 h-4 text-muted" />}
                            <span className="text-sm font-medium text-foreground">{site.nom}</span>
                          </div>
                          <span className="text-sm text-muted">{siteTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} HT</span>
                        </button>

                        {siteExpanded && (
                          <div className="px-6">
                            <table className="w-full">
                              <thead>
                                <tr className="text-xs text-muted">
                                  <th className="text-left py-2 font-semibold">Agent</th>
                                  <th className="text-center py-2 font-semibold">H. planifiées</th>
                                  <th className="text-center py-2 font-semibold">H. pointées</th>
                                  <th className="text-center py-2 font-semibold">H. ajustées</th>
                                  <th className="text-center py-2 font-semibold">Delta</th>
                                  <th className="text-right py-2 font-semibold">Taux (h)</th>
                                  <th className="text-right py-2 font-semibold">Total HT</th>
                                  <th className="text-center py-2 font-semibold">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {site.agents.map(agent => {
                                  const delta = agent.heuresAjustees - agent.heuresPlanifiees;
                                  const totalLine = agent.heuresAjustees * agent.tauxHoraire;

                                  return (
                                    <tr key={agent.id} className="border-t border-border">
                                      <td className="py-2.5 text-sm font-medium text-foreground">{agent.agent}</td>
                                      <td className="py-2.5 text-sm text-center text-muted">{agent.heuresPlanifiees}h</td>
                                      <td className="py-2.5 text-sm text-center text-muted">{agent.heuresPointees}h</td>
                                      <td className="py-2.5 text-center">
                                        {clotureStatus === 'envoyee' ? (
                                          <span className="text-sm text-foreground">{agent.heuresAjustees}h</span>
                                        ) : (
                                          <input
                                            type="number"
                                            value={agent.heuresAjustees}
                                            onChange={(e) => updateHeuresAjustees(agent.id, Number(e.target.value))}
                                            className="w-16 text-center border border-border rounded px-2 py-1 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
                                            disabled={agent.statut === 'validee'}
                                          />
                                        )}
                                      </td>
                                      <td className="py-2.5 text-center">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                          delta === 0 ? 'text-green-600' : 'text-amber-600'
                                        }`}>
                                          {delta === 0 ? (
                                            <CheckCircle className="w-3.5 h-3.5" />
                                          ) : (
                                            <AlertCircle className="w-3.5 h-3.5" />
                                          )}
                                          {delta > 0 ? '+' : ''}{delta}h
                                        </span>
                                      </td>
                                      <td className="py-2.5 text-sm text-right text-muted">{agent.tauxHoraire.toFixed(2)} \u20ac</td>
                                      <td className="py-2.5 text-sm text-right font-semibold text-foreground">
                                        {totalLine.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                      </td>
                                      <td className="py-2.5 text-center">
                                        {agent.statut === 'validee' ? (
                                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Validée
                                          </span>
                                        ) : clotureStatus !== 'envoyee' ? (
                                          <button
                                            onClick={() => validateLine(agent.id)}
                                            className="px-3 py-1 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100 transition-colors"
                                          >
                                            Valider
                                          </button>
                                        ) : null}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* History */}
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">Historique des clôtures</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Mois</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Statut</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Total HT</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date validation</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date envoi</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((h, i) => (
              <tr key={i} className="border-b border-border hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{h.mois}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${historyStatusBadge[h.statut].color}`}>
                    {historyStatusBadge[h.statut].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-foreground text-right">
                  {h.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-4 py-3 text-sm text-muted">{new Date(h.dateValidation).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-sm text-muted">{h.dateEnvoi ? new Date(h.dateEnvoi).toLocaleDateString('fr-FR') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
