'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, Building2, User, UserPlus, Handshake,
  Mail, Phone, MapPin, MoreHorizontal, Filter, Users, Loader2, X
} from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation, SUPABASE_CONFIGURED } from '@/hooks/useSupabaseQuery';
import { getClients, deleteClient as deleteClientQuery, createClient as createClientQuery } from '@/lib/supabase/queries';

type ClientType = 'entreprise' | 'particulier' | 'prospect' | 'sous-traitance';
type ClientStatus = 'actif' | 'inactif';

interface Client {
  id: string;
  nom: string;
  type: ClientType;
  identifiant: string;
  email: string;
  telephone: string;
  nbSites: number;
  statut: ClientStatus;
  logo?: string;
  ville: string;
}

const mockClients: Client[] = [
  {
    id: 'cl-001',
    nom: 'Groupe Immobilier Haussmann',
    type: 'entreprise',
    identifiant: 'CLI-2024-001',
    email: 'contact@haussmann-immo.fr',
    telephone: '01 42 65 78 90',
    nbSites: 12,
    statut: 'actif',
    ville: 'Paris',
  },
  {
    id: 'cl-002',
    nom: 'Boulangerie Dupont & Fils',
    type: 'entreprise',
    identifiant: 'CLI-2024-002',
    email: 'gestion@dupont-boulangerie.fr',
    telephone: '01 45 32 11 07',
    nbSites: 3,
    statut: 'actif',
    ville: 'Lyon',
  },
  {
    id: 'cl-003',
    nom: 'Mme. Catherine Lefèvre',
    type: 'particulier',
    identifiant: 'CLI-2024-003',
    email: 'c.lefevre@orange.fr',
    telephone: '06 12 34 56 78',
    nbSites: 1,
    statut: 'actif',
    ville: 'Marseille',
  },
  {
    id: 'cl-004',
    nom: 'Résidences du Parc SAS',
    type: 'prospect',
    identifiant: 'CLI-2024-004',
    email: 'direction@residences-parc.fr',
    telephone: '04 91 22 33 44',
    nbSites: 0,
    statut: 'actif',
    ville: 'Bordeaux',
  },
  {
    id: 'cl-005',
    nom: 'NetPro Services',
    type: 'sous-traitance',
    identifiant: 'CLI-2024-005',
    email: 'partenariat@netpro.fr',
    telephone: '03 88 55 66 77',
    nbSites: 5,
    statut: 'actif',
    ville: 'Strasbourg',
  },
  {
    id: 'cl-006',
    nom: 'Cabinet Médical Saint-Lazare',
    type: 'entreprise',
    identifiant: 'CLI-2024-006',
    email: 'accueil@cabinet-stlazare.fr',
    telephone: '01 48 77 88 99',
    nbSites: 2,
    statut: 'inactif',
    ville: 'Paris',
  },
];

const typeLabels: Record<ClientType, string> = {
  entreprise: 'Entreprise',
  particulier: 'Particulier',
  prospect: 'Prospect',
  'sous-traitance': 'Sous-traitance',
};

const typeColors: Record<ClientType, string> = {
  entreprise: 'bg-primary-100 text-primary-800',
  particulier: 'bg-blue-100 text-blue-800',
  prospect: 'bg-orange-100 text-orange-800',
  'sous-traitance': 'bg-purple-100 text-purple-800',
};

const typeIcons: Record<ClientType, React.ReactNode> = {
  entreprise: <Building2 size={14} />,
  particulier: <User size={14} />,
  prospect: <UserPlus size={14} />,
  'sous-traitance': <Handshake size={14} />,
};

type FilterTab = 'tous' | ClientType;

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'entreprise', label: 'Entreprises' },
  { key: 'particulier', label: 'Particuliers' },
  { key: 'prospect', label: 'Prospects' },
  { key: 'sous-traitance', label: 'Sous-traitance' },
];

