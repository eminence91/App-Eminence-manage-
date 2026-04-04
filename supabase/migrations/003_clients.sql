-- 003_clients.sql
-- Clients, contacts, articles, contracts, accounts, expirations

-- Enums
CREATE TYPE client_type AS ENUM ('company', 'individual', 'association', 'public_org', 'prospect', 'subcontractor');
CREATE TYPE discount_type AS ENUM ('percent', 'amount');
CREATE TYPE client_contract_status AS ENUM ('draft', 'sent', 'signed', 'expired');

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type client_type NOT NULL DEFAULT 'company',
    name TEXT NOT NULL,
    logo_url TEXT,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    country TEXT DEFAULT 'France',
    siret TEXT,
    vat_number TEXT,
    email TEXT,
    phone TEXT,
    identifier_number TEXT UNIQUE,
    purchase_order_number TEXT,
    discount_type discount_type,
    discount_value DECIMAL(10, 2),
    internal_comments TEXT,
    factor_bank_details JSONB,
    pennylane_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_is_active ON clients(is_active);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_identifier_number ON clients(identifier_number);

CREATE TRIGGER trg_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Client contacts
CREATE TABLE client_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT,
    receives_mce BOOLEAN NOT NULL DEFAULT false,
    receives_invoices BOOLEAN NOT NULL DEFAULT false,
    receives_interventions BOOLEAN NOT NULL DEFAULT false,
    is_primary BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_client_contacts_client_id ON client_contacts(client_id);

-- Client articles
CREATE TABLE client_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit TEXT
);

CREATE INDEX idx_client_articles_client_id ON client_articles(client_id);

-- Client contracts
CREATE TABLE client_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_id UUID,
    content TEXT,
    status client_contract_status NOT NULL DEFAULT 'draft',
    signed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_contracts_client_id ON client_contracts(client_id);
CREATE INDEX idx_client_contracts_status ON client_contracts(status);

-- Client accounts (client portal access)
CREATE TABLE client_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_client_accounts_client_id ON client_accounts(client_id);
CREATE INDEX idx_client_accounts_profile_id ON client_accounts(profile_id);

-- Client expirations / alerts
CREATE TABLE client_expirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    expires_at DATE NOT NULL,
    alert_90 BOOLEAN NOT NULL DEFAULT false,
    alert_60 BOOLEAN NOT NULL DEFAULT false,
    alert_30 BOOLEAN NOT NULL DEFAULT false,
    alert_0 BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_client_expirations_client_id ON client_expirations(client_id);
CREATE INDEX idx_client_expirations_expires_at ON client_expirations(expires_at);
