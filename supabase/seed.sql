-- =============================================================================
-- SEED DATA — Éminence Services Nettoyage (démo)
-- =============================================================================
-- Ce fichier insère des données de démonstration complètes.
-- Exécuter après toutes les migrations.
-- =============================================================================

-- On utilise des blocs DO pour générer et réutiliser les UUID
-- Note : gen_random_uuid() est disponible via l'extension pgcrypto.

-- =============================================================================
-- 1. PARAMÈTRES AGENCE (singleton)
-- =============================================================================
INSERT INTO agency_settings (
    id, name, logo_url, address, postal_code, city, country,
    siret, email, phone, emergency_phone_1, emergency_phone_2,
    night_hours_start, night_hours_end, timezone,
    overtime_smoothing_mode, employee_prefix, client_prefix,
    leave_count_mode, stock_mode,
    hourly_rate_day, tour_rate, deduct_breaks,
    default_planning_view, planning_email_amplitude,
    perimeter_radius_default, pdf_header, pdf_footer
) VALUES (
    gen_random_uuid(),
    'Éminence Services Nettoyage',
    NULL,
    '12 Rue de la Paix',
    '75002',
    'Paris',
    'France',
    '123 456 789 00012',
    'contact@eminence-services.fr',
    '01 42 00 00 00',
    '06 12 34 56 78',
    '06 98 76 54 32',
    '21:00:00',
    '06:00:00',
    'Europe/Paris',
    'month',
    'EM-',
    'CL-',
    'working_days',
    'simple',
    22.50,
    35.00,
    false,
    'month',
    7,
    200,
    'Éminence Services Nettoyage — SARL au capital de 50 000 €',
    'SIRET 123 456 789 00012 — TVA FR 12 345678900'
);

-- =============================================================================
-- 2. PROFILS DE PERMISSION
-- =============================================================================
INSERT INTO permission_profiles (id, name, role_type, permissions) VALUES
(
    gen_random_uuid(),
    'Directeur',
    'admin',
    '{
        "planning": {"read": true, "write": true, "publish": true},
        "clients": {"read": true, "write": true, "delete": true},
        "collaborators": {"read": true, "write": true, "delete": true},
        "billing": {"read": true, "write": true, "validate": true},
        "settings": {"read": true, "write": true},
        "reports": {"read": true, "export": true},
        "terrain": {"read": true, "write": true}
    }'::jsonb
),
(
    gen_random_uuid(),
    'Manager',
    'admin',
    '{
        "planning": {"read": true, "write": true, "publish": true},
        "clients": {"read": true, "write": true, "delete": false},
        "collaborators": {"read": true, "write": true, "delete": false},
        "billing": {"read": true, "write": false, "validate": false},
        "settings": {"read": true, "write": false},
        "reports": {"read": true, "export": true},
        "terrain": {"read": true, "write": true}
    }'::jsonb
),
(
    gen_random_uuid(),
    'Responsable terrain',
    'collaborator',
    '{
        "planning": {"read": true, "write": false, "publish": false},
        "clients": {"read": true, "write": false, "delete": false},
        "collaborators": {"read": true, "write": false, "delete": false},
        "billing": {"read": false, "write": false, "validate": false},
        "settings": {"read": false, "write": false},
        "reports": {"read": true, "export": false},
        "terrain": {"read": true, "write": true}
    }'::jsonb
);

-- =============================================================================
-- 3. TYPES D'INDISPONIBILITÉ
-- =============================================================================
INSERT INTO unavailability_types (id, name, color, deducts_work_time, is_active) VALUES
(gen_random_uuid(), 'Congés payés',       '#3B82F6', true,  true),
(gen_random_uuid(), 'Maladie',            '#EF4444', true,  true),
(gen_random_uuid(), 'Sans solde',         '#6B7280', true,  true),
(gen_random_uuid(), 'Événement familial', '#8B5CF6', true,  true),
(gen_random_uuid(), 'Vacataire',          '#F59E0B', false, true);

