# Éminence Manager

Application de gestion complète pour **Éminence Services Nettoyage** — entreprise de nettoyage de chantiers BTP.

> 9 avenue de Norvège, 91140 Villebon-sur-Yvette

## Stack technique

- **Frontend** : Next.js 14 (App Router) + Tailwind CSS
- **Backend / BDD** : Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Notifications** : Supabase Realtime + Web Push
- **Géolocalisation** : API Geolocation navigateur + Google Maps API
- **Déploiement** : Vercel + Supabase
- **Intégration** : API PennyLane (compta/facturation)
- **Exports** : jsPDF + SheetJS (xlsx)

## Installation

```bash
# 1. Cloner le projet
git clone <repo-url>
cd eminence-manager

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les variables dans .env.local

# 4. Configurer Supabase
# - Créer un projet sur supabase.com (région EU Paris)
# - Exécuter les migrations SQL dans l'ordre :
#   supabase/migrations/001_auth_roles.sql → 014_rls_policies.sql

# 5. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (anon) Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (serveur uniquement) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Clé API Google Maps |
| `PENNYLANE_API_KEY` | Clé API PennyLane |
| `PENNYLANE_API_URL` | URL API PennyLane |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Clé publique VAPID (Web Push) |
| `VAPID_PRIVATE_KEY` | Clé privée VAPID |

## Modules

1. **Paramètres agence** — Configuration complète
2. **Clients** — Gestion clients avec contacts, contrats, tarifs
3. **Sites** — Fiche site avec carte, périmètre GPS, consignes
4. **Collaborateurs** — Gestion RH, contrats, expirations, salaire
5. **Planning** — Vue sites/collaborateurs, services, récurrences
6. **Terrain (Mobile)** — Pointage GPS, MCE, bons d'intervention
7. **Notifications** — Temps réel (push + interface)
8. **Demandes** — Congés, absences, demandes clients
9. **Supervision** — Carte Google Maps temps réel
10. **Stocks** — Matériel (simplifié/complet)
11. **Documents** — GED avec dossiers et partage
12. **Exports** — PDF + Excel (prépaie, registre, MCE)
13. **Tableau de bord** — Widgets personnalisables
14. **Facturation/PennyLane** — Clôture mensuelle + sync
15. **Annuaire & Messagerie** — Communication interne

## Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| **Super Admin** | Accès total, paramètres, clôture PennyLane |
| **Manager** | Planification, terrain, collaborateurs (sans finances) |
| **Agent** | App mobile : planning, pointage GPS, MCE, consignes |
| **Client** | Lecture seule : planning sites, MCE, bons intervention |

## Connexion PennyLane

L'intégration PennyLane utilise l'API REST v1 :

| Endpoint | Utilisation |
|----------|-------------|
| `GET /company` | Test de connexion |
| `GET /customers` | Import clients |
| `POST /customers` | Sync clients |
| `POST /customer_invoices` | Création facture brouillon |
| `GET /customer_invoices/:id` | Consultation facture |

> Si un endpoint n'est pas disponible, l'export CSV/PDF est proposé en alternative.

## Web Push Notifications

1. Générer les clés VAPID : `npx web-push generate-vapid-keys`
2. Ajouter les clés dans `.env.local`
3. Le service worker (`public/sw.js`) gère les push notifications
4. L'utilisateur doit accepter les notifications dans son navigateur

## Déploiement

### Vercel
```bash
vercel --prod
```

### Supabase
- Créer le projet sur [supabase.com](https://supabase.com) (région : EU West Paris)
- Exécuter les migrations dans l'ordre
- Activer Realtime sur les tables : `notifications`, `services`, `main_courante_events`
- Configurer le Storage pour les uploads (buckets : avatars, documents, photos)

## PWA

L'application est installable sur mobile (PWA) :
- Manifeste : `public/manifest.json`
- Service Worker : `public/sw.js`
- Sur iPhone : Safari → Partager → Sur l'écran d'accueil
- Sur Android : Chrome → Menu → Installer l'application

## Licence

Propriétaire — Éminence Services Nettoyage
