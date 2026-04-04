'use client';

import { useState } from 'react';
import {
  Building2, Users, Package, DollarSign, FolderOpen, MapPin,
  Mail, Shield, Save, Clock, Palette, Plus, Trash2, Moon, Sun,
  ToggleLeft, ToggleRight, Sliders, Eye
} from 'lucide-react';

type SettingsTab = 'agence' | 'rh' | 'stocks' | 'tarification' | 'dossiers' | 'terrain' | 'email' | 'roles';

interface UnavailabilityType {
  id: string;
  nom: string;
  couleur: string;
  actif: boolean;
}

interface MCEEventType {
  id: string;
  nom: string;
  actif: boolean;
  visibleClient: boolean;
}

const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'agence', label: 'Agence', icon: <Building2 className="w-4 h-4" /> },
  { key: 'rh', label: 'RH', icon: <Users className="w-4 h-4" /> },
  { key: 'stocks', label: 'Stocks', icon: <Package className="w-4 h-4" /> },
  { key: 'tarification', label: 'Tarification', icon: <DollarSign className="w-4 h-4" /> },
  { key: 'dossiers', label: 'Dossiers', icon: <FolderOpen className="w-4 h-4" /> },
  { key: 'terrain', label: 'Terrain', icon: <MapPin className="w-4 h-4" /> },
  { key: 'email', label: 'Email & Export', icon: <Mail className="w-4 h-4" /> },
  { key: 'roles', label: 'Rôles & Droits', icon: <Shield className="w-4 h-4" /> },
];

const mockUnavailTypes: UnavailabilityType[] = [
  { id: 'u-1', nom: 'Congés payés', couleur: '#3b82f6', actif: true },
  { id: 'u-2', nom: 'Maladie', couleur: '#ef4444', actif: true },
  { id: 'u-3', nom: 'Sans solde', couleur: '#6b7280', actif: true },
  { id: 'u-4', nom: 'Événement familial', couleur: '#8b5cf6', actif: true },
  { id: 'u-5', nom: 'Formation', couleur: '#f59e0b', actif: false },
];

