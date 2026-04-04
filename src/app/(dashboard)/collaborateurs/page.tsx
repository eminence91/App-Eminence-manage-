'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, Users, Star, Phone, Mail,
  Filter, ChevronRight, Shield, ShieldOff, Loader2, X
} from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation, SUPABASE_CONFIGURED } from '@/hooks/useSupabaseQuery';
import { getCollaborators, deleteClient, createCollaborator as createCollabQuery } from '@/lib/supabase/queries';

type CollaborateurType = 'Employe' | 'Interimaire' | 'Prestataire' | 'Apprenti' | 'Stagiaire';
type CollaborateurStatut = 'actif' | 'inactif' | 'archive';

interface Collaborateur {
  id: string;
  photo: string;
  prenom: string;
  nom: string;
  matricule: string;
  type: CollaborateurType;
  email: string;
  telephone: string;
  statut: CollaborateurStatut;
  rating: number;
  licence: boolean;
}

const mockCollaborateurs: Collaborateur[] = [
  {
    id: '1',
    photo: '',
    prenom: 'Mohamed',
    nom: 'Konaté',
    matricule: 'COL-2024-001',
    type: 'Employe',
    email: 'mohamed.konate@eminence.fr',
    telephone: '06 12 34 56 78',
    statut: 'actif',
    rating: 4,
    licence: true,
  },
  {
    id: '2',
    photo: '',
    prenom: 'Fatou',
    nom: 'Diallo',
    matricule: 'COL-2024-002',
    type: 'Employe',
    email: 'fatou.diallo@eminence.fr',
    telephone: '06 23 45 67 89',
    statut: 'actif',
    rating: 5,
    licence: true,
  },
  {
    id: '3',
    photo: '',
    prenom: 'Ibrahim',
    nom: 'Sylla',
    matricule: 'COL-2024-003',
    type: 'Interimaire',
    email: 'ibrahim.sylla@eminence.fr',
    telephone: '06 34 56 78 90',
    statut: 'actif',
    rating: 3,
    licence: false,
  },
  {
    id: '4',
    photo: '',
    prenom: 'Aminata',
    nom: 'Camara',
    matricule: 'COL-2024-004',
    type: 'Prestataire',
    email: 'aminata.camara@eminence.fr',
    telephone: '06 45 67 89 01',
    statut: 'inactif',
    rating: 4,
    licence: false,
  },
  {
    id: '5',
    photo: '',
    prenom: 'Mamadou',
    nom: 'Touré',
    matricule: 'COL-2024-005',
    type: 'Apprenti',
    email: 'mamadou.toure@eminence.fr',
    telephone: '06 56 78 90 12',
    statut: 'actif',
    rating: 3,
    licence: true,
  },
  {
    id: '6',
    photo: '',
    prenom: 'Aissatou',
    nom: 'Barry',
    matricule: 'COL-2024-006',
    type: 'Stagiaire',
    email: 'aissatou.barry@eminence.fr',
    telephone: '06 67 89 01 23',
    statut: 'archive',
    rating: 2,
    licence: false,
  },
];

const typeLabels: Record<CollaborateurType, string> = {
  Employe: 'Employé',
  Interimaire: 'Intérimaire',
  Prestataire: 'Prestataire',
  Apprenti: 'Apprenti',
  Stagiaire: 'Stagiaire',
};

const typeColors: Record<CollaborateurType, string> = {
  Employe: 'bg-primary-100 text-primary-800',
  Interimaire: 'bg-orange-100 text-orange-800',
  Prestataire: 'bg-blue-100 text-blue-800',
  Apprenti: 'bg-purple-100 text-purple-800',
  Stagiaire: 'bg-pink-100 text-pink-800',
};

const statutConfig: Record<CollaborateurStatut, { label: string; color: string }> = {
  actif: { label: 'Actif', color: 'bg-success text-white' },
  inactif: { label: 'Inactif', color: 'bg-gray-400 text-white' },
  archive: { label: 'Archivé', color: 'bg-gray-300 text-gray-600' },
};

