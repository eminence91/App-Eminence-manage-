-- 004_sites.sql
-- Sites and all related sub-tables

-- Enum for collaborator site preferences
CREATE TYPE site_collaborator_preference AS ENUM ('favorite', 'forbidden');

-- Sites
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    photo_url TEXT,
    country TEXT NOT NULL DEFAULT 'France',
    postal_code TEXT,
    city TEXT,
    address TEXT,
    complement TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    perimeter_radius INT NOT NULL DEFAULT 200,
    emergency_number TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sites_client_id ON sites(client_id);
CREATE INDEX idx_sites_is_active ON sites(is_active);
CREATE INDEX idx_sites_city ON sites(city);

CREATE TRIGGER trg_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Site periods (recurring opening hours)
CREATE TABLE site_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_site_periods_site_id ON site_periods(site_id);

-- Site closure periods
CREATE TABLE site_closure_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    label TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT
);

CREATE INDEX idx_site_closure_periods_site_id ON site_closure_periods(site_id);
CREATE INDEX idx_site_closure_periods_dates ON site_closure_periods(start_date, end_date);

-- Site prestations (service rates per site)
CREATE TABLE site_prestations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    prestation_type_id UUID NOT NULL,
    hourly_rate DECIMAL(10, 2),
    tour_rate DECIMAL(10, 2)
);

CREATE INDEX idx_site_prestations_site_id ON site_prestations(site_id);

-- Site collaborator preferences
CREATE TABLE site_collaborator_prefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    collaborator_id UUID NOT NULL,
    preference site_collaborator_preference NOT NULL
);

CREATE INDEX idx_site_collaborator_prefs_site_id ON site_collaborator_prefs(site_id);
CREATE INDEX idx_site_collaborator_prefs_collaborator_id ON site_collaborator_prefs(collaborator_id);

-- Site instructions
CREATE TABLE site_instructions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    attachments JSONB DEFAULT '[]',
    is_urgent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_instructions_site_id ON site_instructions(site_id);

-- Site keys and access codes
CREATE TABLE site_keys_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT,
    notes TEXT
);

CREATE INDEX idx_site_keys_access_site_id ON site_keys_access(site_id);

-- Site materials
CREATE TABLE site_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    quantity INT NOT NULL DEFAULT 0,
    visible_to_agent BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_site_materials_site_id ON site_materials(site_id);

-- Site terrain configuration
CREATE TABLE site_terrain_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL UNIQUE REFERENCES sites(id) ON DELETE CASCADE,
    mce_enabled BOOLEAN NOT NULL DEFAULT true,
    intervention_config JSONB DEFAULT '{}',
    perimeter_alert_enabled BOOLEAN NOT NULL DEFAULT true
);
