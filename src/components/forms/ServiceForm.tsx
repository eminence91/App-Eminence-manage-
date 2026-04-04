'use client';

import { useState } from 'react';
import { X, Plus, Copy, Search, Star, Phone, Trash2, Info, MapPin, Clock, Users, FileText, Pause, Save } from 'lucide-react';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockAgents = [
  { id: '1', name: 'Mohamed K.', city: 'Villebon-sur-Yvette', rating: 4, hasLicense: true, hoursThisMonth: 22, available: true },
  { id: '2', name: 'Fatou D.', city: 'Antony', rating: 5, hasLicense: true, hoursThisMonth: 18, available: true },
  { id: '3', name: 'Ibrahim S.', city: 'Massy', rating: 3, hasLicense: true, hoursThisMonth: 28, available: false },
  { id: '4', name: 'Aminata C.', city: 'Palaiseau', rating: 4, hasLicense: true, hoursThisMonth: 14, available: true },
  { id: '5', name: 'Mamadou T.', city: 'Orsay', rating: 3, hasLicense: false, hoursThisMonth: 20, available: true },
  { id: '6', name: 'Aissatou B.', city: 'Les Ulis', rating: 4, hasLicense: true, hoursThisMonth: 16, available: true },
];

const formTabs = [
  { id: 'general', label: 'Général', icon: <Info size={16} /> },
  { id: 'collaborateurs', label: 'Collaborateurs', icon: <Users size={16} />, count: '0/1' },
  { id: 'instructions', label: 'Instructions', icon: <FileText size={16} /> },
  { id: 'pauses', label: 'Pauses', icon: <Pause size={16} />, count: '0' },
];

