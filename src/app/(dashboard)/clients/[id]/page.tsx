'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Save, Info, MapPin, Briefcase, Users,
  FileText, Plus, Trash2, Eye, Download, Mail, Phone,
  Star, Upload, CreditCard, Calendar
} from 'lucide-react';

const tabs = [
  { id: 'info', label: 'Informations' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'prestations', label: 'Prestations & Tarifs' },
  { id: 'contrats', label: 'Contrats' },
  { id: 'documents', label: 'Documents' },
];

const mockClient = {
  id: '1',
  type: 'company',
  name: 'Groupe Hospitalier Paris',
  siret: '12345678901234',
  vatNumber: 'FR12345678901',
  email: 'contact@ghp.fr',
  phone: '01 42 00 00 00',
  identifier: 'CLI-2024-001',
  address: '47 Boulevard de l\'Hôpital',
  postalCode: '75013',
  city: 'Paris',
  country: 'France',
  orderNumber: 'BC-2026-0042',
  discountType: 'percent' as 'percent' | 'amount',
  discountValue: 5,
  comments: 'Client historique, contrat cadre en place depuis 2020.',
};

const mockContacts = [
  { id: '1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@ghp.fr', phone: '01 42 00 00 01', role: 'Responsable services généraux', receivesMce: true, receivesInvoices: true, receivesInterventions: true, isPrimary: true },
  { id: '2', firstName: 'Pierre', lastName: 'Martin', email: 'pierre.martin@ghp.fr', phone: '01 42 00 00 02', role: 'Directeur technique', receivesMce: false, receivesInvoices: true, receivesInterventions: false, isPrimary: false },
];

const mockPrestations = [
  { id: '1', name: 'Nettoyage bureaux standard', hourlyRate: 22.50, tourRate: 18.00 },
  { id: '2', name: 'Remise en état après travaux', hourlyRate: 28.00, tourRate: 0 },
  { id: '3', name: 'Entretien parties communes', hourlyRate: 20.00, tourRate: 16.50 },
];

const mockContracts = [
  { id: '1', name: 'Contrat cadre 2026', status: 'signed', signedAt: '15/01/2026', expiresAt: '31/12/2026' },
  { id: '2', name: 'Avenant n°3 - Extension sites', status: 'sent', signedAt: null, expiresAt: '31/12/2026' },
];

const mockDocuments = [
  { id: '1', name: 'Contrat signé 2026.pdf', size: '2.4 MB', date: '15/01/2026' },
  { id: '2', name: 'RIB client.pdf', size: '156 KB', date: '10/01/2026' },
  { id: '3', name: 'Attestation assurance.pdf', size: '890 KB', date: '05/01/2026' },
];

const typeLabels: Record<string, string> = {
  company: 'Entreprise', individual: 'Particulier', association: 'Association',
  public_org: 'Organisme public', prospect: 'Prospect', subcontractor: 'Sous-traitance',
};