type FilterTab = 'tous' | 'actifs' | 'inactifs' | 'archives';

function getInitials(prenom: string, nom: string) {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

const avatarColors = [
  'bg-primary-500',
  'bg-orange-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

/** Map Supabase collaborator rows to local shape */
function mapSupabaseCollaborators(rows: Record<string, unknown>[]): Collaborateur[] {
  return rows.map((r) => {
    const statusMap: Record<string, CollaborateurStatut> = {
      active: 'actif',
      inactive: 'inactif',
      on_leave: 'inactif',
      suspended: 'inactif',
      terminated: 'archive',
    };
    return {
      id: r.id as string,
      photo: (r.avatar_url as string) ?? '',
      prenom: r.first_name as string,
      nom: r.last_name as string,
      matricule: r.matricule as string,
      type: ((r.contract_type as string) ?? 'Employe') as CollaborateurType,
      email: r.email as string,
      telephone: (r.phone as string) ?? '',
      statut: statusMap[(r.status as string) ?? 'active'] ?? 'actif',
      rating: (r.rating as number) ?? 3,
      licence: (r.has_license as boolean) ?? false,
    };
  });
}

export default function CollaborateursPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('tous');
  const [activeTypes, setActiveTypes] = useState<CollaborateurType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [localCollabs, setLocalCollabs] = useState<Collaborateur[] | null>(null);

  // Fetch from Supabase
  const { data: supabaseData, loading, error, refetch } = useSupabaseQuery(
    (supabase) => getCollaborators(supabase),
    []
  );

  const createMutation = useSupabaseMutation(
    (supabase, data: Record<string, unknown>) => createCollabQuery(supabase, data)
  );

  // Determine data source
  const collaborateurs = useMemo(() => {
    if (localCollabs) return localCollabs;
    if (supabaseData && supabaseData.length > 0) {
      return mapSupabaseCollaborators(supabaseData as unknown as Record<string, unknown>[]);
    }
    return mockCollaborateurs;
  }, [supabaseData, localCollabs]);

  const toggleType = (type: CollaborateurType) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = collaborateurs.filter((c) => {
    const q = search.toLowerCase();
    if (q && !`${c.prenom} ${c.nom} ${c.matricule} ${c.email}`.toLowerCase().includes(q)) {
      return false;
    }
    if (activeTab === 'actifs' && c.statut !== 'actif') return false;
    if (activeTab === 'inactifs' && c.statut !== 'inactif') return false;
    if (activeTab === 'archives' && c.statut !== 'archive') return false;
    if (activeTypes.length > 0 && !activeTypes.includes(c.type)) return false;
    return true;
  });

  const handleDelete = useCallback(async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Supprimer ce collaborateur ?')) return;

    if (SUPABASE_CONFIGURED) {
      // Reuse deleteClient on the collaborators table — but we actually want a dedicated delete.
      // For now, just refetch after a direct call:
      const supabase = (await import('@/lib/supabase/client')).createClient();
      await supabase.from('collaborators').delete().eq('id', id);
      refetch();
    } else {
      setLocalCollabs((prev) => (prev ?? mockCollaborateurs).filter((c) => c.id !== id));
    }
  }, [refetch]);

  const handleCreate = useCallback(async (formData: { prenom: string; nom: string; email: string; telephone: string }) => {
    if (SUPABASE_CONFIGURED) {
      await createMutation.execute({
        first_name: formData.prenom,
        last_name: formData.nom,
        email: formData.email,
        phone: formData.telephone,
        status: 'active',
        matricule: `COL-${Date.now()}`,
      });
      refetch();
    } else {
      const newCollab: Collaborateur = {
        id: `${Date.now()}`,
        photo: '',
        prenom: formData.prenom,
        nom: formData.nom,
        matricule: `COL-${Date.now()}`,
        type: 'Employe',
        email: formData.email,
        telephone: formData.telephone,
        statut: 'actif',
        rating: 3,
        licence: false,
      };
      setLocalCollabs((prev) => [...(prev ?? mockCollaborateurs), newCollab]);
    }
    setShowCreateModal(false);
  }, [createMutation, refetch]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'tous', label: 'Tous' },
    { key: 'actifs', label: 'Actifs' },
    { key: 'inactifs', label: 'Inactifs' },
    { key: 'archives', label: 'Archivés' },
  ];

  const allTypes: CollaborateurType[] = ['Employe', 'Interimaire', 'Prestataire', 'Apprenti', 'Stagiaire'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Users size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Collaborateurs</h1>
            <p className="text-sm text-muted">{loading ? '...' : collaborateurs.length} collaborateurs enregistrés</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Nouveau collaborateur
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-primary-500" />
          <span className="ml-2 text-muted text-sm">Chargement des collaborateurs...</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error} — Affichage des données de démonstration.
        </div>
      )}

      {!loading && (
        <>
          {/* Search */}
          <div className="bg-surface rounded-card shadow-card p-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Rechercher un collaborateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mt-4 border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Type filter badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Filter size={14} className="text-muted" />
              {allTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeTypes.includes(type)
                      ? typeColors[type]
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {typeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden lg:block bg-surface rounded-card shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Collaborateur
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Matricule
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Téléphone
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Statut
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Note
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    Licence
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, index) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/collaborateurs/${c.id}`)}
                    className="border-b border-border last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-semibold`}
                        >
                          {getInitials(c.prenom, c.nom)}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {c.prenom} {c.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted font-mono">{c.matricule}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[c.type]}`}>
                        {typeLabels[c.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted">
                        <Mail size={13} />
                        {c.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted">
                        <Phone size={13} />
                        {c.telephone}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statutConfig[c.statut].color}`}>
                        {statutConfig[c.statut].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RatingStars rating={c.rating} />
                    </td>
                    <td className="px-4 py-3">
                      {c.licence ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield size={12} />
                          Avec licence
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <ShieldOff size={12} />
                          Sans licence
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDelete(e, c.id)}
                          className="p-1 rounded hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <X size={14} />
                        </button>
                        <ChevronRight size={16} className="text-muted" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucun collaborateur trouvé</p>
              </div>
            )}
          </div>

          {/* Cards - Mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map((c, index) => (
              <div
                key={c.id}
                onClick={() => router.push(`/collaborateurs/${c.id}`)}
                className="bg-surface rounded-card shadow-card p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold flex-shrink-0`}
                  >
                    {getInitials(c.prenom, c.nom)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        {c.prenom} {c.nom}
                      </h3>
                      <ChevronRight size={16} className="text-muted flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted font-mono mt-0.5">{c.matricule}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[c.type]}`}>
                        {typeLabels[c.type]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutConfig[c.statut].color}`}>
                        {statutConfig[c.statut].label}
                      </span>
                      {c.licence ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield size={10} />
                          Licence
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <ShieldOff size={10} />
                          Sans
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <RatingStars rating={c.rating} />
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Phone size={11} />
                        {c.telephone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="bg-surface rounded-card shadow-card p-8 text-center text-muted">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucun collaborateur trouvé</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Collaborator Modal */}
      {showCreateModal && (
        <CreateCollaborateurModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          loading={createMutation.loading}
        />
      )}
    </div>
  );
}

// ---- Create Collaborateur Modal ----

function CreateCollaborateurModal({
  onClose,
  onCreate,
  loading,
}: {
  onClose: () => void;
  onCreate: (data: { prenom: string; nom: string; email: string; telephone: string }) => void;
  loading: boolean;
}) {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim() || !nom.trim()) return;
    onCreate({ prenom, nom, email, telephone });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-card shadow-card w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Nouveau collaborateur</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prénom *</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nom *</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Téléphone</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !prenom.trim() || !nom.trim()}
              className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
