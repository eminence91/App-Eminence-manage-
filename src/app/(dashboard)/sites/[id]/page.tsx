'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Save, Info, MapPin, Calendar, Users, FileText,
  Key, Globe, Settings, Plus, Trash2, Star, X, Eye, EyeOff,
  Camera, Upload, Clock, AlertTriangle, Palette
} from 'lucide-react';

const verticalTabs = [
  { id: 'general', label: 'Général', icon: <Info size={16} /> },
  { id: 'periodes', label: 'Périodes', icon: <Clock size={16} /> },
  { id: 'prestations', label: 'Prestations & Tarifs', icon: <FileText size={16} /> },
  { id: 'fermetures', label: 'Périodes de fermeture', icon: <Calendar size={16} /> },
  { id: 'collaborateurs', label: 'Collaborateurs', icon: <Users size={16} /> },
  { id: 'instructions', label: 'Instructions', icon: <FileText size={16} /> },
  { id: 'cles', label: 'Clés et accès', icon: <Key size={16} /> },
  { id: 'terrain', label: 'Terrain', icon: <Globe size={16} /> },
];

const mockSite = {
  name: 'Clinique de Neuilly',
  color: '#4CAF50',
  client: 'Groupe Hospitalier Paris',
  photoUrl: '',
  country: 'France',
  postalCode: '92200',
  city: 'Neuilly-sur-Seine',
  address: '27 Boulevard du Commandant Charcot',
  complement: 'Bâtiment A',
  latitude: 48.884,
  longitude: 2.269,
  perimeterRadius: 200,
};

const mockPeriods = [
  { id: '1', day: 'Lundi', startTime: '08:00', endTime: '16:00' },
  { id: '2', day: 'Mardi', startTime: '08:00', endTime: '16:00' },
  { id: '3', day: 'Mercredi', startTime: '08:00', endTime: '16:00' },
  { id: '4', day: 'Jeudi', startTime: '08:00', endTime: '16:00' },
  { id: '5', day: 'Vendredi', startTime: '08:00', endTime: '14:00' },
];

const mockClosures = [
  { id: '1', label: 'Vacances de Noël', startDate: '24/12/2026', endDate: '02/01/2027', reason: 'Fermeture annuelle' },
  { id: '2', label: 'Pont de l\'Ascension', startDate: '14/05/2026', endDate: '17/05/2026', reason: 'Fermeture exceptionnelle' },
];

const mockFavorites = [
  { id: '1', name: 'Mohamed K.', city: 'Villebon-sur-Yvette' },
  { id: '2', name: 'Fatou D.', city: 'Antony' },
];
const mockForbidden = [
  { id: '3', name: 'Ibrahim S.', city: 'Massy', reason: 'Incident signalé' },
];

const mockInstructions = [
  { id: '1', title: 'Protocole nettoyage blocs opératoires', content: 'Utiliser uniquement les produits bactéricides fournis...', isUrgent: true },
  { id: '2', title: 'Horaires accès parking', content: 'Le parking est accessible de 6h à 22h. Badge requis.', isUrgent: false },
];

const mockKeys = [
  { id: '1', label: 'Code alarme entrée principale', value: '4589#', notes: 'Désactiver dans les 30 secondes' },
  { id: '2', label: 'Badge ascenseur étages', value: 'Badge #A-042', notes: 'Récupérer à l\'accueil' },
  { id: '3', label: 'Clé local ménage', value: 'Clé n°7 trousseau', notes: 'Sous-sol -1' },
];

