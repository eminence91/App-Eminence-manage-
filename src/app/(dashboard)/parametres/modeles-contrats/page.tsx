'use client';

import { useState } from 'react';
import {
  FileText, Plus, Edit, Eye, ArrowLeft, Copy, Tag
} from 'lucide-react';

type TemplateType = 'CDI' | 'CDD' | 'Client' | 'Avenant';
type TemplateTarget = 'Collaborateur' | 'Client';
type TemplateStatus = 'actif' | 'brouillon';

interface ContractTemplate {
  id: string;
  nom: string;
  type: TemplateType;
  cible: TemplateTarget;
  statut: TemplateStatus;
  contenu: string;
  derniereModification: string;
}

const availableVariables = [
  { label: 'Nom', variable: '{{nom}}' },
  { label: 'Prénom', variable: '{{prenom}}' },
  { label: 'Date de début', variable: '{{date_debut}}' },
  { label: 'Date de fin', variable: '{{date_fin}}' },
  { label: 'Poste', variable: '{{poste}}' },
  { label: 'Taux horaire', variable: '{{taux_horaire}}' },
  { label: 'Heures hebdomadaires', variable: '{{heures_hebdo}}' },
  { label: 'Nom du site', variable: '{{site}}' },
  { label: 'Adresse du site', variable: '{{adresse_site}}' },
  { label: 'Nom de l\'agence', variable: '{{agence}}' },
  { label: 'SIRET', variable: '{{siret}}' },
  { label: 'Date du jour', variable: '{{date_jour}}' },
];

const mockTemplates: ContractTemplate[] = [
  {
    id: 'tpl-1',
    nom: 'Contrat CDI - Agent de propreté',
    type: 'CDI',
    cible: 'Collaborateur',
    statut: 'actif',
    derniereModification: '2026-03-15',
    contenu: `CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE

Entre les soussignés :

La société {{agence}}, SIRET {{siret}}, ci-après dénommée "l'Employeur",

Et

M./Mme {{prenom}} {{nom}}, ci-après dénommé(e) "le/la Salarié(e)",

Il a été convenu ce qui suit :

Article 1 - Engagement
Le/La salarié(e) est engagé(e) à compter du {{date_debut}} en qualité de {{poste}}.

Article 2 - Lieu de travail
Le lieu de travail principal est fixé à {{adresse_site}} ({{site}}).

Article 3 - Rémunération
La rémunération brute horaire est fixée à {{taux_horaire}} euros.
La durée hebdomadaire de travail est de {{heures_hebdo}} heures.

Fait à Paris, le {{date_jour}}.`,
  },
  {
    id: 'tpl-2',
    nom: 'Contrat CDD - Remplacement',
    type: 'CDD',
    cible: 'Collaborateur',
    statut: 'actif',
    derniereModification: '2026-02-20',
    contenu: `CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE

Motif : Remplacement

Entre {{agence}} (SIRET: {{siret}}) et M./Mme {{prenom}} {{nom}}.

Poste : {{poste}}
Site : {{site}} - {{adresse_site}}
Du {{date_debut}} au {{date_fin}}
Taux horaire : {{taux_horaire}} euros
Heures hebdo : {{heures_hebdo}}h

Fait le {{date_jour}}.`,
  },
  {
    id: 'tpl-3',
    nom: 'Convention de prestation - Client',
    type: 'Client',
    cible: 'Client',
    statut: 'brouillon',
    derniereModification: '2026-04-01',
    contenu: `CONVENTION DE PRESTATION DE SERVICES

Entre {{agence}} (SIRET: {{siret}}) et {{nom}}.

Site concerné : {{site}} - {{adresse_site}}
Date de début : {{date_debut}}
Taux horaire : {{taux_horaire}} euros

Fait le {{date_jour}}.`,
  },
];

const typeConfig: Record<TemplateType, { color: string }> = {
  CDI: { color: 'bg-green-100 text-green-800' },
  CDD: { color: 'bg-blue-100 text-blue-800' },
  Client: { color: 'bg-purple-100 text-purple-800' },
  Avenant: { color: 'bg-amber-100 text-amber-800' },
};

const statusConfig: Record<TemplateStatus, { label: string; color: string }> = {
  actif: { label: 'Actif', color: 'bg-green-100 text-green-800' },
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
};

export default function ModelesContratsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const activeTemplate = mockTemplates.find(t => t.id === selectedTemplate);

  const handleEdit = (template: ContractTemplate) => {
    setSelectedTemplate(template.id);
    setEditContent(template.contenu);
  };

  const insertVariable = (variable: string) => {
    setEditContent(prev => prev + variable);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedTemplate && (
            <button
              onClick={() => setSelectedTemplate(null)}
              className="p-2 text-muted hover:text-foreground rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-foreground">
            {selectedTemplate ? `Modèle : ${activeTemplate?.nom}` : 'Modèles de contrats'}
          </h1>
        </div>
        {!selectedTemplate && (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau modèle
          </button>
        )}
      </div>

      {!selectedTemplate ? (
        /* Templates List */
        <div className="bg-surface rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Nom</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Type</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Cible</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Dernière modification</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTemplates.map(tpl => (
                <tr key={tpl.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted shrink-0" />
                      <span className="text-sm font-medium text-foreground">{tpl.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[tpl.type].color}`}>
                      {tpl.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-muted">{tpl.cible}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[tpl.statut].color}`}>
                      {statusConfig[tpl.statut].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{new Date(tpl.derniereModification).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleEdit(tpl)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" title="Dupliquer">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTemplate ? (
        /* Template Editor */
        <div className="flex gap-6">
          {/* Editor */}
          <div className="flex-1">
            <div className="bg-surface rounded-card shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig[activeTemplate.type].color}`}>
                    {activeTemplate.type}
                  </span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[activeTemplate.statut].color}`}>
                    {statusConfig[activeTemplate.statut].label}
                  </span>
                </div>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                  Enregistrer
                </button>
              </div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-4 py-4 text-sm text-foreground font-mono leading-relaxed focus:outline-none resize-none"
                rows={25}
              />
            </div>
          </div>

          {/* Variables Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-surface rounded-card shadow-card p-4 sticky top-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Variables disponibles
              </h3>
              <div className="space-y-1.5">
                {availableVariables.map(v => (
                  <button
                    key={v.variable}
                    onClick={() => insertVariable(v.variable)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-primary-50 transition-colors group"
                  >
                    <span className="text-sm text-foreground">{v.label}</span>
                    <code className="text-xs text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded group-hover:bg-primary-100">
                      {v.variable}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