-- =============================================================================
-- 4. TYPES DE DEMANDE DE CONGÉ
-- =============================================================================
INSERT INTO request_types (id, name, category, is_active) VALUES
(gen_random_uuid(), 'Congés payés',            'collaborator', true),
(gen_random_uuid(), 'Congé sans solde',        'collaborator', true),
(gen_random_uuid(), 'Arrêt maladie',           'collaborator', true),
(gen_random_uuid(), 'Congé maternité/paternité', 'collaborator', true),
(gen_random_uuid(), 'Événement familial',      'collaborator', true);

-- =============================================================================
-- 5. CLIENTS
-- =============================================================================
-- On utilise un bloc DO pour réutiliser les UUID
DO $$
DECLARE
    client_1 UUID := gen_random_uuid();
    client_2 UUID := gen_random_uuid();
    client_3 UUID := gen_random_uuid();
    client_4 UUID := gen_random_uuid();
    client_5 UUID := gen_random_uuid();
    client_6 UUID := gen_random_uuid();
    -- Sites
    site_1 UUID := gen_random_uuid();
    site_2 UUID := gen_random_uuid();
    site_3 UUID := gen_random_uuid();
    site_4 UUID := gen_random_uuid();
    site_5 UUID := gen_random_uuid();
    site_6 UUID := gen_random_uuid();
    site_7 UUID := gen_random_uuid();
    site_8 UUID := gen_random_uuid();
    -- Collaborateurs
    collab_1 UUID := gen_random_uuid();
    collab_2 UUID := gen_random_uuid();
    collab_3 UUID := gen_random_uuid();
    collab_4 UUID := gen_random_uuid();
    collab_5 UUID := gen_random_uuid();
    collab_6 UUID := gen_random_uuid();
    collab_7 UUID := gen_random_uuid();
    collab_8 UUID := gen_random_uuid();
    -- Types de prestation
    presta_1 UUID := gen_random_uuid();
    presta_2 UUID := gen_random_uuid();
    presta_3 UUID := gen_random_uuid();
    -- Services
    svc_1 UUID := gen_random_uuid();
    svc_2 UUID := gen_random_uuid();
    svc_3 UUID := gen_random_uuid();
    svc_4 UUID := gen_random_uuid();
    svc_5 UUID := gen_random_uuid();
    svc_6 UUID := gen_random_uuid();
    svc_7 UUID := gen_random_uuid();
    svc_8 UUID := gen_random_uuid();
    svc_9 UUID := gen_random_uuid();
    svc_10 UUID := gen_random_uuid();
    -- Types d'indisponibilité (on récupère ceux existants)
    unav_type_conges UUID;
    unav_type_maladie UUID;
    unav_type_sans_solde UUID;
    -- Date de référence : lundi de cette semaine
    week_start DATE := date_trunc('week', CURRENT_DATE)::date;