export default function SiteDetailPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [site, setSite] = useState(mockSite);
  const [showKeyValues, setShowKeyValues] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/sites" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: site.color }} />
          <div>
            <h1 className="text-xl font-bold text-foreground">{site.name}</h1>
            <p className="text-sm text-muted">{site.client}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left vertical tabs */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-surface rounded-card shadow-card overflow-hidden">
            {verticalTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-600 border-l-3 border-primary-500 font-medium' : 'text-muted hover:bg-gray-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden w-full overflow-x-auto pb-2 -mt-2">
          <div className="flex gap-1">
            {verticalTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 text-xs rounded-full whitespace-nowrap ${activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-muted'}`}>{tab.label}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface rounded-card shadow-card p-6">
          {activeTab === 'general' && (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-200" />
              <div className="space-y-8">
                {/* Informations générales */}
                <div className="relative pl-12">
                  <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><Info size={16} /></div>
                  <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-muted mb-1">Nom du site *</label>
                        <div className="flex gap-2">
                          <input value={site.name} onChange={e => setSite({...site, name: e.target.value})} className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                          <button className="p-2 border border-border rounded-lg hover:bg-gray-50" title="Couleur du site"><Palette size={18} style={{color: site.color}} /></button>
                        </div>
                      </div>
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"><Settings size={24} className="text-gray-400" /></div>
                        <div className="flex gap-1">
                          <button className="p-1 bg-primary-500 rounded text-white"><Camera size={12} /></button>
                          <button className="p-1 bg-primary-500 rounded text-white"><Upload size={12} /></button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Client *</label>
                      <div className="flex gap-2">
                        <input value={site.client} readOnly className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-gray-50" />
                        <button className="p-2 bg-primary-500 text-white rounded-lg"><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="relative pl-12">
                  <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><MapPin size={16} /></div>
                  <h3 className="text-lg font-semibold mb-4">Adresse</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Pays</label>
                          <input value={site.country} onChange={e => setSite({...site, country: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Code postal *</label>
                          <input value={site.postalCode} onChange={e => setSite({...site, postalCode: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Ville *</label>
                        <input value={site.city} onChange={e => setSite({...site, city: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Adresse *</label>
                        <input value={site.address} onChange={e => setSite({...site, address: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-1">Complément</label>
                        <input value={site.complement} onChange={e => setSite({...site, complement: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Latitude *</label>
                          <input type="number" step="any" value={site.latitude} readOnly className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-gray-50" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-1">Longitude *</label>
                          <input type="number" step="any" value={site.longitude} readOnly className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-gray-50" />
                        </div>
                      </div>
                    </div>

                    {/* Map placeholder */}
                    <div>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-border">
                        <div className="text-center">
                          <MapPin size={32} className="text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-muted">Carte Google Maps</p>
                          <p className="text-xs text-gray-400">Configurez GOOGLE_MAPS_API_KEY</p>
                        </div>
                      </div>

                      {/* Perimeter slider */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-muted mb-2">Rayon du périmètre</label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted w-10">100m</span>
                          <input
                            type="range"
                            min={100}
                            max={500}
                            step={10}
                            value={site.perimeterRadius}
                            onChange={e => setSite({...site, perimeterRadius: Number(e.target.value)})}
                            className="flex-1 accent-primary-500"
                          />
                          <span className="text-xs text-muted w-10">500m</span>
                        </div>
                        <p className="text-center text-sm font-medium text-primary-500 mt-1">{site.perimeterRadius}m</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"><Save size={18} /> ENREGISTRER</button>
              </div>
            </div>
          )}

          {activeTab === 'periodes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Périodes de travail</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Ajouter</button>
              </div>
              <table className="w-full">
                <thead className="border-b border-border"><tr>
                  <th className="text-left py-2 text-xs text-muted uppercase">Jour</th>
                  <th className="text-left py-2 text-xs text-muted uppercase">Début</th>
                  <th className="text-left py-2 text-xs text-muted uppercase">Fin</th>
                  <th className="text-right py-2 text-xs text-muted uppercase">Actions</th>
                </tr></thead>
                <tbody>
                  {mockPeriods.map(p => (
                    <tr key={p.id} className="border-b border-border">
                      <td className="py-3 text-sm">{p.day}</td>
                      <td className="py-3 text-sm">{p.startTime}</td>
                      <td className="py-3 text-sm">{p.endTime}</td>
                      <td className="py-3 text-right"><button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'prestations' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Prestations & Tarifs du site</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Associer une prestation</button>
              </div>
              <table className="w-full">
                <thead className="border-b border-border"><tr>
                  <th className="text-left py-2 text-xs text-muted uppercase">Prestation</th>
                  <th className="text-right py-2 text-xs text-muted uppercase">Tarif horaire jour</th>
                  <th className="text-right py-2 text-xs text-muted uppercase">Tarif tournée</th>
                  <th className="text-right py-2 text-xs text-muted uppercase">Actions</th>
                </tr></thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 text-sm">Nettoyage bureaux standard</td>
                    <td className="py-3 text-sm text-right">22.50 €/h</td>
                    <td className="py-3 text-sm text-right">18.00 €</td>
                    <td className="py-3 text-right"><button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'fermetures' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Périodes de fermeture</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Ajouter</button>
              </div>
              <div className="space-y-3">
                {mockClosures.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{c.label}</p>
                      <p className="text-xs text-muted"><Calendar size={12} className="inline mr-1" />{c.startDate} — {c.endDate}</p>
                      <p className="text-xs text-muted mt-0.5">{c.reason}</p>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'collaborateurs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Star size={16} className="text-success" /> Favoris</h3>
                <div className="space-y-2">
                  {mockFavorites.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-xs font-medium">{f.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{f.name}</p>
                          <p className="text-xs text-muted">{f.city}</p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-green-100 rounded"><X size={14} className="text-muted" /></button>
                    </div>
                  ))}
                  <button className="w-full p-2 border border-dashed border-green-300 rounded-lg text-xs text-green-600 hover:bg-green-50"><Plus size={14} className="inline mr-1" /> Ajouter un favori</button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><X size={16} className="text-danger" /> Interdits</h3>
                <div className="space-y-2">
                  {mockForbidden.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-xs font-medium">{f.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{f.name}</p>
                          <p className="text-xs text-muted">{f.city} — {f.reason}</p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-red-100 rounded"><X size={14} className="text-muted" /></button>
                    </div>
                  ))}
                  <button className="w-full p-2 border border-dashed border-red-300 rounded-lg text-xs text-red-600 hover:bg-red-50"><Plus size={14} className="inline mr-1" /> Ajouter un interdit</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Instructions</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Ajouter</button>
              </div>
              <div className="space-y-3">
                {mockInstructions.map(ins => (
                  <div key={ins.id} className={`p-4 border rounded-lg ${ins.isUrgent ? 'border-danger bg-red-50' : 'border-border'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{ins.title}</h4>
                        {ins.isUrgent && <span className="text-xs bg-danger text-white px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={10} /> Urgent</span>}
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button>
                    </div>
                    <p className="text-sm text-muted">{ins.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cles' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Clés et codes d&apos;accès</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Ajouter</button>
              </div>
              <p className="text-xs text-muted mb-4 flex items-center gap-1"><Key size={12} /> Visible uniquement par l&apos;agent lors du service actif</p>
              <div className="space-y-3">
                {mockKeys.map(key => (
                  <div key={key.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{key.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                          {showKeyValues[key.id] ? key.value : '••••••'}
                        </code>
                        <button onClick={() => setShowKeyValues(prev => ({...prev, [key.id]: !prev[key.id]}))} className="p-1 hover:bg-gray-100 rounded">
                          {showKeyValues[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {key.notes && <p className="text-xs text-muted mt-1">{key.notes}</p>}
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'terrain' && (
            <div className="space-y-6">
              <h3 className="font-semibold">Configuration terrain</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Main courante électronique</p>
                    <p className="text-xs text-muted">Activer le suivi MCE sur ce site</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary-500 focus:ring-primary-500" />
                </label>
                <label className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Bon d&apos;intervention</p>
                    <p className="text-xs text-muted">Activer les bons d&apos;intervention sur ce site</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary-500 focus:ring-primary-500" />
                </label>
                <label className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Détection sortie de périmètre</p>
                    <p className="text-xs text-muted">Alerter si l&apos;agent sort du rayon configuré ({site.perimeterRadius}m)</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary-500 focus:ring-primary-500" />
                </label>
              </div>
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"><Save size={18} /> ENREGISTRER</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
