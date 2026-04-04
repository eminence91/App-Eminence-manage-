-- 014_rls_policies.sql
-- Audit logs table + RLS on ALL tables

-- ============================================================
-- Audit logs
-- ============================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- Helper function: get role of current user
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: check if current user is admin (super_admin or manager)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'manager')
          AND is_active = true
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'super_admin'
          AND is_active = true
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: get collaborator_id for current user
CREATE OR REPLACE FUNCTION public.current_collaborator_id()
RETURNS UUID AS $$
    SELECT id FROM public.collaborators WHERE profile_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- Enable RLS on ALL tables
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE unavailability_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE mce_event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_expirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_closure_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_prestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_collaborator_prefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_keys_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_terrain_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborator_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborator_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborator_expirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborator_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_recurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE unavailabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE replacements ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_interruptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE main_courante_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE perimeter_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stock_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruction_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE closure_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY profiles_select_own ON profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY profiles_select_admin ON profiles
    FOR SELECT USING (public.is_admin());

CREATE POLICY profiles_update_own ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY profiles_admin_all ON profiles
    FOR ALL USING (public.is_super_admin());

-- ============================================================
-- PERMISSION PROFILES & USER PERMISSIONS
-- ============================================================
CREATE POLICY permission_profiles_admin ON permission_profiles
    FOR ALL USING (public.is_admin());

CREATE POLICY permission_profiles_read ON permission_profiles
    FOR SELECT USING (true);

CREATE POLICY user_permissions_admin ON user_permissions
    FOR ALL USING (public.is_admin());

CREATE POLICY user_permissions_read_own ON user_permissions
    FOR SELECT USING (profile_id = auth.uid());

-- ============================================================
-- AGENCY SETTINGS
-- ============================================================
CREATE POLICY agency_settings_read ON agency_settings
    FOR SELECT USING (true);

CREATE POLICY agency_settings_admin ON agency_settings
    FOR ALL USING (public.is_admin());

-- ============================================================
-- LOOKUP TABLES (unavailability_types, request_types, mce_event_types,
--   intervention_form_fields, document_folders, general_instructions)
-- ============================================================
-- Read for all authenticated users, write for admins
CREATE POLICY unavailability_types_read ON unavailability_types FOR SELECT USING (true);
CREATE POLICY unavailability_types_admin ON unavailability_types FOR ALL USING (public.is_admin());

CREATE POLICY request_types_read ON request_types FOR SELECT USING (true);
CREATE POLICY request_types_admin ON request_types FOR ALL USING (public.is_admin());

CREATE POLICY mce_event_types_read ON mce_event_types FOR SELECT USING (true);
CREATE POLICY mce_event_types_admin ON mce_event_types FOR ALL USING (public.is_admin());

CREATE POLICY intervention_form_fields_read ON intervention_form_fields FOR SELECT USING (true);
CREATE POLICY intervention_form_fields_admin ON intervention_form_fields FOR ALL USING (public.is_admin());

CREATE POLICY document_folders_read ON document_folders FOR SELECT USING (true);
CREATE POLICY document_folders_admin ON document_folders FOR ALL USING (public.is_admin());

CREATE POLICY general_instructions_read ON general_instructions FOR SELECT USING (true);
CREATE POLICY general_instructions_admin ON general_instructions FOR ALL USING (public.is_admin());

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE POLICY clients_admin ON clients
    FOR ALL USING (public.is_admin());

CREATE POLICY clients_client_read ON clients
    FOR SELECT USING (
        public.current_user_role() = 'client'
        AND id IN (
            SELECT client_id FROM client_accounts
            WHERE profile_id = auth.uid() AND is_active = true
        )
    );

-- Client sub-tables: admin full, client users read their own
CREATE POLICY client_contacts_admin ON client_contacts FOR ALL USING (public.is_admin());
CREATE POLICY client_contacts_client_read ON client_contacts FOR SELECT USING (
    client_id IN (SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true)
);

CREATE POLICY client_articles_admin ON client_articles FOR ALL USING (public.is_admin());
CREATE POLICY client_articles_client_read ON client_articles FOR SELECT USING (
    client_id IN (SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true)
);

CREATE POLICY client_contracts_admin ON client_contracts FOR ALL USING (public.is_admin());
CREATE POLICY client_contracts_client_read ON client_contracts FOR SELECT USING (
    client_id IN (SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true)
);

CREATE POLICY client_accounts_admin ON client_accounts FOR ALL USING (public.is_admin());
CREATE POLICY client_accounts_own_read ON client_accounts FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY client_expirations_admin ON client_expirations FOR ALL USING (public.is_admin());

