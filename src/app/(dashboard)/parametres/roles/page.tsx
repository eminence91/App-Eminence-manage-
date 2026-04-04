'use client';

import { useState } from 'react';
import {
  Shield, Plus, ChevronRight, Check, X, ArrowLeft
} from 'lucide-react';

interface PermissionModule {
  nom: string;
  permissions: string[];
}

interface Profile {
  id: string;
  nom: string;
  roleType: string;
  permissions: Record<string, boolean>;
}

const modules: PermissionModule[] = [
  { nom: 'Clients', permissions: ['Voir', 'Créer', 'Modifier', 'Supprimer', 'Exporter'] },
  { nom: 'Sites', permissions: ['Voir', 'Créer', 'Modifier', 'Supprimer', 'Affecter agents'] },
  { nom: 'Collaborateurs', permissions: ['Voir', 'Créer', 'Modifier', 'Supprimer', 'Voir documents'] },
  { nom: 'Planning', permissions: ['Voir', 'Créer', 'Modifier', 'Supprimer', 'Valider'] },
  { nom: 'Terrain', permissions: ['Voir supervision', 'Voir alertes', 'Créer événements', 'Bons intervention'] },
  { nom: 'Facturation', permissions: ['Voir', 'Créer devis', 'Créer factures', 'Clôture mensuelle', 'PennyLane'] },
  { nom: 'Stocks', permissions: ['Voir', 'Créer', 'Attribuer', 'Retour'] },
  { nom: 'Documents', permissions: ['Voir', 'Importer', 'Supprimer', 'Partager'] },
  { nom: 'Paramètres', permissions: ['Voir', 'Modifier', 'Gérer rôles'] },
];

const generatePerms = (allTrue: boolean, exceptions: string[] = []): Record<string, boolean> => {
  const perms: Record<string, boolean> = {};
  modules.forEach(mod => {
    mod.permissions.forEach(perm => {
      const key = `${mod.nom}:${perm}`;
      perms[key] = exceptions.includes(key) ? !allTrue : allTrue;
    });
  });
  return perms;
};

const mockProfiles: Profile[] = [
  {
    id: 'prof-1',
    nom: 'Directeur',
    roleType: 'Administrateur',
    permissions: generatePerms(true),
  },
  {
    id: 'prof-2',
    nom: 'Manager',
    roleType: 'Gestionnaire',
    permissions: generatePerms(true, ['Paramètres:Gérer rôles', 'Facturation:PennyLane', 'Facturation:Clôture mensuelle']),
  },
  {
    id: 'prof-3',
    nom: 'Responsable terrain',
    roleType: 'Opérationnel',
    permissions: generatePerms(false, [
      'Clients:Voir', 'Sites:Voir', 'Collaborateurs:Voir',
      'Planning:Voir', 'Planning:Créer', 'Planning:Modifier',
      'Terrain:Voir supervision', 'Terrain:Voir alertes', 'Terrain:Créer événements', 'Terrain:Bons intervention',
      'Stocks:Voir', 'Stocks:Attribuer', 'Stocks:Retour',
      'Documents:Voir',
    ]),
  },
];

export default function RolesPage() {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const activeProfile = profiles.find(p => p.id === selectedProfile);

  const togglePermission = (profileId: string, key: string) => {
    setProfiles(prev =>
      prev.map(p =>
        p.id === profileId
          ? { ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } }
          : p
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedProfile && (
            <button
              onClick={() => setSelectedProfile(null)}
              className="p-2 text-muted hover:text-foreground rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-foreground">
            {selectedProfile ? `Profil : ${activeProfile?.nom}` : 'Rôles et permissions'}
          </h1>
        </div>
        {!selectedProfile && (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau profil
          </button>
        )}
      </div>

      {!selectedProfile ? (
        /* Profile List */
        <div className="space-y-3">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile.id)}
              className="w-full bg-surface rounded-card shadow-card p-4 flex items-center justify-between hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{profile.nom}</h3>
                  <p className="text-sm text-muted">{profile.roleType}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted" />
            </button>
          ))}
        </div>
      ) : activeProfile ? (
        /* Permission Editor */
        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-gray-50">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted">Type de rôle : <span className="font-medium text-foreground">{activeProfile.roleType}</span></p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase w-48">Module</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase" colSpan={5}>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => (
                  <tr key={mod.nom} className="border-b border-border hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-foreground">{mod.nom}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3">
                        {mod.permissions.map(perm => {
                          const key = `${mod.nom}:${perm}`;
                          const checked = activeProfile.permissions[key] || false;
                          return (
                            <label key={key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => togglePermission(activeProfile.id, key)}
                                className="w-4 h-4 text-primary-500 border-border rounded focus:ring-primary-500"
                              />
                              <span className="text-sm text-foreground">{perm}</span>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              <Check className="w-4 h-4" />
              Enregistrer les permissions
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