/** Map Supabase client rows to the local Client shape used by the UI */
function mapSupabaseClients(rows: Record<string, unknown>[]): Client[] {
  return rows.map((r) => ({
    id: r.id as string,
    nom: r.name as string,
    type: 'entreprise' as ClientType,
    identifiant: (r.id as string).slice(0, 12),
    email: (r.email as string) ?? '',
    telephone: (r.phone as string) ?? '',
    nbSites: 0,
    statut: (r.is_active ? 'actif' : 'inactif') as ClientStatus,
    ville: (r.city as string) ?? '',
  }));
}

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('tous');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [localClients, setLocalClients] = useState<Client[] | null>(null);

  // Fetch clients from Supabase
  const { data: supabaseData, loading, error, refetch } = useSupabaseQuery(
    (supabase) => getClients(supabase),
    []
  );

  // Mutation helpers
  const deleteMutation = useSupabaseMutation(
    (supabase, id: string) => deleteClientQuery(supabase, id)
  );

  const createMutation = useSupabaseMutation(
    (supabase, data: Record<string, unknown>) => createClientQuery(supabase, data)
  );

  // Determine which client list to display: Supabase data or mock fallback
  const clients = useMemo(() => {
    if (localClients) return localClients;
    if (supabaseData && supabaseData.length > 0) {
      return mapSupabaseClients(supabaseData as unknown as Record<string, unknown>[]);
    }
    return mockClients;
  }, [supabaseData, localClients]);

  const filteredClients = useMemo(() => {
    let result = clients;
    if (activeTab !== 'tous') {
      result = result.filter((c) => c.type === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nom.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.identifiant.toLowerCase().includes(q) ||
          c.ville.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeTab, clients]);

  const handleDelete = useCallback(async (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    if (!confirm('Supprimer ce client ?')) return;

    if (SUPABASE_CONFIGURED) {
      await deleteMutation.execute(clientId);
      refetch();
    } else {
      setLocalClients((prev) => (prev ?? mockClients).filter((c) => c.id !== clientId));
    }
  }, [deleteMutation, refetch]);

  const handleCreate = useCallback(async (formData: { nom: string; email: string; telephone: string; ville: string }) => {
    if (SUPABASE_CONFIGURED) {
      await createMutation.execute({
        name: formData.nom,
        email: formData.email,
        phone: formData.telephone,
        city: formData.ville,
        is_active: true,
        country: 'FR',
      });
      refetch();
    } else {
      const newClient: Client = {
        id: `cl-${Date.now()}`,
        nom: formData.nom,
        type: 'entreprise',
        identifiant: `CLI-${Date.now()}`,
        email: formData.email,
        telephone: formData.telephone,
        nbSites: 0,
        statut: 'actif',
        ville: formData.ville,
      };
      setLocalClients((prev) => [...(prev ?? mockClients), newClient]);
    }
    setShowCreateModal(false);
  }, [createMutation, refetch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            {loading ? '...' : clients.length}
          </span>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Nouveau client
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-primary-500" />
          <span className="ml-2 text-muted text-sm">Chargement des clients...</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error} — Affichage des données de démonstration.
        </div>
      )}

      {/* Search & Filters */}
      {!loading && (
        <>
          <div className="bg-surface rounded-card shadow-card p-4 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-colors"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-1">
              {filterTabs.map((tab) => {
                const count =
                  tab.key === 'tous'
                    ? clients.length
                    : clients.filter((c) => c.type === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-muted hover:bg-gray-100 hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.key
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-muted'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Table */}
          {filteredClients.length > 0 ? (
            <div className="bg-surface rounded-card shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-gray-50/50">
                      <th className="text-left px-4 py-3 font-semibold text-muted">Nom</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted hidden md:table-cell">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted hidden lg:table-cell">Identifiant</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted hidden md:table-cell">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted hidden lg:table-cell">Telephone</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted hidden sm:table-cell">Nb Sites</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted">Statut</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() => router.push(`/clients/${client.id}`)}
                        className="border-b border-border last:border-0 hover:bg-primary-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                              {client.nom.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{client.nom}</p>
                              <p className="text-xs text-muted md:hidden flex items-center gap-1">
                                {typeIcons[client.type]}
                                {typeLabels[client.type]}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColors[client.type]}`}>
                            {typeIcons[client.type]}
                            {typeLabels[client.type]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted hidden lg:table-cell font-mono text-xs">
                          {client.identifiant}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-muted">
                            <Mail size={13} />
                            <span className="truncate max-w-[180px]">{client.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-muted">
                            <Phone size={13} />
                            {client.telephone}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          <div className="flex items-center justify-center gap-1 text-muted">
                            <MapPin size={13} />
                            {client.nbSites}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              client.statut === 'actif'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${client.statut === 'actif' ? 'bg-green-500' : 'bg-red-500'}`} />
                            {client.statut === 'actif' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => handleDelete(e, client.id)}
                            className="p-1 rounded hover:bg-red-50 text-muted hover:text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="bg-surface rounded-card shadow-card p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                <Users size={36} className="text-primary-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Aucun client trouve</h3>
              <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
                {search
                  ? `Aucun resultat pour "${search}". Essayez avec d'autres termes.`
                  : "Commencez par ajouter votre premier client pour gerer vos prestations."}
              </p>
              {!search && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus size={18} />
                  Ajouter un client
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <CreateClientModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          loading={createMutation.loading}
        />
      )}
    </div>
  );
}

// ---- Create Client Modal ----

function CreateClientModal({
  onClose,
  onCreate,
  loading,
}: {
  onClose: () => void;
  onCreate: (data: { nom: string; email: string; telephone: string; ville: string }) => void;
  loading: boolean;
}) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [ville, setVille] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    onCreate({ nom, email, telephone, ville });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-card shadow-card w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Nouveau client</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nom *</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
              placeholder="Nom du client"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
              placeholder="email@exemple.fr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Telephone</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
              placeholder="01 23 45 67 89"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ville</label>
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
              placeholder="Paris"
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
              disabled={loading || !nom.trim()}
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