-- ============================================================
-- SITES
-- ============================================================
CREATE POLICY sites_admin ON sites FOR ALL USING (public.is_admin());

CREATE POLICY sites_agent_read ON sites FOR SELECT USING (
    public.current_user_role() = 'agent'
    AND id IN (
        SELECT s.site_id FROM services s
        JOIN service_assignments sa ON sa.service_id = s.id
        WHERE sa.collaborator_id = public.current_collaborator_id()
    )
);

CREATE POLICY sites_client_read ON sites FOR SELECT USING (
    public.current_user_role() = 'client'
    AND client_id IN (
        SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true
    )
);

-- Site sub-tables: admin full, agents read assigned sites
CREATE POLICY site_periods_admin ON site_periods FOR ALL USING (public.is_admin());
CREATE POLICY site_periods_read ON site_periods FOR SELECT USING (
    site_id IN (SELECT id FROM sites) -- relies on sites RLS
);

CREATE POLICY site_closure_periods_admin ON site_closure_periods FOR ALL USING (public.is_admin());
CREATE POLICY site_closure_periods_read ON site_closure_periods FOR SELECT USING (
    site_id IN (SELECT id FROM sites)
);

CREATE POLICY site_prestations_admin ON site_prestations FOR ALL USING (public.is_admin());
CREATE POLICY site_prestations_read ON site_prestations FOR SELECT USING (
    site_id IN (SELECT id FROM sites)
);

CREATE POLICY site_collaborator_prefs_admin ON site_collaborator_prefs FOR ALL USING (public.is_admin());

CREATE POLICY site_instructions_admin ON site_instructions FOR ALL USING (public.is_admin());
CREATE POLICY site_instructions_read ON site_instructions FOR SELECT USING (
    site_id IN (SELECT id FROM sites)
);

CREATE POLICY site_keys_access_admin ON site_keys_access FOR ALL USING (public.is_admin());
CREATE POLICY site_keys_access_agent_read ON site_keys_access FOR SELECT USING (
    public.current_user_role() = 'agent'
    AND site_id IN (
        SELECT s.site_id FROM services s
        JOIN service_assignments sa ON sa.service_id = s.id
        WHERE sa.collaborator_id = public.current_collaborator_id()
    )
);

CREATE POLICY site_materials_admin ON site_materials FOR ALL USING (public.is_admin());
CREATE POLICY site_materials_read ON site_materials FOR SELECT USING (
    site_id IN (SELECT id FROM sites)
);

CREATE POLICY site_terrain_config_admin ON site_terrain_config FOR ALL USING (public.is_admin());
CREATE POLICY site_terrain_config_read ON site_terrain_config FOR SELECT USING (
    site_id IN (SELECT id FROM sites)
);

-- ============================================================
-- COLLABORATORS
-- ============================================================
CREATE POLICY collaborators_admin ON collaborators FOR ALL USING (public.is_admin());

CREATE POLICY collaborators_agent_read_own ON collaborators FOR SELECT USING (
    public.current_user_role() = 'agent' AND profile_id = auth.uid()
);

-- Collaborator sub-tables
CREATE POLICY collaborator_contracts_admin ON collaborator_contracts FOR ALL USING (public.is_admin());
CREATE POLICY collaborator_contracts_own_read ON collaborator_contracts FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY collaborator_materials_admin ON collaborator_materials FOR ALL USING (public.is_admin());
CREATE POLICY collaborator_materials_own_read ON collaborator_materials FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY collaborator_expirations_admin ON collaborator_expirations FOR ALL USING (public.is_admin());
CREATE POLICY collaborator_expirations_own_read ON collaborator_expirations FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY collaborator_restrictions_admin ON collaborator_restrictions FOR ALL USING (public.is_admin());
CREATE POLICY collaborator_restrictions_own_read ON collaborator_restrictions FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY salary_elements_admin ON salary_elements FOR ALL USING (public.is_admin());
CREATE POLICY salary_elements_own_read ON salary_elements FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

-- ============================================================
-- PLANNING (prestation_types, services, assignments, breaks, recurrences, tours, unavailabilities, replacements)
-- ============================================================
CREATE POLICY prestation_types_read ON prestation_types FOR SELECT USING (true);
CREATE POLICY prestation_types_admin ON prestation_types FOR ALL USING (public.is_admin());

CREATE POLICY services_admin ON services FOR ALL USING (public.is_admin());
CREATE POLICY services_agent_read ON services FOR SELECT USING (
    public.current_user_role() = 'agent'
    AND id IN (
        SELECT service_id FROM service_assignments
        WHERE collaborator_id = public.current_collaborator_id()
    )
);
CREATE POLICY services_client_read ON services FOR SELECT USING (
    public.current_user_role() = 'client'
    AND site_id IN (
        SELECT s.id FROM sites s
        JOIN client_accounts ca ON ca.client_id = s.client_id
        WHERE ca.profile_id = auth.uid() AND ca.is_active = true
    )
    AND is_published = true
);

