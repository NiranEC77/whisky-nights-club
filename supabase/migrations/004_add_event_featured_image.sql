-- Add featured_image column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

COMMENT ON COLUMN events.featured_image IS 'URL or path to featured image for the event';

