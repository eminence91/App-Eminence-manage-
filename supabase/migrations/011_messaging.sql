-- 011_messaging.sql
-- Direct messages and instruction acknowledgments

-- Enum
CREATE TYPE instruction_type AS ENUM ('agency', 'site', 'service');

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Instruction acknowledgments
CREATE TABLE instruction_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instruction_type instruction_type NOT NULL,
    instruction_id UUID NOT NULL,
    collaborator_id UUID NOT NULL REFERENCES collaborators(id) ON DELETE CASCADE,
    acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_instruction_acks_instruction ON instruction_acknowledgments(instruction_type, instruction_id);
CREATE INDEX idx_instruction_acks_collaborator ON instruction_acknowledgments(collaborator_id);
