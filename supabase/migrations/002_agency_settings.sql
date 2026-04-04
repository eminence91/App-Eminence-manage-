-- 002_agency_settings.sql
-- Agency configuration singleton and related lookup tables

-- Enums
CREATE TYPE overtime_smoothing_mode AS ENUM ('month', 'quarter', 'semester', 'year', 'disabled');
CREATE TYPE leave_count_mode AS ENUM ('working_days', 'business_days');
CREATE TYPE stock_mode AS ENUM ('simple', 'complete');
CREATE TYPE planning_view AS ENUM ('month', 'four_weeks', 'week', 'day');
CREATE TYPE request_category AS ENUM ('collaborator', 'client');
CREATE TYPE field_type AS ENUM ('text', 'checkbox', 'select', 'photo', 'signature');
CREATE TYPE document_entity_type AS ENUM ('agency', 'client', 'collaborator', 'site');

-- Agency settings singleton
CREATE TABLE agency_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    country TEXT DEFAULT 'France',
    siret TEXT,
    email TEXT,
    phone TEXT,
    emergency_phone_1 TEXT,
    emergency_phone_2 TEXT,
    night_hours_start TIME,
    night_hours_end TIME,
    timezone TEXT NOT NULL DEFAULT 'Europe/Paris',
    overtime_smoothing_mode overtime_smoothing_mode NOT NULL DEFAULT 'month',
    employee_prefix TEXT,
    client_prefix TEXT,
    leave_count_mode leave_count_mode NOT NULL DEFAULT 'working_days',
    stock_mode stock_mode NOT NULL DEFAULT 'simple',
    hourly_rate_day DECIMAL(10, 2),
    tour_rate DECIMAL(10, 2),
    deduct_breaks BOOLEAN NOT NULL DEFAULT false,
    default_planning_view planning_view NOT NULL DEFAULT 'month',
    planning_email_amplitude INT,
    perimeter_radius_default INT DEFAULT 200,
    pdf_header TEXT,
    pdf_footer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_agency_settings_updated_at
    BEFORE UPDATE ON agency_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Unavailability types
CREATE TABLE unavailability_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color TEXT,
    deducts_work_time BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Request types
CREATE TABLE request_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category request_category NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- MCE event types
CREATE TABLE mce_event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    visible_to_client BOOLEAN NOT NULL DEFAULT true,
    icon TEXT
);

-- Intervention form fields
CREATE TABLE intervention_form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    field_type field_type NOT NULL,
    options JSONB,
    sort_order INT NOT NULL DEFAULT 0,
    is_required BOOLEAN NOT NULL DEFAULT false
);

-- Document folders
CREATE TABLE document_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    entity_type document_entity_type NOT NULL
);

-- General instructions
CREATE TABLE general_instructions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    attachments JSONB DEFAULT '[]',
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default MCE event types
INSERT INTO mce_event_types (code, label, visible_to_client) VALUES
    ('prise_service', 'Prise de service', true),
    ('fin_service', 'Fin de service', true),
    ('retard', 'Retard', true),
    ('interruption', 'Interruption', true),
    ('reprise', 'Reprise', true),
    ('prolongation', 'Prolongation', true),
    ('pause_debut', 'Debut de pause', false),
    ('pause_fin', 'Fin de pause', false),
    ('appel_urgence', 'Appel d''urgence', true),
    ('sortie_perimetre', 'Sortie du perimetre', true),
    ('retour_perimetre', 'Retour dans le perimetre', true),
    ('incident', 'Incident', true),
    ('controle_stock', 'Controle de stock', false),
    ('photo', 'Photo', true);
