-- 009_stocks.sql
-- Stock references, actions, site assignments

-- Enums
CREATE TYPE stock_type AS ENUM ('uniform', 'badge', 'consumable', 'vehicle', 'other');
CREATE TYPE stock_action_type AS ENUM ('assign', 'return', 'revision', 'inspection');

-- Stock references
CREATE TABLE stock_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type stock_type NOT NULL DEFAULT 'other',
    quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2),
    low_stock_threshold INT,
    qr_code TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stock_references_type ON stock_references(type);
CREATE INDEX idx_stock_references_is_active ON stock_references(is_active);

-- Stock actions
CREATE TABLE stock_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_ref_id UUID NOT NULL REFERENCES stock_references(id) ON DELETE CASCADE,
    action_type stock_action_type NOT NULL,
    collaborator_id UUID REFERENCES collaborators(id) ON DELETE SET NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stock_actions_stock_ref_id ON stock_actions(stock_ref_id);
CREATE INDEX idx_stock_actions_collaborator_id ON stock_actions(collaborator_id);
CREATE INDEX idx_stock_actions_site_id ON stock_actions(site_id);
CREATE INDEX idx_stock_actions_action_type ON stock_actions(action_type);

-- Site stock assignments
CREATE TABLE site_stock_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    stock_ref_id UUID NOT NULL REFERENCES stock_references(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_site_stock_assignments_site_id ON site_stock_assignments(site_id);
CREATE INDEX idx_site_stock_assignments_stock_ref_id ON site_stock_assignments(stock_ref_id);
