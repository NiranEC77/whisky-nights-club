-- Add payment method and membership fields to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'zelle' CHECK (payment_method IN ('venmo', 'paypal', 'zelle', 'googlepay'));

ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL;

ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS is_free_with_membership BOOLEAN DEFAULT FALSE;

-- Create index for membership lookups
CREATE INDEX IF NOT EXISTS idx_registrations_membership_id ON registrations(membership_id);

-- Update existing registrations to have default payment method
UPDATE registrations 
SET payment_method = 'zelle' 
WHERE payment_method IS NULL;
