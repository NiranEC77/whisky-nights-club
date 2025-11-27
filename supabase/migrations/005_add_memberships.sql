-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  events_used INTEGER NOT NULL DEFAULT 0 CHECK (events_used >= 0 AND events_used <= 2),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  payment_method TEXT CHECK (payment_method IN ('venmo', 'paypal', 'zelle', 'googlepay')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_memberships_email ON memberships(email);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(payment_status);
CREATE INDEX idx_memberships_dates ON memberships(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Memberships policies
CREATE POLICY "Memberships are viewable by owner"
  ON memberships FOR SELECT
  USING (
    auth.uid() = user_id OR
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Anyone can create a membership"
  ON memberships FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can update memberships"
  ON memberships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete memberships"
  ON memberships FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to check if membership is active
CREATE OR REPLACE FUNCTION is_membership_active(membership_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  membership_record RECORD;
BEGIN
  SELECT payment_status, end_date, events_used
  INTO membership_record
  FROM memberships
  WHERE id = membership_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  RETURN membership_record.payment_status = 'paid'
    AND membership_record.end_date >= CURRENT_DATE
    AND membership_record.events_used < 2;
END;
$$ LANGUAGE plpgsql;

-- Function to get active membership by email
CREATE OR REPLACE FUNCTION get_active_membership_by_email(user_email TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  start_date DATE,
  end_date DATE,
  events_used INTEGER,
  events_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.email,
    m.full_name,
    m.start_date,
    m.end_date,
    m.events_used,
    (2 - m.events_used) as events_remaining
  FROM memberships m
  WHERE m.email = user_email
    AND m.payment_status = 'paid'
    AND m.end_date >= CURRENT_DATE
    AND m.events_used < 2
  ORDER BY m.end_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