const mockMCETypes: MCEEventType[] = [
  { id: 'mce-1', nom: 'Observation', actif: true, visibleClient: true },
  { id: 'mce-2', nom: 'Incident', actif: true, visibleClient: true },
  { id: 'mce-3', nom: 'Remarque client', actif: true, visibleClient: false },
  { id: 'mce-4', nom: 'Dégradation', actif: true, visibleClient: true },
  { id: 'mce-5', nom: 'Trouvaille', actif: false, visibleClient: false },
];

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-6 bg-primary-500 rounded-full" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, placeholder }: { value: string; placeholder?: string }) {
  const [v, setV] = useState(value);
  return (
    <input
      type="text"
      value={v}
      onChange={(e) => setV(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('agence');
  const [saved, setSaved] = useState(false);

  // RH state
  const [lissageHS, setLissageHS] = useState(true);
  const [notationToggle, setNotationToggle] = useState(false);
  const [defaultPlanningView, setDefaultPlanningView] = useState('semaine');

  // Tarification state
  const [deduirePauses, setDeduirePauses] = useState(true);

  // Terrain state
  const [perimeterDetection, setPerimeterDetection] = useState(true);
  const [perimeterRadius, setPerimeterRadius] = useState(150);

  // Email state
  const [autoSendPlanning, setAutoSendPlanning] = useState(true);
  const [amplitudeDays, setAmplitudeDays] = useState(7);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'agence':
        return (
          <div className="space-y-8">
            <SectionTitle title="Informations de l'agence" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nom de l'agence">
                <TextInput value="Éminence Propreté" />
              </FormField>
              <FormField label="SIRET">
                <TextInput value="123 456 789 00012" />
              </FormField>
              <FormField label="Adresse">
                <TextInput value="15 rue de la Propreté, 75001 Paris" />
              </FormField>
              <FormField label="Email">
                <TextInput value="contact@eminence-proprete.fr" />
              </FormField>
              <FormField label="Téléphone">
                <TextInput value="01 42 00 00 00" />
              </FormField>
              <FormField label="Numéro d'urgence">
                <TextInput value="06 00 00 00 00" />
              </FormField>
            </div>

            <SectionTitle title="Paramètres horaires" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Heures de nuit (début)">
                <TextInput value="21:00" />
              </FormField>
              <FormField label="Heures de nuit (fin)">
                <TextInput value="06:00" />
              </FormField>
              <FormField label="Fuseau horaire">
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none">
                  <option>Europe/Paris (UTC+1)</option>
                  <option>Europe/London (UTC+0)</option>
                </select>
              </FormField>
            </div>

            <FormField label="Logo de l'agence">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors">
                <p className="text-sm text-muted">Cliquez ou glissez pour importer un logo</p>
                <p className="text-xs text-muted mt-1">PNG, JPG — Max 2 Mo</p>
              </div>
            </FormField>
          </div>
        );

      case 'rh':
        return (
          <div className="space-y-8">
            <SectionTitle title="Paramètres généraux" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Préfixe collaborateur">
                <TextInput value="COL-" />
              </FormField>
              <FormField label="Préfixe client">
                <TextInput value="CLI-" />
              </FormField>
              <FormField label="Mode de décompte des congés">
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none">
                  <option>Jours ouvrés</option>
                  <option>Jours ouvrables</option>
                  <option>Jours calendaires</option>
                </select>
              </FormField>
              <FormField label="Vue planning par défaut">
                <select
                  value={defaultPlanningView}
                  onChange={(e) => setDefaultPlanningView(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="jour">Jour</option>
                  <option value="semaine">Semaine</option>
                  <option value="mois">Mois</option>
                </select>
              </FormField>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Lissage des heures supplémentaires</p>
                  <p className="text-xs text-muted">Lissage mensuel des HS pour la prépaie</p>
                </div>
                <Toggle checked={lissageHS} onChange={setLissageHS} />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Notation des collaborateurs</p>
                  <p className="text-xs text-muted">Activer le système de notation interne</p>
                </div>
                <Toggle checked={notationToggle} onChange={setNotationToggle} />
              </div>
            </div>

            <SectionTitle title="Taux heures supplémentaires" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Majoration 25% (à partir de)">
                <TextInput value="36" placeholder="heures" />
              </FormField>
              <FormField label="Majoration 50% (à partir de)">
                <TextInput value="44" placeholder="heures" />
              </FormField>
              <FormField label="Majoration nuit">
                <TextInput value="10%" />
              </FormField>
            </div>

            <SectionTitle title="Types d'indisponibilité" />
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted">Nom</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-muted">Couleur</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-muted">Actif</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUnavailTypes.map(type => (
                    <tr key={type.id} className="border-b border-border">
                      <td className="px-4 py-2 text-sm text-foreground">{type.nom}</td>
                      <td className="px-4 py-2 text-center">
                        <input type="color" defaultValue={type.couleur} className="w-8 h-8 rounded cursor-pointer" />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Toggle checked={type.actif} onChange={() => {}} />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2">
                <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                  <Plus className="w-4 h-4" /> Ajouter un type
                </button>
              </div>
            </div>
          </div>
        );

      case 'stocks':
        return (
          <div className="space-y-8">
            <SectionTitle title="Configuration des stocks" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Seuil d'alerte par défaut">
                <TextInput value="5" />
              </FormField>
              <FormField label="Délai retour maximum (jours)">
                <TextInput value="30" />
              </FormField>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Activer les QR codes</p>
                <p className="text-xs text-muted">Générer automatiquement des QR codes pour les matériels</p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </div>
        );

      case 'tarification':
        return (
          <div className="space-y-8">
            <SectionTitle title="Tarification" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Taux horaire par défaut">
                <TextInput value="22.50" />
              </FormField>
              <FormField label="Taux tournée par défaut">
                <TextInput value="35.00" />
              </FormField>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Déduire les pauses</p>
                <p className="text-xs text-muted">Déduire automatiquement les pauses des heures facturées</p>
              </div>
              <Toggle checked={deduirePauses} onChange={setDeduirePauses} />
            </div>
          </div>
        );

      case 'dossiers':
        return (
          <div className="space-y-8">
            <SectionTitle title="Gestion des dossiers" />
            <p className="text-sm text-muted">Configurez les types de documents requis et les alertes d'expiration.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Alerte expiration (jours avant)">
                <TextInput value="30" />
              </FormField>
              <FormField label="Taille maximum fichier (Mo)">
                <TextInput value="10" />
              </FormField>
            </div>
          </div>
        );

      case 'terrain':
        return (
          <div className="space-y-8">
            <SectionTitle title="Types d'événements MCE" />
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted">Nom</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-muted">Actif</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-muted">Visible client</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMCETypes.map(type => (
                    <tr key={type.id} className="border-b border-border">
                      <td className="px-4 py-2 text-sm text-foreground">{type.nom}</td>
                      <td className="px-4 py-2 text-center">
                        <Toggle checked={type.actif} onChange={() => {}} />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Toggle checked={type.visibleClient} onChange={() => {}} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2">
                <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                  <Plus className="w-4 h-4" /> Ajouter un type
                </button>
              </div>
            </div>

            <SectionTitle title="Bons d'intervention" />
            <p className="text-sm text-muted">Configurez les champs du formulaire d'intervention terrain.</p>

            <SectionTitle title="Détection de périmètre" />
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activer la détection de périmètre</p>
                <p className="text-xs text-muted">Alerter si l'agent est hors du périmètre du site</p>
              </div>
              <Toggle checked={perimeterDetection} onChange={setPerimeterDetection} />
            </div>
            {perimeterDetection && (
              <FormField label={`Rayon par défaut : ${perimeterRadius}m`}>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={perimeterRadius}
                  onChange={(e) => setPerimeterRadius(Number(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>50m</span>
                  <span>500m</span>
                </div>
              </FormField>
            )}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-8">
            <SectionTitle title="Envoi automatique" />
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Envoi automatique du planning</p>
                <p className="text-xs text-muted">Envoyer le planning par email aux collaborateurs</p>
              </div>
              <Toggle checked={autoSendPlanning} onChange={setAutoSendPlanning} />
            </div>
            {autoSendPlanning && (
              <FormField label={`Amplitude : ${amplitudeDays} jours avant`}>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={amplitudeDays}
                  onChange={(e) => setAmplitudeDays(Number(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>1 jour</span>
                  <span>14 jours</span>
                </div>
              </FormField>
            )}

            <SectionTitle title="PDF" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="En-tête PDF">
                <textarea
                  defaultValue="Éminence Propreté - 15 rue de la Propreté, 75001 Paris"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  rows={3}
                />
              </FormField>
              <FormField label="Pied de page PDF">
                <textarea
                  defaultValue="SIRET: 123 456 789 00012 - TVA: FR12345678900"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  rows={3}
                />
              </FormField>
            </div>
          </div>
        );

      case 'roles':
        return (
          <div className="space-y-6">
            <SectionTitle title="Rôles & Droits" />
            <p className="text-sm text-muted">
              Gérez les profils de permissions depuis la page dédiée.
            </p>
            <a
              href="/parametres/roles"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Gérer les rôles et permissions
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>

      <div className="flex gap-6">
        {/* Vertical Tabs */}
        <div className="w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  activeTab === tab.key
                    ? 'bg-primary-50 text-primary-700 font-medium border-l-4 border-primary-500'
                    : 'text-muted hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-surface rounded-card shadow-card p-6">
            {renderContent()}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-3">
              {saved && (
                <span className="text-sm text-green-600 font-medium">Paramètres enregistrés</span>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                ENREGISTRER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