export default function ClientDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('info');
  const [client, setClient] = useState(mockClient);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">{typeLabels[client.type]}</span>
          </div>
          <p className="text-sm text-muted">{client.identifier}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-500 text-primary-500' : 'border-transparent text-muted hover:text-foreground'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-surface rounded-card shadow-card p-6">
        {activeTab === 'info' && (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary-200" />
            <div className="space-y-8">
              {/* Section Informations générales */}
              <div className="relative pl-12">
                <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10">
                  <Info size={16} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Type *</label>
                    <select value={client.type} onChange={e => setClient({ ...client, type: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                      {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Nom *</label>
                    <input value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">SIRET</label>
                    <input value={client.siret} onChange={e => setClient({ ...client, siret: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">N° TVA</label>
                    <input value={client.vatNumber} onChange={e => setClient({ ...client, vatNumber: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email</label>
                    <input type="email" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Téléphone</label>
                    <input value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Identifiant</label>
                    <input value={client.identifier} readOnly className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-gray-50" />
                  </div>
                </div>
              </div>

              {/* Section Adresse */}
              <div className="relative pl-12">
                <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10">
                  <MapPin size={16} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Pays</label>
                    <input value={client.country} onChange={e => setClient({ ...client, country: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Code postal *</label>
                    <input value={client.postalCode} onChange={e => setClient({ ...client, postalCode: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Ville *</label>
                    <input value={client.city} onChange={e => setClient({ ...client, city: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Adresse *</label>
                    <input value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Section Commercial */}
              <div className="relative pl-12">
                <div className="absolute left-1 w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white z-10">
                  <Briefcase size={16} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Commercial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">N° bon de commande</label>
                    <input value={client.orderNumber} onChange={e => setClient({ ...client, orderNumber: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-muted mb-1">Remise</label>
                      <input type="number" value={client.discountValue} onChange={e => setClient({ ...client, discountValue: Number(e.target.value) })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                    </div>
                    <div className="w-20">
                      <label className="block text-sm font-medium text-muted mb-1">Type</label>
                      <select value={client.discountType} onChange={e => setClient({ ...client, discountType: e.target.value as 'percent' | 'amount' })} className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                        <option value="percent">%</option>
                        <option value="amount">€</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted mb-1">Commentaires internes</label>
                    <textarea value={client.comments} onChange={e => setClient({ ...client, comments: e.target.value })} rows={3} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600">
                <Save size={18} /> ENREGISTRER
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Contacts</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm">
                <Plus size={16} /> Ajouter un contact
              </button>
            </div>
            <div className="space-y-3">
              {mockContacts.map(contact => (
                <div key={contact.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{contact.firstName} {contact.lastName}</p>
                        {contact.isPrimary && <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">Principal</span>}
                      </div>
                      <p className="text-sm text-muted">{contact.role}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                        <span className="flex items-center gap-1"><Mail size={14} /> {contact.email}</span>
                        <span className="flex items-center gap-1"><Phone size={14} /> {contact.phone}</span>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={16} className="text-danger" /></button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" defaultChecked={contact.receivesMce} className="rounded text-primary-500" />
                      Mains courantes
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" defaultChecked={contact.receivesInvoices} className="rounded text-primary-500" />
                      Factures
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" defaultChecked={contact.receivesInterventions} className="rounded text-primary-500" />
                      Bons d&apos;intervention
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prestations' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Prestations & Tarifs</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 text-xs text-muted uppercase">Prestation</th>
                  <th className="text-right py-2 text-xs text-muted uppercase">Tarif horaire jour</th>
                  <th className="text-right py-2 text-xs text-muted uppercase">Tarif tournée</th>
                  <th className="text-right py-2 text-xs text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPrestations.map(p => (
                  <tr key={p.id} className="border-b border-border">
                    <td className="py-3 text-sm">{p.name}</td>
                    <td className="py-3 text-sm text-right font-medium">{p.hourlyRate.toFixed(2)} €/h</td>
                    <td className="py-3 text-sm text-right">{p.tourRate > 0 ? `${p.tourRate.toFixed(2)} €` : '—'}</td>
                    <td className="py-3 text-right"><button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={14} className="text-danger" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'contrats' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Contrats</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm">
                <Plus size={16} /> Générer depuis modèle
              </button>
            </div>
            <div className="space-y-3">
              {mockContracts.map(c => (
                <div key={c.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                      <span className="flex items-center gap-1"><Calendar size={12} /> Expire le {c.expiresAt}</span>
                      {c.signedAt && <span>Signé le {c.signedAt}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'signed' ? 'bg-green-100 text-green-700' : c.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {c.status === 'signed' ? 'Signé' : c.status === 'sent' ? 'Envoyé' : 'Brouillon'}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded"><Eye size={16} className="text-muted" /></button>
                    <button className="p-1 hover:bg-gray-100 rounded"><Download size={16} className="text-muted" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Documents</h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm">
                <Upload size={16} /> Uploader
              </button>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4">
              <Upload size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-muted">Glissez vos fichiers ici ou cliquez pour uploader</p>
            </div>
            <div className="space-y-2">
              {mockDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted">{doc.size} · {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded"><Eye size={16} className="text-muted" /></button>
                    <button className="p-1 hover:bg-gray-100 rounded"><Download size={16} className="text-muted" /></button>
                    <button className="p-1 hover:bg-gray-100 rounded"><Trash2 size={16} className="text-danger" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
