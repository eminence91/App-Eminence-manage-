-- 012_billing_pennylane.sql
-- Contract templates, quotes, invoices, monthly closures, leave balances

-- Enums
CREATE TYPE contract_target AS ENUM ('collaborator', 'client');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'refused');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue');
CREATE TYPE closure_status AS ENUM ('open', 'validated', 'sent');

-- Contract templates
CREATE TABLE contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT,
    target contract_target NOT NULL,
    content_html TEXT,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contract_templates_target ON contract_templates(target);
CREATE INDEX idx_contract_templates_is_active ON contract_templates(is_active);

-- Add FK on client_contracts.template_id now that contract_templates exists
ALTER TABLE client_contracts
    ADD CONSTRAINT fk_client_contracts_template
    FOREIGN KEY (template_id) REFERENCES contract_templates(id) ON DELETE SET NULL;

-- Add FK on collaborator_contracts.template_id
ALTER TABLE collaborator_contracts
    ADD CONSTRAINT fk_collaborator_contracts_template
    FOREIGN KEY (template_id) REFERENCES contract_templates(id) ON DELETE SET NULL;

-- Quotes
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    reference TEXT,
    lines JSONB NOT NULL DEFAULT '[]',
    total_ht DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_ttc DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status quote_status NOT NULL DEFAULT 'draft',
    valid_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(status);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    reference TEXT,
    pennylane_id TEXT,
    lines JSONB NOT NULL DEFAULT '[]',
    total_ht DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_ttc DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status invoice_status NOT NULL DEFAULT 'draft',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Monthly closures
CREATE TABLE monthly_closures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    status closure_status NOT NULL DEFAULT 'open',
    validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    validated_at TIMESTAMPTZ,
    sent_to_pennylane_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(year, month)
);

-- Closure lines (detail per client/site/collaborator)
CREATE TABLE closure_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    closure_id UUID NOT NULL REFERENCES monthly_closures(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    collaborator_id UUID REFERENCES collaborators(id) ON DELETE SET NULL,
    planned_hours DECIMAL(8, 2) NOT NULL DEFAULT 0,
    actual_hours DECIMAL(8, 2) NOT NULL DEFAULT 0,
    adjusted_hours DECIMAL(8, 2) NOT NULL DEFAULT 0,
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_ht DECIMAL(12, 2) NOT NULL DEFAULT 0,
    is_validated BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_closure_lines_closure_id ON closure_lines(closure_id);
CREATE INDEX idx_closure_lines_client_id ON closure_lines(client_id);
CREATE INDEX idx_closure_lines_site_id ON closure_lines(site_id);

-- Leave balances
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    year INT NOT NULL,
    acquired_days DECIMAL(5, 2) NOT NULL DEFAULT 0,
    taken_days DECIMAL(5, 2) NOT NULL DEFAULT 0,
    UNIQUE(collaborator_id, year)
);

CREATE INDEX idx_leave_balances_collaborator_id ON leave_balances(collaborator_id);
