# ⚠️ IMPORTANT: Run This SQL in Supabase

## The Error You're Seeing

```
Could not find the 'featured_image' column of 'events' in the schema cache
```

This means the database doesn't have the `featured_image` column yet!

## How to Fix (2 minutes)

### Step 1: Copy This SQL

```sql
-- Add featured_image column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

COMMENT ON COLUMN events.featured_image IS 'URL or path to featured image for the event';
```

### Step 2: Run It in Supabase

1. Go to **https://supabase.com/dashboard**
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **"New query"**
5. **Paste the SQL above**
6. Click **"Run"** (or press Cmd/Ctrl + Enter)

### Step 3: Verify It Worked

You should see:
```
Success. No rows returned
```

### Step 4: Test Your App

1. Go back to your site
2. Try creating an event
3. Should work now! ✅

## Alternative: Run All Migrations

If you want to run all migrations at once:

```sql
-- Migration 004: Add featured_image column
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

COMMENT ON COLUMN events.featured_image IS 'URL or path to featured image for the event';

-- Verify it was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' 
AND column_name = 'featured_image';
```

The last SELECT should return:
```
column_name      | data_type
featured_image   | text
```

## Why This Happened

The migration file (`004_add_event_featured_image.sql`) was created in your code, but Supabase doesn't automatically run local migration files. You need to manually execute them in the SQL Editor.

## Once Fixed

After running the SQL:
- ✅ Events can be created with images
- ✅ Events can be updated with images
- ✅ No more "column not found" errors
- ✅ Form submission will work

Run the SQL now and let me know if it works!

