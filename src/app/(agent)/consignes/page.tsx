'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Paperclip, Image, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Instruction {
  id: string;
  title: string;
  content: string;
  attachments?: string[];
  photos?: string[];
  urgent?: boolean;
}

interface ConsigneSection {
  id: string;
  emoji: string;
  title: string;
  instructions: Instruction[];
}

const mockConsignes: ConsigneSection[] = [
  {
    id: 'agence',
    emoji: '🏢',
    title: 'Consignes générales agence',
    instructions: [
      {
        id: 'a1',
        title: 'Port des EPI obligatoire',
        content:
          'Le port des équipements de protection individuelle est obligatoire sur tous les sites : gants, chaussures de sécurité, gilet haute visibilité si nécessaire. Le non-respect de cette consigne entraînera des sanctions.',
        urgent: true,
      },
      {
        id: 'a2',
        title: 'Utilisation des produits',
        content:
          'Respecter les dosages indiqués sur chaque produit. Ne jamais mélanger les produits chimiques. Consulter les fiches de sécurité disponibles dans l\'application.',
        attachments: ['Fiche_securite_2024.pdf'],
      },
      {
        id: 'a3',
        title: 'Signalement des incidents',
        content:
          'Tout incident, dégradation ou anomalie doit être signalé immédiatement via l\'application ou par appel au responsable de secteur.',
      },
    ],
  },
  {
    id: 'site',
    emoji: '📍',
    title: 'Consignes du site',
    instructions: [
      {
        id: 's1',
        title: 'Accès Tour Montparnasse',
        content:
          'Entrée par le parking niveau -1, porte de service. Badge obligatoire. Passage par le poste de sécurité pour enregistrement. Horaires d\'accès autorisés : 5h00 - 22h00.',
        photos: ['plan_acces.jpg'],
      },
      {
        id: 's2',
        title: 'Zones interdites',
        content:
          'Accès interdit au datacenter (étage 8) et à la salle des serveurs (étage 3). Ne pas utiliser les ascenseurs réservés visiteurs entre 8h et 9h30.',
        urgent: true,
      },
    ],
  },
  {
    id: 'service',
    emoji: '📋',
    title: 'Consignes du service',
    instructions: [
      {
        id: 'sv1',
        title: 'Ordre des tâches',
        content:
          '1. Vider les corbeilles de tout l\'étage\n2. Dépoussiérer les bureaux et surfaces\n3. Nettoyer les vitres intérieures (bureau direction uniquement)\n4. Aspirer les moquettes\n5. Nettoyer les sanitaires\n6. Repasser l\'aspirateur dans le couloir principal',
      },
      {
        id: 'sv2',
        title: 'Bureau du directeur',
        content:
          'Ne pas déplacer les documents sur le bureau. Utiliser uniquement le chiffon microfibre bleu pour les surfaces laquées. Attention aux objets fragiles sur l\'étagère.',
        attachments: ['Photo_bureau_direction.jpg'],
      },
    ],
  },
  {
    id: 'prestation',
    emoji: '🔧',
    title: 'Consignes de la prestation',
    instructions: [
      {
        id: 'p1',
        title: 'Produits spécifiques',
        content:
          'Utiliser exclusivement les produits écologiques de la gamme Éminence Vert pour ce client. Le client est certifié ISO 14001, aucun produit non-référencé ne doit être utilisé.',
        attachments: ['Liste_produits_autorises.pdf'],
      },
      {
        id: 'p2',
        title: 'Contrôle qualité',
        content:
          'Un contrôle qualité sera effectué par le responsable de site chaque vendredi. Les points de contrôle incluent : propreté des vitres, état des sanitaires, absence de poussière sur les surfaces hautes.',
        photos: ['grille_qualite.jpg'],
      },
    ],
  },
];

export default function ConsignesPage() {
  const [openSections, setOpenSections] = useState<string[]>(['agence']);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAcknowledge = (instructionId: string) => {
    setAcknowledged((prev) => [...prev, instructionId]);
  };

  const urgentCount = mockConsignes
    .flatMap((s) => s.instructions)
    .filter((i) => i.urgent && !acknowledged.includes(i.id)).length;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold text-gray-900 mb-1">Consignes</h1>
      {urgentCount > 0 && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            {urgentCount} consigne{urgentCount > 1 ? 's' : ''} urgente{urgentCount > 1 ? 's' : ''} à confirmer
          </p>
        </div>
      )}

      <div className="space-y-3">
        {mockConsignes.map((section) => {
          const isOpen = openSections.includes(section.id);
          const hasUrgent = section.instructions.some(
            (i) => i.urgent && !acknowledged.includes(i.id)
          );

          return (
            <div
              key={section.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                hasUrgent ? 'border-red-300' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.emoji}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                    <p className="text-xs text-gray-400">
                      {section.instructions.length} consigne{section.instructions.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasUrgent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {section.instructions.map((instruction) => {
                    const isUrgent = instruction.urgent && !acknowledged.includes(instruction.id);
                    const isAcknowledged = acknowledged.includes(instruction.id);

                    return (
                      <div
                        key={instruction.id}
                        className={`rounded-xl p-3 ${
                          isUrgent
                            ? 'bg-red-50 border-2 border-red-300'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isUrgent && (
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          )}
                          {isAcknowledged && instruction.urgent && (
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm ${isUrgent ? 'text-red-800' : 'text-gray-800'}`}>
                              {instruction.title}
                              {isUrgent && (
                                <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full uppercase">
                                  Urgent
                                </span>
                              )}
                            </h4>
                            <p className={`text-sm mt-1.5 whitespace-pre-line ${isUrgent ? 'text-red-700' : 'text-gray-600'}`}>
                              {instruction.content}
                            </p>

                            {/* Attachments */}
                            {instruction.attachments && instruction.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {instruction.attachments.map((att) => (
                                  <div
                                    key={att}
                                    className="flex items-center gap-1.5 text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-lg w-fit"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    {att}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Photos */}
                            {instruction.photos && instruction.photos.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {instruction.photos.map((photo) => (
                                  <div
                                    key={photo}
                                    className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-lg w-fit"
                                  >
                                    <Image className="w-3 h-3" />
                                    {photo}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Urgent acknowledge button */}
                            {isUrgent && (
                              <button
                                onClick={() => handleAcknowledge(instruction.id)}
                                className="mt-3 w-full py-3 bg-red-600 text-white font-semibold text-sm rounded-xl active:scale-[0.97] transition-all"
                              >
                                J&apos;ai lu et compris
                              </button>
                            )}
                            {isAcknowledged && instruction.urgent && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Confirmé
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
