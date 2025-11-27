-- Add ticket_count column to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS ticket_count INTEGER NOT NULL DEFAULT 1;

-- Update existing registrations to have ticket_count = 1
UPDATE registrations SET ticket_count = 1 WHERE ticket_count IS NULL;

-- Add constraint to ensure ticket_count is between 1 and 2
ALTER TABLE registrations
ADD CONSTRAINT ticket_count_range CHECK (ticket_count >= 1 AND ticket_count <= 2);

-- Add comment for documentation
COMMENT ON COLUMN registrations.ticket_count IS 'Number of tickets purchased (1-2)';