BEGIN

    -- =========================================================================
    -- 5. CLIENTS
    -- =========================================================================
    INSERT INTO clients (id, type, name, address, postal_code, city, siret, email, phone, identifier_number, is_active) VALUES
    (client_1, 'public_org',    'Groupe Hospitalier Paris',   '47 Boulevard de l''Hôpital',  '75013', 'Paris',              '111 222 333 00001', 'contact@gh-paris.fr',       '01 45 00 00 01', 'CL-001', true),
    (client_2, 'company',       'SCI Montparnasse',           '22 Rue du Départ',            '75014', 'Paris',              '222 333 444 00002', 'gestion@sci-montparnasse.fr','01 45 00 00 02', 'CL-002', true),
    (client_3, 'company',       'Unibail-Rodamco',            '7 Place du Chancelier Adenauer','75016','Paris',             '333 444 555 00003', 'services@unibail.fr',       '01 45 00 00 03', 'CL-003', true),
    (client_4, 'company',       'Nexity Résidences',          '19 Rue de Vienne',            '75008', 'Paris',              '444 555 666 00004', 'contact@nexity-residences.fr','01 45 00 00 04','CL-004', true),
    (client_5, 'public_org',    'Mairie de Boulogne',         '26 Avenue André Morizet',     '92100', 'Boulogne-Billancourt','555 666 777 00005','mairie@boulogne92.fr',      '01 46 00 00 05', 'CL-005', true),
    (client_6, 'company',       'Centre Commercial Vélizy',   '2 Avenue de l''Europe',       '78140', 'Vélizy-Villacoublay','666 777 888 00006', 'direction@cc-velizy.fr',    '01 39 00 00 06', 'CL-006', true);

    -- =========================================================================
    -- 6. SITES (liés aux clients, coordonnées proches de Paris)
    -- =========================================================================
    INSERT INTO sites (id, client_id, name, color, address, postal_code, city, latitude, longitude, perimeter_radius, is_active) VALUES
    (site_1, client_1, 'Hôpital Pitié-Salpêtrière',   '#3B82F6', '47 Boulevard de l''Hôpital',       '75013', 'Paris',               48.8380000, 2.3650000, 300, true),
    (site_2, client_1, 'Hôpital Cochin',               '#10B981', '27 Rue du Faubourg Saint-Jacques', '75014', 'Paris',               48.8360000, 2.3390000, 250, true),
    (site_3, client_2, 'Tour Montparnasse',             '#F59E0B', '33 Avenue du Maine',               '75015', 'Paris',               48.8422000, 2.3219000, 200, true),
    (site_4, client_3, 'Centre Commercial Les 4 Temps', '#EF4444', '15 Parvis de la Défense',          '92800', 'Puteaux',             48.8920000, 2.2370000, 350, true),
    (site_5, client_4, 'Résidence Les Jardins',          '#8B5CF6', '5 Allée des Tulipes',              '92400', 'Courbevoie',          48.8970000, 2.2530000, 150, true),
    (site_6, client_4, 'Résidence Parc Central',         '#EC4899', '12 Rue des Lilas',                 '92200', 'Neuilly-sur-Seine',   48.8840000, 2.2690000, 150, true),
    (site_7, client_5, 'Mairie — Bâtiment Principal',    '#6366F1', '26 Avenue André Morizet',          '92100', 'Boulogne-Billancourt',48.8330000, 2.2380000, 200, true),
    (site_8, client_6, 'Centre Commercial Vélizy 2',     '#14B8A6', '2 Avenue de l''Europe',            '78140', 'Vélizy-Villacoublay', 48.7840000, 2.1920000, 400, true);

    -- =========================================================================
    -- 7. COLLABORATEURS
    -- =========================================================================
    INSERT INTO collaborators (id, type, first_name, last_name, email, phone, address, postal_code, city, birth_date, nationality, gender, rating, status, matricule, seniority_date, has_license) VALUES
    (collab_1, 'employee', 'Mohamed',  'Keita',   'mohamed.keita@eminence.fr',   '06 10 00 00 01', '15 Rue de Tolbiac',           '75013', 'Paris',               '1988-03-15', 'Française', 'male',   4, 'active', 'EM-001', '2020-01-15', true),
    (collab_2, 'employee', 'Fatou',    'Diallo',  'fatou.diallo@eminence.fr',    '06 10 00 00 02', '8 Rue des Peupliers',         '92400', 'Courbevoie',          '1992-07-22', 'Française', 'female', 5, 'active', 'EM-002', '2019-06-01', true),
    (collab_3, 'employee', 'Ibrahim',  'Sylla',   'ibrahim.sylla@eminence.fr',   '06 10 00 00 03', '25 Avenue de la République',  '92100', 'Boulogne-Billancourt','1985-11-08', 'Française', 'male',   3, 'active', 'EM-003', '2021-03-10', true),
    (collab_4, 'employee', 'Aminata',  'Camara',  'aminata.camara@eminence.fr',  '06 10 00 00 04', '3 Rue Voltaire',              '75011', 'Paris',               '1990-05-30', 'Française', 'female', 4, 'active', 'EM-004', '2020-09-01', true),
    (collab_5, 'employee', 'Mamadou',  'Traore',  'mamadou.traore@eminence.fr',  '06 10 00 00 05', '17 Rue de la Gare',           '92200', 'Neuilly-sur-Seine',   '1987-01-12', 'Française', 'male',   3, 'active', 'EM-005', '2022-01-15', false),
    (collab_6, 'employee', 'Aissatou', 'Barry',   'aissatou.barry@eminence.fr',  '06 10 00 00 06', '42 Boulevard Haussmann',      '75009', 'Paris',               '1994-09-18', 'Française', 'female', 4, 'active', 'EM-006', '2021-07-01', true),
    (collab_7, 'employee', 'Ousmane',  'Diop',    'ousmane.diop@eminence.fr',    '06 10 00 00 07', '6 Rue du Commerce',           '78140', 'Vélizy-Villacoublay', '1991-04-25', 'Française', 'male',   3, 'active', 'EM-007', '2023-02-01', true),
    (collab_8, 'employee', 'Mariama',  'Sow',     'mariama.sow@eminence.fr',     '06 10 00 00 08', '11 Rue de Paris',             '92800', 'Puteaux',             '1993-12-05', 'Française', 'female', 4, 'active', 'EM-008', '2022-06-15', true);

    -- =========================================================================
    -- 8. TYPES DE PRESTATION
    -- =========================================================================
    INSERT INTO prestation_types (id, name, frequency, billing_mode_default, positions_required, is_active) VALUES
    (presta_1, 'Nettoyage bureaux standard',         'weekly',  'hourly', 1, true),
    (presta_2, 'Remise en état après travaux',        'once',    'flat',   2, true),
    (presta_3, 'Entretien parties communes',          'daily',   'hourly', 1, true);

    -- =========================================================================
    -- 9. SERVICES (10 services cette semaine, répartis sur les sites)
    -- =========================================================================
    INSERT INTO services (id, site_id, prestation_id, date, start_time, end_time, billing_mode, positions_required, is_draft, is_published, instructions) VALUES
    (svc_1,  site_1, presta_1, week_start,     '06:00', '10:00', 'hourly', 1, false, true,  'Nettoyage des couloirs et salles d''attente.'),
    (svc_2,  site_1, presta_3, week_start,     '14:00', '18:00', 'hourly', 1, false, true,  'Entretien parties communes bâtiment A.'),
    (svc_3,  site_2, presta_1, week_start + 1, '07:00', '11:00', 'hourly', 1, false, true,  'Nettoyage standard des bureaux.'),
    (svc_4,  site_3, presta_1, week_start + 1, '18:00', '22:00', 'hourly', 1, false, true,  'Nettoyage bureaux tour Montparnasse étages 10-15.'),
    (svc_5,  site_4, presta_3, week_start + 2, '06:00', '12:00', 'hourly', 2, false, true,  'Entretien parties communes centre commercial.'),
    (svc_6,  site_5, presta_1, week_start + 2, '08:00', '12:00', 'hourly', 1, false, true,  'Nettoyage halls et escaliers résidence.'),
    (svc_7,  site_6, presta_1, week_start + 3, '08:00', '12:00', 'hourly', 1, false, true,  'Nettoyage résidence Parc Central.'),
    (svc_8,  site_7, presta_2, week_start + 3, '13:00', '18:00', 'flat',   2, false, true,  'Remise en état après travaux — salle du conseil.'),
    (svc_9,  site_8, presta_3, week_start + 4, '06:00', '14:00', 'hourly', 2, false, true,  'Grand entretien centre commercial Vélizy 2.'),
    (svc_10, site_1, presta_1, week_start + 4, '14:00', '18:00', 'hourly', 1, false, true,  'Nettoyage bureaux administratifs.');

    -- =========================================================================
    -- 10. AFFECTATIONS DE SERVICES (5 affectations)
    -- =========================================================================
    INSERT INTO service_assignments (id, service_id, collaborator_id, position_title) VALUES
    (gen_random_uuid(), svc_1,  collab_1, 'Agent de nettoyage'),
    (gen_random_uuid(), svc_3,  collab_2, 'Agent de nettoyage'),
    (gen_random_uuid(), svc_5,  collab_3, 'Agent de nettoyage'),
    (gen_random_uuid(), svc_5,  collab_4, 'Agent de nettoyage'),
    (gen_random_uuid(), svc_9,  collab_7, 'Agent de nettoyage');

    -- =========================================================================
    -- 11. INDISPONIBILITÉS (3 : 1 approuvée, 1 en attente, 1 refusée)
    -- =========================================================================
    -- Récupérer les IDs des types d'indisponibilité
    SELECT id INTO unav_type_conges FROM unavailability_types WHERE name = 'Congés payés' LIMIT 1;
    SELECT id INTO unav_type_maladie FROM unavailability_types WHERE name = 'Maladie' LIMIT 1;
    SELECT id INTO unav_type_sans_solde FROM unavailability_types WHERE name = 'Sans solde' LIMIT 1;

    INSERT INTO unavailabilities (id, collaborator_id, type_id, start_date, end_date, reason, status) VALUES
    (gen_random_uuid(), collab_5, unav_type_conges,     week_start + 7,  week_start + 14, 'Vacances familiales',            'approved'),
    (gen_random_uuid(), collab_6, unav_type_maladie,    week_start + 3,  week_start + 5,  'Certificat médical transmis',    'pending'),
    (gen_random_uuid(), collab_8, unav_type_sans_solde, week_start + 10, week_start + 12, 'Convenance personnelle',         'rejected');

    -- =========================================================================
    -- 12. NOTIFICATIONS (5, mix de types)
    -- =========================================================================
    -- Note : les notifications nécessitent un user_id (profiles.id).
    -- En démo, on insère conditionnellement si un profil admin existe.
    -- En production, elles seront créées via les triggers et les crons.

