-- Update memberships table to track friend usage
ALTER TABLE memberships 
ADD COLUMN IF NOT EXISTS friend_used BOOLEAN DEFAULT FALSE;

-- Update comment on events_used field
COMMENT ON COLUMN memberships.events_used IS 'Number of free events used (0-1, only 1 free event per membership)';

-- Update registrations table to track if user brought a friend
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS brought_friend BOOLEAN DEFAULT FALSE;

-- Add payment_code field for test payments
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS payment_code TEXT;

-- Update payment_method check constraint to only allow stripe and paypal
ALTER TABLE registrations 
DROP CONSTRAINT IF EXISTS registrations_payment_method_check;

ALTER TABLE registrations 
ADD CONSTRAINT registrations_payment_method_check 
CHECK (payment_method IN ('stripe', 'paypal'));

-- Update memberships payment_method constraint
ALTER TABLE memberships
DROP CONSTRAINT IF EXISTS memberships_payment_method_check;

ALTER TABLE memberships
ADD CONSTRAINT memberships_payment_method_check
CHECK (payment_method IN ('stripe', 'paypal'));

-- Update events_used check to max 1 instead of 2
ALTER TABLE memberships
DROP CONSTRAINT IF EXISTS memberships_events_used_check;

ALTER TABLE memberships
ADD CONSTRAINT memberships_events_used_check
CHECK (events_used >= 0 AND events_used <= 1);