export default function ServiceForm({ isOpen, onClose }: ServiceFormProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [isPublished, setIsPublished] = useState(false);
  const [isTour, setIsTour] = useState(false);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [assignedAgents, setAssignedAgents] = useState<string[]>([]);
  const [searchAgent, setSearchAgent] = useState('');
  const [filterDispo, setFilterDispo] = useState(true);
  const [filterLicense, setFilterLicense] = useState(false);
  const [positions, setPositions] = useState(1);

  if (!isOpen) return null;

  const availableAgents = mockAgents.filter(a => {
    if (assignedAgents.includes(a.id)) return false;
    if (filterDispo && !a.available) return false;
    if (filterLicense && !a.hasLicense) return false;
    if (searchAgent && !a.name.toLowerCase().includes(searchAgent.toLowerCase())) return false;
    return true;
  });

  const assignAgent = (id: string) => setAssignedAgents(prev => [...prev, id]);
  const unassignAgent = (id: string) => setAssignedAgents(prev => prev.filter(x => x !== id));

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}</div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full h-full lg:w-[90%] lg:h-[90%] lg:rounded-xl lg:shadow-modal flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary-500 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-semibold text-lg">Nouveau service</h2>
            <p className="text-sm text-white/80">03/04/2026 08:00 — 16:00</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle SERVICE / TOURNÉE */}
            <div className="flex bg-white/20 rounded-lg p-0.5">
              <button onClick={() => setIsTour(false)} className={`px-3 py-1 text-xs rounded-md transition-colors ${!isTour ? 'bg-white text-primary-600 font-medium' : 'text-white/80'}`}>SERVICE</button>
              <button onClick={() => setIsTour(true)} className={`px-3 py-1 text-xs rounded-md transition-colors ${isTour ? 'bg-white text-primary-600 font-medium' : 'text-white/80'}`}>TOURNÉE</button>
            </div>
            <button className="p-1 bg-white/20 rounded hover:bg-white/30"><Plus size={18} /></button>
            <button className="p-1 bg-white/20 rounded hover:bg-white/30"><Copy size={18} /></button>
            <button onClick={onClose} className="p-1 bg-white/20 rounded hover:bg-white/30"><X size={18} /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left tabs */}
          <div className="w-52 bg-gray-50 border-r border-border flex-shrink-0 hidden lg:block">
            {formTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-600 border-l-3 border-primary-500 font-medium' : 'text-muted hover:bg-gray-100'}`}>
                <span className="flex items-center gap-2">{tab.icon} {tab.label}</span>
                {tab.count && <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded">{tab.id === 'collaborateurs' ? `${assignedAgents.length}/${positions}` : tab.count}</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
              <div className="relative max-w-2xl">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-200" />
                <div className="space-y-8">
                  <div className="relative pl-12">
                    <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><MapPin size={16} /></div>
                    <h3 className="text-base font-semibold mb-4">Informations générales du service</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Site *</label>
                        <div className="flex gap-2">
                          <input placeholder="Sélectionner un site..." className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                          <button className="p-2 border border-border rounded-lg hover:bg-gray-50"><X size={16} className="text-muted" /></button>
                          <button className="p-2 bg-primary-500 text-white rounded-lg"><Plus size={16} /></button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Prestation</label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                          <option value="">Sans prestation</option>
                          <option>Nettoyage bureaux standard</option>
                          <option>Remise en état après travaux</option>
                          <option>Entretien parties communes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-12">
                    <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><Clock size={16} /></div>
                    <h3 className="text-base font-semibold mb-4">Planification</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Date</label>
                          <input type="date" defaultValue="2026-04-03" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Heure début</label>
                          <input type="time" defaultValue="08:00" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Heure fin</label>
                          <input type="time" defaultValue="16:00" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                      </div>

                      <button onClick={() => setShowRecurrence(!showRecurrence)} className="text-sm text-primary-500 hover:text-primary-600">
                        {showRecurrence ? '▼' : '▶'} Récurrence
                      </button>

                      {showRecurrence && (
                        <div className="p-4 border border-border rounded-lg space-y-3 bg-gray-50">
                          <div className="flex flex-wrap gap-2">
                            {['Quotidienne', 'Hebdomadaire', 'Mensuelle', 'Jours fériés'].map(p => (
                              <button key={p} className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-white">{p}</button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                              <button key={d} className="w-10 h-10 text-xs border border-border rounded-lg hover:bg-primary-50 hover:border-primary-500">{d}</button>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs text-muted mb-1">Date début</label><input type="date" className="w-full px-3 py-2 border border-border rounded-lg text-sm" /></div>
                            <div><label className="block text-xs text-muted mb-1">Date fin</label><input type="date" className="w-full px-3 py-2 border border-border rounded-lg text-sm" /></div>
                          </div>
                          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded text-primary-500" /> Exclure jours fériés</label>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Mode de facturation</label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                          <option>À l&apos;heure</option><option>Au forfait</option><option>Au service</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'collaborateurs' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted mb-1">Nombre de postes</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPositions(Math.max(1, positions - 1))} className="w-8 h-8 border border-border rounded text-center hover:bg-gray-50">-</button>
                    <span className="w-8 text-center font-medium">{positions}</span>
                    <button onClick={() => setPositions(positions + 1)} className="w-8 h-8 border border-border rounded text-center hover:bg-gray-50">+</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available agents */}
                  <div>
                    <h4 className="text-sm font-medium text-muted mb-3">Agents disponibles</h4>
                    <div className="space-y-2 mb-3">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input value={searchAgent} onChange={e => setSearchAgent(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm" />
                      </div>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={filterLicense} onChange={e => setFilterLicense(e.target.checked)} className="rounded text-primary-500" /> Avec licence</label>
                        <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={filterDispo} onChange={e => setFilterDispo(e.target.checked)} className="rounded text-primary-500" /> Dispo.</label>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {availableAgents.map(agent => (
                        <button key={agent.id} onClick={() => assignAgent(agent.id)} className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-primary-50 hover:border-primary-300 text-left transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">{agent.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{agent.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${agent.hasLicense ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{agent.hasLicense ? 'Avec licence' : 'Sans licence'}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {renderStars(agent.rating)}
                              <Phone size={10} className="text-muted" />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted">{agent.city}</span>
                              <span className="text-xs bg-primary-50 text-primary-600 px-1.5 rounded">{agent.hoursThisMonth}h</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assigned agents */}
                  <div>
                    <h4 className="text-sm font-medium text-muted mb-3">Agents affectés <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded ml-1">{assignedAgents.length}/{positions}</span></h4>
                    {assignedAgents.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-border rounded-lg">
                        <Users size={32} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-muted">Cliquez sur un agent pour l&apos;affecter</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {assignedAgents.map(id => {
                          const agent = mockAgents.find(a => a.id === id)!;
                          return (
                            <div key={id} className="flex items-center gap-3 p-3 border border-primary-200 bg-primary-50 rounded-lg">
                              <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-medium text-sm">{agent.name.charAt(0)}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{agent.name}</span>
                                  {renderStars(agent.rating)}
                                </div>
                                <span className="text-xs text-muted">{agent.city} · {agent.hoursThisMonth}h</span>
                                <input placeholder="Intitulé du poste" className="mt-1 w-full px-2 py-1 border border-border rounded text-xs focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white" />
                              </div>
                              <button onClick={() => unassignAgent(id)} className="p-1.5 hover:bg-red-100 rounded"><Trash2 size={16} className="text-danger" /></button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold">Instructions du service</h3>
                <textarea placeholder="Consignes spécifiques pour ce service..." rows={6} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <p className="text-sm text-muted">Glissez des fichiers ici ou cliquez pour joindre des pièces</p>
                </div>
              </div>
            )}

            {activeTab === 'pauses' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-semibold">Pauses</h3>
                <div className="p-4 border border-border rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Heure début</label>
                      <input type="time" defaultValue="12:00" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Heure fin</label>
                      <input type="time" defaultValue="12:30" className="w-full px-3 py-2 border border-border rounded-lg text-sm" />
                    </div>
                  </div>
                  <p className="text-xs text-muted">ou</p>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Durée (minutes)</label>
                    <input type="number" defaultValue={30} className="w-32 px-3 py-2 border border-border rounded-lg text-sm" />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="rounded text-primary-500" /> Soustraire du temps de travail</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="rounded text-primary-500" /> Soustraire de la facturation</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-white flex-shrink-0">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded text-primary-500" />
            Planifier — Afficher aux collaborateurs
            <span title="Si décoché, le service sera en mode brouillon (hachuré), invisible pour les agents"><Info size={14} className="text-muted" /></span>
          </label>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600">
            <Save size={18} /> ENREGISTRER
          </button>
        </div>
      </div>
    </div>
  );
}