END $$;

-- Notifications (bloc séparé pour accéder aux profils existants)
DO $$
DECLARE
    admin_profile_id UUID;
BEGIN
    SELECT id INTO admin_profile_id FROM profiles WHERE role = 'super_admin' LIMIT 1;

    IF admin_profile_id IS NOT NULL THEN
        INSERT INTO notifications (id, user_id, type, title, body, is_read) VALUES
        (gen_random_uuid(), admin_profile_id, 'service_non_demarre',     'Service non démarré — Mohamed Keita',          'Mohamed Keita n''a pas pointé pour le service de 06:00 sur Pitié-Salpêtrière.', false),
        (gen_random_uuid(), admin_profile_id, 'expiration_collaborateur', 'Expiration dans 30 jours — Fatou Diallo',     'Le titre de séjour de Fatou Diallo expire le 2026-05-05.',                      false),
        (gen_random_uuid(), admin_profile_id, 'facture_impayee',         'Facture impayée — SCI Montparnasse',           'La facture FAC-2026-042 de 3 200,00 € est en retard de 15 jours.',             true),
        (gen_random_uuid(), admin_profile_id, 'devis_sans_reponse',      'Devis bientôt expiré — Unibail-Rodamco',      'Le devis DEV-2026-018 de 12 500,00 € expire dans 5 jours.',                    false),
        (gen_random_uuid(), admin_profile_id, 'indisponibilite',         'Demande d''indisponibilité — Aissatou Barry',  'Aissatou Barry a soumis une demande de maladie du 09/04 au 11/04.',            false);
    END IF;
