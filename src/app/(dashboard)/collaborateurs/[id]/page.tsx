'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Save, User, FileText, MapPin, Star, Briefcase,
  Shield, Clock, Package, AlertTriangle, Plus, Trash2,
  Upload, Calendar, CreditCard, Eye, Download
} from 'lucide-react';

const verticalTabs = [
  { id: 'info', label: 'Informations', icon: <User size={16} /> },
  { id: 'pro', label: 'Professionnel', icon: <Briefcase size={16} /> },
  { id: 'materiel', label: 'Matériel prêté', icon: <Package size={16} /> },
  { id: 'expirations', label: 'Expirations', icon: <AlertTriangle size={16} /> },
  { id: 'restrictions', label: 'Restrictions', icon: <Clock size={16} /> },
  { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
  { id: 'salaire', label: 'Éléments de salaire', icon: <CreditCard size={16} /> },
];

const mockCollab = {
  type: 'employee', firstName: 'Mohamed', lastName: 'Keita', email: 'mohamed.keita@eminence-sn.com',
  phone: '06 12 34 56 78', gender: 'male', birthDate: '1988-05-15', birthCity: 'Dakar',
  nationality: 'Sénégalaise', ssn: '1 88 05 99 123 456 78', country: 'France',
  postalCode: '91140', city: 'Villebon-sur-Yvette', address: '12 rue des Lilas',
  rating: 4, comments: 'Collaborateur fiable et ponctuel.', matricule: 'MAT-2024-001',
  seniorityDate: '2020-03-15', status: 'active', hasLicense: true,
};

const mockContracts = [
  { id: '1', type: 'CDI', startDate: '15/03/2020', endDate: null, weeklyHours: 35, hourlyRate: 12.50, status: 'active' },
  { id: '2', type: 'CDD', startDate: '01/01/2020', endDate: '14/03/2020', weeklyHours: 35, hourlyRate: 11.80, status: 'terminated' },
];

const mockMaterials = [
  { id: '1', name: 'Tenue de travail', reference: 'TEN-001', size: 'L', qty: 2, lentAt: '15/03/2020', returnDue: null, returned: null },
  { id: '2', name: 'Badge accès', reference: 'BAD-042', size: '—', qty: 1, lentAt: '15/03/2020', returnDue: null, returned: null },
  { id: '3', name: 'Talkie-walkie', reference: 'TW-007', size: '—', qty: 1, lentAt: '01/06/2024', returnDue: '01/06/2025', returned: null },
];

const mockExpirations = [
  { id: '1', type: 'Carte d\'identité', expiresAt: '2028-12-15', daysLeft: 998, status: 'ok' },
  { id: '2', type: 'Titre de séjour', expiresAt: '2026-06-30', daysLeft: 88, status: 'warning' },
  { id: '3', type: 'Visite médicale', expiresAt: '2026-04-20', daysLeft: 17, status: 'danger' },
  { id: '4', type: 'DPAE', expiresAt: '2027-03-15', daysLeft: 347, status: 'ok' },
];

const mockRestrictions = [
  { id: '1', day: 'Samedi', type: 'Indisponible', notes: 'Raison personnelle' },
  { id: '2', day: 'Tous les jours', type: 'Pas de nuit', notes: 'Contrainte familiale' },
];

const mockSalaryElements = [
  { id: '1', type: 'Prime', amount: 150, description: 'Prime de performance Q1', status: 'validated' },
  { id: '2', type: 'Transport', amount: 75.20, description: 'Navigo mars 2026', status: 'validated' },
  { id: '3', type: 'Acompte', amount: -300, description: 'Acompte mi-mars', status: 'validated' },
  { id: '4', type: 'Indemnités km', amount: 45.60, description: '120km × 0.38€', status: 'pending' },
];

const typeLabels: Record<string, string> = {
  employee: 'Employé', emergency: 'Agent d\'urgence', provider: 'Prestataire',
  freelance: 'TNS', candidate: 'Candidat', interim: 'Intérimaire'
};

export default function CollaborateurDetailPage() {
  const [activeTab, setActiveTab] = useState('info');
  const [collab, setCollab] = useState(mockCollab);

  const renderStars = (rating: number, onClick?: (v: number) => void) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onClick?.(i)} className={`${onClick ? 'cursor-pointer' : 'cursor-default'}`}>
          <Star size={18} className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/collaborateurs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
          {collab.firstName.charAt(0)}{collab.lastName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{collab.firstName} {collab.lastName}</h1>
            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">{collab.matricule}</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Actif</span>
            {collab.hasLicense && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Avec licence</span>}
          </div>
          <div className="flex items-center gap-2 mt-1">{renderStars(collab.rating)}</div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left vertical tabs */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <div className="bg-surface rounded-card shadow-card overflow-hidden">
            {verticalTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left ${activeTab === tab.id ? 'bg-primary-50 text-primary-600 border-l-3 border-primary-500 font-medium' : 'text-muted hover:bg-gray-50'}`}>
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
          {activeTab === 'info' && (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-200" />
              <div className="space-y-8">
                <div className="relative pl-12">
                  <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><User size={16} /></div>
                  <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Type</label>
                      <select value={collab.type} onChange={e => setCollab({...collab, type: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                        {Object.entries(typeLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Genre</label>
                      <select value={collab.gender} onChange={e => setCollab({...collab, gender: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                        <option value="male">Homme</option><option value="female">Femme</option><option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Prénom *</label>
                      <input value={collab.firstName} onChange={e => setCollab({...collab, firstName: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Nom *</label>
                      <input value={collab.lastName} onChange={e => setCollab({...collab, lastName: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Email *</label>
                      <input type="email" value={collab.email} onChange={e => setCollab({...collab, email: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Téléphone</label>
                      <input value={collab.phone} onChange={e => setCollab({...collab, phone: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><FileText size={16} /></div>
                  <h3 className="text-lg font-semibold mb-4">État civil</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-muted mb-1">Date de naissance</label><input type="date" value={collab.birthDate} onChange={e => setCollab({...collab, birthDate: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium text-muted mb-1">Ville de naissance</label><input value={collab.birthCity} onChange={e => setCollab({...collab, birthCity: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium text-muted mb-1">Nationalité</label><input value={collab.nationality} onChange={e => setCollab({...collab, nationality: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium text-muted mb-1">N° Sécurité sociale</label><input value={collab.ssn} onChange={e => setCollab({...collab, ssn: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><MapPin size={16} /></div>
                  <h3 className="text-lg font-semibold mb-4">Adresse</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-muted mb-1">Code postal</label><input value={collab.postalCode} onChange={e => setCollab({...collab, postalCode: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium text-muted mb-1">Ville</label><input value={collab.city} onChange={e => setCollab({...collab, city: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-muted mb-1">Adresse</label><input value={collab.address} onChange={e => setCollab({...collab, address: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
                  </div>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10"><Star size={16} /></div>
                  <h3 className="text-lg font-semibold mb-4">Interne</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Notation</label>
                      {renderStars(collab.rating, (v) => setCollab({...collab, rating: v}))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-1">Commentaires internes</label>
                      <textarea value={collab.comments} onChange={e => setCollab({...collab, comments: e.target.value})} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"><Save size={18} /> ENREGISTRER</button>
              </div>
            </div>
          )}

          {activeTab === 'pro' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-muted mb-1">Matricule</label><input value={collab.matricule} readOnly className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-muted mb-1">Date d&apos;ancienneté</label><input type="date" value={collab.seniorityDate} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Contrats de travail</h3><button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Nouveau contrat</button></div>
                <table className="w-full"><thead className="border-b border-border"><tr>
                  <th className="text-left py-2 text-xs text-muted uppercase">Type</th><th className="text-left py-2 text-xs text-muted uppercase">Début</th><th className="text-left py-2 text-xs text-muted uppercase">Fin</th><th className="text-right py-2 text-xs text-muted uppercase">Heures/sem</th><th className="text-right py-2 text-xs text-muted uppercase">Taux horaire</th><th className="text-left py-2 text-xs text-muted uppercase">Statut</th>
                </tr></thead><tbody>
                  {mockContracts.map(c => (
                    <tr key={c.id} className="border-b border-border">
                      <td className="py-3 text-sm font-medium">{c.type}</td>
                      <td className="py-3 text-sm">{c.startDate}</td>
                      <td className="py-3 text-sm">{c.endDate || '—'}</td>
                      <td className="py-3 text-sm text-right">{c.weeklyHours}h</td>
                      <td className="py-3 text-sm text-right">{c.hourlyRate.toFixed(2)} €</td>
                      <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.status === 'active' ? 'Actif' : 'Terminé'}</span></td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Shield size={16} className="text-primary-500" /> Compte utilisateur (Licence terrain)</h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={collab.hasLicense} className="rounded text-primary-500" /> Licence active</label>
                  <span className="text-xs text-muted">Email: {collab.email}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materiel' && (
            <div>
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Matériel prêté</h3><button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Ajouter</button></div>
              <table className="w-full"><thead className="border-b border-border"><tr>
                <th className="text-left py-2 text-xs text-muted uppercase">Description</th><th className="text-left py-2 text-xs text-muted uppercase">Réf.</th><th className="text-center py-2 text-xs text-muted uppercase">Taille</th><th className="text-center py-2 text-xs text-muted uppercase">Qté</th><th className="text-left py-2 text-xs text-muted uppercase">Prêté le</th><th className="text-left py-2 text-xs text-muted uppercase">Restitution</th><th className="text-right py-2 text-xs text-muted uppercase">Actions</th>
              </tr></thead><tbody>
                {mockMaterials.map(m => (
                  <tr key={m.id} className="border-b border-border">
                    <td className="py-3 text-sm font-medium">{m.name}</td><td className="py-3 text-sm text-muted">{m.reference}</td><td className="py-3 text-sm text-center">{m.size}</td><td className="py-3 text-sm text-center">{m.qty}</td><td className="py-3 text-sm">{m.lentAt}</td>
                    <td className="py-3 text-sm">{m.returnDue || '—'}</td>
                    <td className="py-3 text-right"><button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button></td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          )}

          {activeTab === 'expirations' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Expirations réglementaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockExpirations.map(exp => {
                  const pct = Math.max(0, Math.min(100, (exp.daysLeft / 365) * 100));
                  const barColor = exp.status === 'ok' ? 'bg-success' : exp.status === 'warning' ? 'bg-warning' : 'bg-danger';
                  return (
                    <div key={exp.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">{exp.type}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${exp.status === 'ok' ? 'bg-green-100 text-green-700' : exp.status === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                          {exp.daysLeft}j restants
                        </span>
                      </div>
                      <p className="text-xs text-muted mb-2">Expire le {exp.expiresAt}</p>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{width: `${pct}%`}} />
                      </div>
                      <button className="mt-3 text-xs text-primary-500 flex items-center gap-1"><Upload size={12} /> Joindre un document</button>
                    </div>
                  );
                })}
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted hover:bg-gray-50"><Plus size={16} /> Ajouter une expiration</button>
            </div>
          )}

          {activeTab === 'restrictions' && (
            <div>
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Restrictions horaires</h3><button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Ajouter</button></div>
              <table className="w-full"><thead className="border-b border-border"><tr>
                <th className="text-left py-2 text-xs text-muted uppercase">Jour</th><th className="text-left py-2 text-xs text-muted uppercase">Type</th><th className="text-left py-2 text-xs text-muted uppercase">Notes</th><th className="text-right py-2 text-xs text-muted uppercase">Actions</th>
              </tr></thead><tbody>
                {mockRestrictions.map(r => (
                  <tr key={r.id} className="border-b border-border">
                    <td className="py-3 text-sm">{r.day}</td><td className="py-3 text-sm"><span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{r.type}</span></td><td className="py-3 text-sm text-muted">{r.notes}</td>
                    <td className="py-3 text-right"><button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button></td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Documents</h3><button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Upload size={16} /> Uploader</button></div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
                <Upload size={32} className="text-gray-300 mx-auto mb-2" /><p className="text-sm text-muted">Glissez vos fichiers ici</p>
              </div>
              <div className="space-y-2">
                {['Contrat CDI signé.pdf', 'Bulletin mars 2026.pdf', 'Carte identité.jpg'].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3"><FileText size={18} className="text-primary-500" /><span className="text-sm">{doc}</span></div>
                    <div className="flex gap-1"><button className="p-1 hover:bg-gray-100 rounded"><Eye size={14} className="text-muted" /></button><button className="p-1 hover:bg-gray-100 rounded"><Download size={14} className="text-muted" /></button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'salaire' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">Éléments de salaire</h3>
                  <select className="px-3 py-1.5 border border-border rounded-lg text-sm"><option>Mars 2026</option><option>Février 2026</option><option>Janvier 2026</option></select>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm"><Plus size={16} /> Ajouter</button>
              </div>
              <table className="w-full"><thead className="border-b border-border"><tr>
                <th className="text-left py-2 text-xs text-muted uppercase">Type</th><th className="text-right py-2 text-xs text-muted uppercase">Montant</th><th className="text-left py-2 text-xs text-muted uppercase">Description</th><th className="text-left py-2 text-xs text-muted uppercase">Statut</th>
              </tr></thead><tbody>
                {mockSalaryElements.map(el => (
                  <tr key={el.id} className="border-b border-border">
                    <td className="py-3"><span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded">{el.type}</span></td>
                    <td className={`py-3 text-sm text-right font-medium ${el.amount < 0 ? 'text-danger' : ''}`}>{el.amount > 0 ? '+' : ''}{el.amount.toFixed(2)} €</td>
                    <td className="py-3 text-sm text-muted">{el.description}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${el.status === 'validated' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{el.status === 'validated' ? 'Validé' : 'En attente'}</span></td>
                  </tr>
                ))}
              </tbody></table>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <span className="text-sm font-medium">Total du mois</span>
                <span className="text-lg font-bold text-foreground">
                  {mockSalaryElements.reduce((sum, el) => sum + el.amount, 0).toFixed(2)} €
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