CREATE POLICY service_assignments_admin ON service_assignments FOR ALL USING (public.is_admin());
CREATE POLICY service_assignments_agent_read ON service_assignments FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY service_breaks_admin ON service_breaks FOR ALL USING (public.is_admin());
CREATE POLICY service_breaks_read ON service_breaks FOR SELECT USING (
    service_id IN (SELECT id FROM services)
);

CREATE POLICY service_recurrences_admin ON service_recurrences FOR ALL USING (public.is_admin());
CREATE POLICY service_recurrences_read ON service_recurrences FOR SELECT USING (true);

CREATE POLICY tour_stops_admin ON tour_stops FOR ALL USING (public.is_admin());
CREATE POLICY tour_stops_read ON tour_stops FOR SELECT USING (
    service_id IN (SELECT id FROM services)
);

CREATE POLICY unavailabilities_admin ON unavailabilities FOR ALL USING (public.is_admin());
CREATE POLICY unavailabilities_own ON unavailabilities FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY unavailabilities_agent_insert ON unavailabilities FOR INSERT WITH CHECK (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY replacements_admin ON replacements FOR ALL USING (public.is_admin());
CREATE POLICY replacements_own_read ON replacements FOR SELECT USING (
    original_collaborator_id = public.current_collaborator_id()
    OR replacement_collaborator_id = public.current_collaborator_id()
);

-- ============================================================
-- TERRAIN (sessions, breaks, interruptions, gps, mce, forms, alerts)
-- ============================================================
CREATE POLICY service_sessions_admin ON service_sessions FOR ALL USING (public.is_admin());
CREATE POLICY service_sessions_agent_read ON service_sessions FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY service_sessions_agent_insert ON service_sessions FOR INSERT WITH CHECK (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY service_sessions_agent_update ON service_sessions FOR UPDATE USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY session_breaks_admin ON session_breaks FOR ALL USING (public.is_admin());
CREATE POLICY session_breaks_agent_insert ON session_breaks FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM service_sessions WHERE collaborator_id = public.current_collaborator_id())
);
CREATE POLICY session_breaks_agent_read ON session_breaks FOR SELECT USING (
    session_id IN (SELECT id FROM service_sessions WHERE collaborator_id = public.current_collaborator_id())
);

CREATE POLICY session_interruptions_admin ON session_interruptions FOR ALL USING (public.is_admin());
CREATE POLICY session_interruptions_agent_insert ON session_interruptions FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM service_sessions WHERE collaborator_id = public.current_collaborator_id())
);
CREATE POLICY session_interruptions_agent_read ON session_interruptions FOR SELECT USING (
    session_id IN (SELECT id FROM service_sessions WHERE collaborator_id = public.current_collaborator_id())
);

