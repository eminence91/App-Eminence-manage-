'use client';

import { useState } from 'react';
import {
  FolderOpen, File, FileText, FileSpreadsheet, FileImage,
  Upload, Search, Grid, List, Share2, AlertTriangle,
  ChevronRight, Building2, Users, MapPin, Briefcase, Plus, X
} from 'lucide-react';

type FolderKey = 'agence' | 'clients' | 'collaborateurs' | 'sites';
type ViewMode = 'grid' | 'list';

interface Document {
  id: string;
  nom: string;
  type: 'pdf' | 'excel' | 'image' | 'word';
  taille: string;
  date: string;
  dossier: FolderKey;
  entite: string;
  partage: boolean;
  expiration?: string;
}

const folderConfig: Record<FolderKey, { label: string; icon: React.ReactNode; color: string }> = {
  agence: { label: 'Agence', icon: <Building2 className="w-4 h-4" />, color: 'text-primary-600' },
  clients: { label: 'Clients', icon: <Briefcase className="w-4 h-4" />, color: 'text-blue-600' },
  collaborateurs: { label: 'Collaborateurs', icon: <Users className="w-4 h-4" />, color: 'text-purple-600' },
  sites: { label: 'Sites', icon: <MapPin className="w-4 h-4" />, color: 'text-amber-600' },
};

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-8 h-8 text-red-500" />,
  excel: <FileSpreadsheet className="w-8 h-8 text-green-600" />,
  image: <FileImage className="w-8 h-8 text-blue-500" />,
  word: <File className="w-8 h-8 text-blue-700" />,
};

const mockDocuments: Document[] = [
  { id: 'd-1', nom: 'Kbis Éminence Propreté.pdf', type: 'pdf', taille: '1.2 Mo', date: '2026-01-15', dossier: 'agence', entite: 'Agence', partage: false, expiration: '2027-01-15' },
  { id: 'd-2', nom: 'Assurance RC Pro 2026.pdf', type: 'pdf', taille: '3.8 Mo', date: '2026-02-01', dossier: 'agence', entite: 'Agence', partage: true, expiration: '2026-12-31' },
  { id: 'd-3', nom: 'Contrat Haussmann.pdf', type: 'pdf', taille: '2.1 Mo', date: '2026-03-10', dossier: 'clients', entite: 'Groupe Immobilier Haussmann', partage: true },
  { id: 'd-4', nom: 'Grille tarifaire Dupont.xlsx', type: 'excel', taille: '456 Ko', date: '2026-03-15', dossier: 'clients', entite: 'Boulangerie Dupont & Fils', partage: false },
  { id: 'd-5', nom: 'Pièce identité M. Dubois.pdf', type: 'pdf', taille: '890 Ko', date: '2025-09-01', dossier: 'collaborateurs', entite: 'Marie Dubois', partage: false, expiration: '2030-05-20' },
  { id: 'd-6', nom: 'Attestation formation hygiène.pdf', type: 'pdf', taille: '1.5 Mo', date: '2026-02-28', dossier: 'collaborateurs', entite: 'Jean-Pierre Martin', partage: false, expiration: '2026-08-28' },
  { id: 'd-7', nom: 'Plan site Tour Haussmann.png', type: 'image', taille: '4.2 Mo', date: '2026-01-20', dossier: 'sites', entite: 'Tour Haussmann - Hall A', partage: true },
  { id: 'd-8', nom: 'Cahier des charges Résidences.docx', type: 'word', taille: '780 Ko', date: '2026-03-22', dossier: 'sites', entite: 'Résidence du Parc', partage: true },
];

export default function DocumentsPage() {
  const [activeFolder, setActiveFolder] = useState<FolderKey | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const filtered = mockDocuments.filter(doc => {
    if (activeFolder && doc.dossier !== activeFolder) return false;
    if (search && !doc.nom.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const expiringDocs = mockDocuments.filter(doc => {
    if (!doc.expiration) return false;
    const exp = new Date(doc.expiration);
    const now = new Date();
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff < 180;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Importer
        </button>
      </div>

      {/* Expiration Alerts */}
      {expiringDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Documents bientôt expirés</h3>
          </div>
          <div className="space-y-1">
            {expiringDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between text-sm">
                <span className="text-amber-900">{doc.nom}</span>
                <span className="text-amber-700 font-medium">Expire le {new Date(doc.expiration!).toLocaleDateString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar - Folder Tree */}
        <div className="w-56 shrink-0">
          <div className="bg-surface rounded-card shadow-card p-3">
            <h3 className="text-xs font-semibold text-muted uppercase px-2 mb-2">Dossiers</h3>
            <button
              onClick={() => setActiveFolder(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeFolder === null ? 'bg-primary-50 text-primary-700 font-medium' : 'text-muted hover:bg-gray-50'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Tous les dossiers
            </button>
            {(Object.keys(folderConfig) as FolderKey[]).map(key => {
              const folder = folderConfig[key];
              const count = mockDocuments.filter(d => d.dossier === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFolder(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFolder === key ? 'bg-primary-50 text-primary-700 font-medium' : 'text-muted hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={folder.color}>{folder.icon}</span>
                    {folder.label}
                  </span>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Search & View Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-foreground' : 'text-muted'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-foreground' : 'text-muted'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(doc => (
                <div key={doc.id} className="bg-surface rounded-card shadow-card p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    {typeIcons[doc.type]}
                    {doc.partage && <Share2 className="w-4 h-4 text-primary-500" />}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{doc.nom}</p>
                  <p className="text-xs text-muted mt-1">{doc.taille} — {new Date(doc.date).toLocaleDateString('fr-FR')}</p>
                  <p className="text-xs text-muted mt-0.5 truncate">{doc.entite}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-card shadow-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Nom</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Entité</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Taille</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Partagé</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(doc => (
                    <tr key={doc.id} className="border-b border-border hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="shrink-0">{typeIcons[doc.type]}</span>
                          <span className="text-sm font-medium text-foreground truncate">{doc.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">{doc.entite}</td>
                      <td className="px-4 py-3 text-sm text-muted">{doc.taille}</td>
                      <td className="px-4 py-3 text-sm text-muted">{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3 text-center">
                        {doc.partage && <Share2 className="w-4 h-4 text-primary-500 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface rounded-card shadow-modal p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Importer un document</h3>
              <button onClick={() => setShowUpload(false)} className="p-1 text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Glissez vos fichiers ici</p>
              <p className="text-xs text-muted mt-1">ou cliquez pour sélectionner</p>
              <p className="text-xs text-muted mt-2">PDF, Word, Excel, Images — Max 10 Mo</p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-1">Dossier de destination</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none">
                {(Object.keys(folderConfig) as FolderKey[]).map(key => (
                  <option key={key} value={key}>{folderConfig[key].label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm rounded-lg border border-border text-muted hover:bg-gray-50">
                Annuler
              </button>
              <button className="px-4 py-2 text-sm rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