END $$;

-- =========================================================================
-- 13. ANNONCES (2)
-- =========================================================================
DO $$
DECLARE
    author_id UUID;
BEGIN
    SELECT id INTO author_id FROM profiles WHERE role IN ('super_admin', 'manager') LIMIT 1;

    IF author_id IS NOT NULL THEN
        INSERT INTO announcements (id, title, content, author_id, status, target_type) VALUES
        (gen_random_uuid(), 'Nouvelle procédure de pointage',
         'À compter du 15 avril 2026, le pointage se fait obligatoirement via l''application mobile avec photo. Merci de mettre à jour votre application.',
         author_id, 'active', 'all'),
        (gen_random_uuid(), 'Fermeture exceptionnelle — 1er mai',
         'Tous les sites seront fermés le 1er mai 2026 (Fête du Travail). Aucun service ne sera planifié ce jour-là.',
         author_id, 'active', 'all');
    END IF;
END $$;

-- =============================================================================
-- 14. DOSSIERS DE DOCUMENTS (3)
-- =============================================================================
INSERT INTO document_folders (id, name, entity_type) VALUES
(gen_random_uuid(), 'Contrats de travail',    'collaborator'),
(gen_random_uuid(), 'Pièces d''identité',     'collaborator'),
(gen_random_uuid(), 'Cahiers des charges',    'client');

-- =============================================================================
-- NOTE : Les types d'événements MCE sont déjà insérés dans la migration 002.
-- Pas besoin de les réinsérer ici.
-- =============================================================================
