'use client';

import { useState } from 'react';
import {
  Megaphone, Plus, MessageCircle, Users, User, MapPin,
  Calendar, ChevronRight
} from 'lucide-react';

type AnnonceTarget = 'tous' | 'site' | 'agent';
type AnnonceTab = 'actives' | 'mes_annonces' | 'mes_reponses';

interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  auteur: string;
  date: string;
  cible: AnnonceTarget;
  cibleDetail?: string;
  nbReponses: number;
  estMienne: boolean;
  jaRepondu: boolean;
}

const mockAnnonces: Annonce[] = [
  {
    id: 'ann-1',
    titre: 'Mise à jour du protocole sanitaire',
    contenu: 'Suite aux nouvelles directives, le protocole de nettoyage des espaces communs est mis à jour. Merci de consulter le document joint et d\'appliquer les nouvelles procédures dès lundi prochain.',
    auteur: 'Direction',
    date: '2026-04-02',
    cible: 'tous',
    nbReponses: 12,
    estMienne: false,
    jaRepondu: true,
  },
  {
    id: 'ann-2',
    titre: 'Formation sécurité - Inscription obligatoire',
    contenu: 'Une formation sécurité incendie sera organisée le 15 avril. Tous les agents travaillant sur les sites de la Tour Haussmann doivent s\'inscrire avant le 10 avril.',
    auteur: 'Sophie Laurent',
    date: '2026-03-30',
    cible: 'site',
    cibleDetail: 'Tour Haussmann',
    nbReponses: 6,
    estMienne: false,
    jaRepondu: false,
  },
  {
    id: 'ann-3',
    titre: 'Nouveau matériel disponible',
    contenu: 'De nouveaux aspirateurs Kärcher T12/1 sont disponibles au dépôt. Contactez votre responsable pour en faire la demande.',
    auteur: 'Responsable stocks',
    date: '2026-03-28',
    cible: 'tous',
    nbReponses: 3,
    estMienne: true,
    jaRepondu: false,
  },
  {
    id: 'ann-4',
    titre: 'Changement d\'horaires site Boulangerie Dupont',
    contenu: 'À partir du 1er avril, les horaires d\'intervention sur le site Boulangerie Dupont passent de 5h-7h à 6h-8h. Merci de prendre note de ce changement.',
    auteur: 'Direction',
    date: '2026-03-25',
    cible: 'agent',
    cibleDetail: 'Karim Zidane',
    nbReponses: 1,
    estMienne: true,
    jaRepondu: false,
  },
];

const targetConfig: Record<AnnonceTarget, { label: string; icon: React.ReactNode; color: string }> = {
  tous: { label: 'Tous', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-blue-100 text-blue-800' },
  site: { label: 'Site', icon: <MapPin className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-800' },
  agent: { label: 'Agent', icon: <User className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-800' },
};

export default function AnnoncesPage() {
  const [activeTab, setActiveTab] = useState<AnnonceTab>('actives');

  const activeCount = mockAnnonces.length;
  const mesAnnonces = mockAnnonces.filter(a => a.estMienne);
  const mesReponses = mockAnnonces.filter(a => a.jaRepondu);

  const displayedAnnonces = activeTab === 'actives'
    ? mockAnnonces
    : activeTab === 'mes_annonces'
    ? mesAnnonces
    : mesReponses;

  const tabs: { key: AnnonceTab; label: string; count?: number }[] = [
    { key: 'actives', label: 'Annonces actives', count: activeCount },
    { key: 'mes_annonces', label: 'Mes annonces' },
    { key: 'mes_reponses', label: 'Mes réponses' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Annonces</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" />
          Créer une annonce
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.key ? 'bg-white/30' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        {displayedAnnonces.map(annonce => {
          const target = targetConfig[annonce.cible];
          return (
            <div key={annonce.id} className="bg-surface rounded-card shadow-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-foreground">{annonce.titre}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${target.color}`}>
                        {target.icon}
                        {target.label}
                        {annonce.cibleDetail && ` : ${annonce.cibleDetail}`}
                      </span>
                    </div>
                    <p className="text-sm text-muted line-clamp-2 mb-3">{annonce.contenu}</p>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {annonce.auteur}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(annonce.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {annonce.nbReponses} réponse{annonce.nbReponses > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-muted hover:text-foreground rounded-lg hover:bg-gray-50 transition-colors shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}

        {displayedAnnonces.length === 0 && (
          <div className="bg-surface rounded-card shadow-card p-12 text-center">
            <Megaphone className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">Aucune annonce dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}
