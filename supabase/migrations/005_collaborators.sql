-- 005_collaborators.sql
-- Collaborators, contracts, materials, expirations, restrictions, salary elements

-- Enums
CREATE TYPE collaborator_type AS ENUM ('employee', 'emergency', 'provider', 'freelance', 'candidate', 'interim');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE collaborator_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE collaborator_contract_type AS ENUM ('cdi', 'cdd', 'apprenticeship', 'pro', 'interim');
CREATE TYPE collaborator_contract_status AS ENUM ('draft', 'sent', 'signed', 'active', 'terminated');
CREATE TYPE restriction_type AS ENUM ('no_night', 'no_day', 'unavailable');
CREATE TYPE salary_element_type AS ENUM ('advance', 'bonus', 'expense', 'mileage', 'transport');
CREATE TYPE salary_element_status AS ENUM ('pending', 'validated');

-- Collaborators
CREATE TABLE collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    type collaborator_type NOT NULL DEFAULT 'employee',
    photo_url TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    country TEXT DEFAULT 'France',
    birth_date DATE,
    birth_city TEXT,
    nationality TEXT,
    social_security_number TEXT,
    gender gender_type,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    status collaborator_status NOT NULL DEFAULT 'active',
    internal_comments TEXT,
    matricule TEXT UNIQUE,
    seniority_date DATE,
    has_license BOOLEAN NOT NULL DEFAULT false,
    license_start DATE,
    license_end DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_collaborators_profile_id ON collaborators(profile_id);
CREATE INDEX idx_collaborators_type ON collaborators(type);
CREATE INDEX idx_collaborators_status ON collaborators(status);
CREATE INDEX idx_collaborators_matricule ON collaborators(matricule);
CREATE INDEX idx_collaborators_last_name ON collaborators(last_name);

CREATE TRIGGER trg_collaborators_updated_at
    BEFORE UPDATE ON collaborators
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Add FK from site_collaborator_prefs to collaborators now that the table exists
ALTER TABLE site_collaborator_prefs
    ADD CONSTRAINT fk_site_collaborator_prefs_collaborator
    FOREIGN KEY (collaborator_id) REFERENCES collaborators(id) ON DELETE CASCADE;

-- Collaborator contracts
CREATE TABLE collaborator_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    type collaborator_contract_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    weekly_hours DECIMAL(5, 2),
    hourly_rate_gross DECIMAL(10, 2),
    mutual_exempted BOOLEAN NOT NULL DEFAULT false,
    overtime_rates JSONB DEFAULT '{}',
    specific_leave_hours JSONB DEFAULT '{}',
    template_id UUID,
    content TEXT,
    status collaborator_contract_status NOT NULL DEFAULT 'draft',
    signed_at TIMESTAMPTZ
);

CREATE INDEX idx_collaborator_contracts_collaborator_id ON collaborator_contracts(collaborator_id);
CREATE INDEX idx_collaborator_contracts_status ON collaborator_contracts(status);

-- Collaborator materials (equipment lent)
CREATE TABLE collaborator_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    reference TEXT,
    description TEXT,
    size TEXT,
    quantity INT NOT NULL DEFAULT 1,
    lent_at DATE,
    return_due_at DATE,
    returned_at DATE
);

CREATE INDEX idx_collaborator_materials_collaborator_id ON collaborator_materials(collaborator_id);

-- Collaborator expirations (documents, certifications, etc.)
CREATE TABLE collaborator_expirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    type TEXT,
    label TEXT NOT NULL,
    expires_at DATE NOT NULL,
    document_url TEXT,
    alert_90 BOOLEAN NOT NULL DEFAULT false,
    alert_60 BOOLEAN NOT NULL DEFAULT false,
    alert_30 BOOLEAN NOT NULL DEFAULT false,
    alert_0 BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_collaborator_expirations_collaborator_id ON collaborator_expirations(collaborator_id);
CREATE INDEX idx_collaborator_expirations_expires_at ON collaborator_expirations(expires_at);

-- Collaborator restrictions
CREATE TABLE collaborator_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    day_of_week INT CHECK (day_of_week IS NULL OR day_of_week BETWEEN 0 AND 6),
    restriction_type restriction_type NOT NULL,
    notes TEXT
);

CREATE INDEX idx_collaborator_restrictions_collaborator_id ON collaborator_restrictions(collaborator_id);

-- Salary elements
CREATE TABLE salary_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    type salary_element_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    month DATE NOT NULL,
    description TEXT,
    status salary_element_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_salary_elements_collaborator_id ON salary_elements(collaborator_id);
CREATE INDEX idx_salary_elements_month ON salary_elements(month);
CREATE INDEX idx_salary_elements_status ON salary_elements(status);
