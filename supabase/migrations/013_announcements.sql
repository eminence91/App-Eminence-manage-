-- 013_announcements.sql
-- Announcements, responses, client requests

-- Enums
CREATE TYPE announcement_status AS ENUM ('active', 'inactive');
CREATE TYPE announcement_target_type AS ENUM ('all', 'site', 'collaborator');
CREATE TYPE client_request_status AS ENUM ('pending', 'in_progress', 'resolved');

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status announcement_status NOT NULL DEFAULT 'active',
    target_type announcement_target_type NOT NULL DEFAULT 'all',
    target_ids JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_author_id ON announcements(author_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);

-- Announcement responses
CREATE TABLE announcement_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcement_responses_announcement_id ON announcement_responses(announcement_id);
CREATE INDEX idx_announcement_responses_collaborator_id ON announcement_responses(collaborator_id);

-- Client requests
CREATE TABLE client_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    type TEXT,
    subject TEXT NOT NULL,
    description TEXT,
    status client_request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_requests_client_id ON client_requests(client_id);
CREATE INDEX idx_client_requests_status ON client_requests(status);