CREATE POLICY gps_logs_admin ON gps_logs FOR ALL USING (public.is_admin());
CREATE POLICY gps_logs_agent_insert ON gps_logs FOR INSERT WITH CHECK (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY gps_logs_agent_read ON gps_logs FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY mce_admin ON main_courante_events FOR ALL USING (public.is_admin());
CREATE POLICY mce_agent_insert ON main_courante_events FOR INSERT WITH CHECK (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY mce_agent_read ON main_courante_events FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY mce_client_read ON main_courante_events FOR SELECT USING (
    public.current_user_role() = 'client'
    AND is_visible_client = true
    AND service_id IN (
        SELECT s.id FROM services s
        JOIN sites st ON st.id = s.site_id
        JOIN client_accounts ca ON ca.client_id = st.client_id
        WHERE ca.profile_id = auth.uid() AND ca.is_active = true
    )
);

CREATE POLICY intervention_forms_admin ON intervention_forms FOR ALL USING (public.is_admin());
CREATE POLICY intervention_forms_agent_insert ON intervention_forms FOR INSERT WITH CHECK (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY intervention_forms_agent_read ON intervention_forms FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY intervention_forms_agent_update ON intervention_forms FOR UPDATE USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY perimeter_alerts_admin ON perimeter_alerts FOR ALL USING (public.is_admin());
CREATE POLICY perimeter_alerts_agent_read ON perimeter_alerts FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY notifications_own_read ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_own_update ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY notifications_admin_insert ON notifications FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY notifications_system_insert ON notifications FOR INSERT WITH CHECK (true);

CREATE POLICY push_subscriptions_own ON push_subscriptions FOR ALL USING (user_id = auth.uid());
CREATE POLICY push_subscriptions_admin_read ON push_subscriptions FOR SELECT USING (public.is_admin());

CREATE POLICY email_logs_admin ON email_logs FOR ALL USING (public.is_admin());

-- ============================================================
-- STOCKS
-- ============================================================
CREATE POLICY stock_references_read ON stock_references FOR SELECT USING (true);
CREATE POLICY stock_references_admin ON stock_references FOR ALL USING (public.is_admin());

CREATE POLICY stock_actions_admin ON stock_actions FOR ALL USING (public.is_admin());
CREATE POLICY stock_actions_agent_read ON stock_actions FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY site_stock_assignments_admin ON site_stock_assignments FOR ALL USING (public.is_admin());
CREATE POLICY site_stock_assignments_read ON site_stock_assignments FOR SELECT USING (
    site_id IN (SELECT id FROM sites)
);

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE POLICY documents_admin ON documents FOR ALL USING (public.is_admin());
CREATE POLICY documents_own_read ON documents FOR SELECT USING (uploaded_by = auth.uid());
CREATE POLICY documents_agent_read ON documents FOR SELECT USING (
    public.current_user_role() = 'agent'
    AND (
        (entity_type = 'agency')
        OR (entity_type = 'collaborator' AND entity_id = public.current_collaborator_id())
    )
);
CREATE POLICY documents_client_read ON documents FOR SELECT USING (
    public.current_user_role() = 'client'
    AND entity_type = 'client'
    AND entity_id IN (
        SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true
    )
);

-- ============================================================
-- MESSAGING
-- ============================================================
CREATE POLICY messages_own ON messages FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY messages_insert ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY messages_update_read ON messages FOR UPDATE USING (recipient_id = auth.uid());
CREATE POLICY messages_admin ON messages FOR ALL USING (public.is_admin());

CREATE POLICY instruction_acks_admin ON instruction_acknowledgments FOR ALL USING (public.is_admin());
CREATE POLICY instruction_acks_agent_insert ON instruction_acknowledgments FOR INSERT WITH CHECK (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY instruction_acks_agent_read ON instruction_acknowledgments FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

-- ============================================================
-- BILLING / PENNYLANE
-- ============================================================
CREATE POLICY contract_templates_read ON contract_templates FOR SELECT USING (true);
CREATE POLICY contract_templates_admin ON contract_templates FOR ALL USING (public.is_admin());

CREATE POLICY quotes_admin ON quotes FOR ALL USING (public.is_admin());
CREATE POLICY quotes_client_read ON quotes FOR SELECT USING (
    client_id IN (SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true)
);

CREATE POLICY invoices_admin ON invoices FOR ALL USING (public.is_admin());
CREATE POLICY invoices_client_read ON invoices FOR SELECT USING (
    client_id IN (SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true)
);

CREATE POLICY monthly_closures_admin ON monthly_closures FOR ALL USING (public.is_admin());
CREATE POLICY monthly_closures_read ON monthly_closures FOR SELECT USING (public.is_admin());

CREATE POLICY closure_lines_admin ON closure_lines FOR ALL USING (public.is_admin());

CREATE POLICY leave_balances_admin ON leave_balances FOR ALL USING (public.is_admin());
CREATE POLICY leave_balances_own_read ON leave_balances FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE POLICY announcements_admin ON announcements FOR ALL USING (public.is_admin());
CREATE POLICY announcements_read ON announcements FOR SELECT USING (
    status = 'active'
    AND (
        target_type = 'all'
        OR public.is_admin()
    )
);

CREATE POLICY announcement_responses_admin ON announcement_responses FOR ALL USING (public.is_admin());
CREATE POLICY announcement_responses_agent_insert ON announcement_responses FOR INSERT WITH CHECK (
    collaborator_id = public.current_collaborator_id()
);
CREATE POLICY announcement_responses_agent_read ON announcement_responses FOR SELECT USING (
    collaborator_id = public.current_collaborator_id()
);

CREATE POLICY client_requests_admin ON client_requests FOR ALL USING (public.is_admin());
CREATE POLICY client_requests_client_insert ON client_requests FOR INSERT WITH CHECK (
    client_id IN (SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true)
);
CREATE POLICY client_requests_client_read ON client_requests FOR SELECT USING (
    client_id IN (SELECT client_id FROM client_accounts WHERE profile_id = auth.uid() AND is_active = true)
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE POLICY audit_logs_admin ON audit_logs FOR ALL USING (public.is_super_admin());
CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT WITH CHECK (true);
