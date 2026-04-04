-- 007_terrain.sql
-- Service sessions, breaks, interruptions, GPS, main courante, intervention forms, perimeter alerts

-- Enums
CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'interrupted');
CREATE TYPE intervention_form_status AS ENUM ('draft', 'completed', 'sent');

-- Service sessions (clock in/out records)
CREATE TABLE service_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    clock_in_at TIMESTAMPTZ,
    clock_in_lat DECIMAL(10, 7),
    clock_in_lng DECIMAL(10, 7),
    clock_in_photo_url TEXT,
    clock_in_in_perimeter BOOLEAN,
    clock_out_at TIMESTAMPTZ,
    clock_out_lat DECIMAL(10, 7),
    clock_out_lng DECIMAL(10, 7),
    clock_out_photo_url TEXT,
    actual_duration_minutes INT,
    status session_status NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_sessions_service_id ON service_sessions(service_id);
CREATE INDEX idx_service_sessions_collaborator_id ON service_sessions(collaborator_id);
CREATE INDEX idx_service_sessions_status ON service_sessions(status);
CREATE INDEX idx_service_sessions_clock_in_at ON service_sessions(clock_in_at);

-- Session breaks
CREATE TABLE session_breaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES service_sessions(id) ON DELETE CASCADE,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    duration_minutes INT
);

CREATE INDEX idx_session_breaks_session_id ON session_breaks(session_id);

-- Session interruptions
CREATE TABLE session_interruptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES service_sessions(id) ON DELETE CASCADE,
    interrupted_at TIMESTAMPTZ NOT NULL,
    resumed_at TIMESTAMPTZ,
    reason TEXT
);

CREATE INDEX idx_session_interruptions_session_id ON session_interruptions(session_id);

-- GPS logs
CREATE TABLE gps_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    address TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_within_perimeter BOOLEAN
);

CREATE INDEX idx_gps_logs_collaborator_id ON gps_logs(collaborator_id);
CREATE INDEX idx_gps_logs_service_id ON gps_logs(service_id);
CREATE INDEX idx_gps_logs_timestamp ON gps_logs(timestamp);

-- Main courante events
CREATE TABLE main_courante_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES service_sessions(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    address TEXT,
    description TEXT,
    photo_url TEXT,
    metadata JSONB DEFAULT '{}',
    is_visible_client BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mce_service_id ON main_courante_events(service_id);
CREATE INDEX idx_mce_collaborator_id ON main_courante_events(collaborator_id);
CREATE INDEX idx_mce_session_id ON main_courante_events(session_id);
CREATE INDEX idx_mce_timestamp ON main_courante_events(timestamp);
CREATE INDEX idx_mce_event_type ON main_courante_events(event_type);

-- Intervention forms
CREATE TABLE intervention_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    form_data JSONB NOT NULL DEFAULT '{}',
    agent_signature_url TEXT,
    client_signature_url TEXT,
    status intervention_form_status NOT NULL DEFAULT 'draft',
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_intervention_forms_service_id ON intervention_forms(service_id);
CREATE INDEX idx_intervention_forms_collaborator_id ON intervention_forms(collaborator_id);
CREATE INDEX idx_intervention_forms_status ON intervention_forms(status);

-- Perimeter alerts
CREATE TABLE perimeter_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    distance_meters INT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    acknowledged BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_perimeter_alerts_collaborator_id ON perimeter_alerts(collaborator_id);
CREATE INDEX idx_perimeter_alerts_service_id ON perimeter_alerts(service_id);
CREATE INDEX idx_perimeter_alerts_timestamp ON perimeter_alerts(timestamp);
