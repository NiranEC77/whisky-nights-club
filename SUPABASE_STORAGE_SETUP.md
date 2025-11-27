# Supabase Storage Setup for Event Images

## Why Supabase Storage?

Vercel's serverless functions **cannot write to the file system**. All uploaded images need to be stored in Supabase Storage instead.

## Step-by-Step Setup

### 1. Go to Your Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar

### 2. Create a New Storage Bucket

1. Click **"New bucket"** button
2. Fill in the details:
   - **Name**: `event-images`
   - **Public bucket**: ✅ **Check this box** (images need to be publicly accessible)
   - **File size limit**: 5MB (optional)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp` (optional)

3. Click **"Create bucket"**

### 3. Set Bucket Policies (Important!)

By default, the bucket might have restrictions. We need to allow:
- **Public read** (so images display on your site)
- **Authenticated upload** (so admins can upload)

#### Option A: Make Bucket Fully Public (Easiest)

1. Go to **Storage** → **Policies**
2. Click on **event-images** bucket
3. Click **"New Policy"**
4. Choose **"Allow public read access"**
5. Click **"Review"** → **"Save policy"**

#### Option B: Custom Policy (More Control)

Go to **Storage** → **Policies** → **New Policy** and add:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'event-images' 
  AND auth.role() = 'authenticated'
);
```

### 4. Verify Environment Variables

Make sure your Vercel project has these environment variables set:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Verify these exist:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://YOUR_PROJECT.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`

3. If missing, add them from your Supabase Dashboard:
   - Go to **Project Settings** → **API**
   - Copy **Project URL** and **service_role key** (NOT anon key)

### 5. Redeploy on Vercel

After creating the bucket and setting policies:

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Deployments"**
3. Click **"..."** on the latest deployment
4. Click **"Redeploy"**

Or just push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Testing

### Test Upload

1. Go to your deployed site on Vercel
2. Login as admin
3. Go to **Create New Event**
4. Try uploading an image
5. Should work now! ✅

### Verify in Supabase

1. Go to **Supabase Dashboard** → **Storage** → **event-images**
2. You should see your uploaded images
3. Click on an image to see the public URL

## Troubleshooting

### Error: "Bucket not found"
- Make sure bucket is named exactly `event-images`
- Check it's in the correct project

### Error: "Access denied" or "Policy violation"
- Storage policies not set correctly
- Follow Step 3 again to set public read access

### Error: "Invalid API key"
- Check `SUPABASE_SERVICE_ROLE_KEY` in Vercel environment variables
- Make sure it's the service_role key, not anon key

### Images Upload But Don't Display
- Bucket needs to be **public**
- Check the "Public bucket" checkbox when creating bucket
- Or set the public read policy

## How It Works

1. **Admin uploads image** → Image sent to `/api/upload-event-image`
2. **API route receives image** → Uploads to Supabase Storage bucket
3. **Supabase returns public URL** → URL saved in database
4. **Image displays on site** → Loads directly from Supabase CDN

## Benefits of Supabase Storage

- ✅ **Works on Vercel** (serverless compatible)
- ✅ **Global CDN** (fast image loading worldwide)
- ✅ **Automatic optimization** (image transformation available)
- ✅ **Scalable** (unlimited storage with paid plans)
- ✅ **Secure** (built-in authentication)
- ✅ **Free tier** (1GB storage included)

## Next Steps

After setup:
1. Test creating an event with an image
2. Verify image displays on event card
3. Check Supabase Storage to see uploaded files
4. You're all set! 🎉

## Storage Limits (Free Tier)

- **Storage**: 1GB
- **Transfer**: 2GB/month
- **File size**: Up to 5MB per file

For more storage, upgrade to Supabase Pro plan.

