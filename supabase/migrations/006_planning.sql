-- 006_planning.sql
-- Prestation types, services, assignments, breaks, recurrences, tours, unavailabilities, replacements

-- Enums
CREATE TYPE frequency_type AS ENUM ('once', 'daily', 'weekly', 'monthly', 'yearly');
CREATE TYPE billing_mode AS ENUM ('hourly', 'flat', 'service');
CREATE TYPE recurrence_pattern AS ENUM ('daily', 'weekly', 'monthly', 'holidays_only');
CREATE TYPE unavailability_status AS ENUM ('pending', 'approved', 'rejected');

-- Prestation types
CREATE TABLE prestation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    operations JSONB DEFAULT '[]',
    frequency frequency_type NOT NULL DEFAULT 'once',
    billing_mode_default billing_mode NOT NULL DEFAULT 'hourly',
    positions_required INT NOT NULL DEFAULT 1,
    estimated_duration_auto BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prestation_types_is_active ON prestation_types(is_active);

-- Add FK on site_prestations now that prestation_types exists
ALTER TABLE site_prestations
    ADD CONSTRAINT fk_site_prestations_prestation_type
    FOREIGN KEY (prestation_type_id) REFERENCES prestation_types(id) ON DELETE CASCADE;

-- Services (planned work slots)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    prestation_id UUID REFERENCES prestation_types(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_tour BOOLEAN NOT NULL DEFAULT false,
    billing_mode billing_mode NOT NULL DEFAULT 'hourly',
    positions_required INT NOT NULL DEFAULT 1,
    is_draft BOOLEAN NOT NULL DEFAULT true,
    is_published BOOLEAN NOT NULL DEFAULT false,
    recurrence_group_id UUID,
    instructions TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_site_id ON services(site_id);
CREATE INDEX idx_services_prestation_id ON services(prestation_id);
CREATE INDEX idx_services_date ON services(date);
CREATE INDEX idx_services_is_draft ON services(is_draft);
CREATE INDEX idx_services_is_published ON services(is_published);
CREATE INDEX idx_services_recurrence_group_id ON services(recurrence_group_id);

CREATE TRIGGER trg_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Service assignments
CREATE TABLE service_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    position_title TEXT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(service_id, collaborator_id)
);

CREATE INDEX idx_service_assignments_service_id ON service_assignments(service_id);
CREATE INDEX idx_service_assignments_collaborator_id ON service_assignments(collaborator_id);

-- Service breaks
CREATE TABLE service_breaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT,
    deducts_work_time BOOLEAN NOT NULL DEFAULT true,
    deducts_billing BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_service_breaks_service_id ON service_breaks(service_id);

-- Service recurrences
CREATE TABLE service_recurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    pattern recurrence_pattern NOT NULL,
    days_of_week INT[],
    days_of_month INT[],
    start_date DATE NOT NULL,
    end_date DATE,
    exclude_holidays BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_recurrences_group_id ON service_recurrences(group_id);

-- Tour stops
CREATE TABLE tour_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    start_time TIME,
    end_time TIME
);

CREATE INDEX idx_tour_stops_service_id ON tour_stops(service_id);

-- Unavailabilities (leave requests)
CREATE TABLE unavailabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    type_id UUID NOT NULL REFERENCES unavailability_types(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status unavailability_status NOT NULL DEFAULT 'pending',
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    admin_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_unavailabilities_collaborator_id ON unavailabilities(collaborator_id);
CREATE INDEX idx_unavailabilities_status ON unavailabilities(status);
CREATE INDEX idx_unavailabilities_dates ON unavailabilities(start_date, end_date);

-- Replacements
CREATE TABLE replacements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    replacement_collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_replacements_service_id ON replacements(service_id);
CREATE INDEX idx_replacements_original ON replacements(original_collaborator_id);
CREATE INDEX idx_replacements_replacement ON replacements(replacement_collaborator_id);
