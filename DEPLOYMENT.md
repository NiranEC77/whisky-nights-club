# Deployment Guide - Whisky Nights Club

This guide will walk you through deploying the Whisky Nights Club application to production.

## Prerequisites

Before deploying, ensure you have:

- ✅ A GitHub account
- ✅ A Supabase account ([supabase.com](https://supabase.com))
- ✅ A Vercel account ([vercel.com](https://vercel.com))
- ✅ Your Zelle payment email/phone for accepting payments

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Project name: `whisky-nights-club`
   - Database password: (generate a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"
5. Wait for the project to be created (~2 minutes)

### 1.2 Run Database Migrations

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned"

### 1.3 Get Your API Keys

1. Go to "Project Settings" > "API"
2. Copy these values (you'll need them later):
   - Project URL: `https://xxxxx.supabase.co`
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

### 1.4 Create Your Admin User

1. Go to "Authentication" in the sidebar
2. Click "Add user" > "Create new user"
3. Enter your email and a strong password
4. Click "Create user"
5. Go back to "SQL Editor"
6. Run this query (replace with your email):

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Step 2: Push to GitHub

### 2.1 Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon > "New repository"
3. Name it: `whisky-nights-club`
4. Choose "Private" or "Public"
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2.2 Push Your Code

```bash
# Navigate to your project directory
cd whisky_club

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Whisky Nights Club"

# Add your GitHub repo as remote (replace with your URL)
git remote add origin https://github.com/YOUR-USERNAME/whisky-nights-club.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.3 Set Up GitHub Secrets (for CI/CD)

1. Go to your GitHub repository
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add these secrets one by one:

| Secret Name | Value |
|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `TEST_ADMIN_EMAIL` | Your admin email (for tests) |
| `TEST_ADMIN_PASSWORD` | Your admin password (for tests) |

## Step 3: Deploy to Vercel

### 3.1 Import Your Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." > "Project"
3. Click "Import" next to your GitHub repository
4. If you don't see it, click "Adjust GitHub App Permissions"

### 3.2 Configure Your Project

1. **Project Name**: `whisky-nights-club` (or your preference)
2. **Framework Preset**: Next.js (should be auto-detected)
3. **Root Directory**: `./` (leave as is)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `.next` (default)

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_ZELLE_EMAIL` | Your Zelle payment email |
| `NEXT_PUBLIC_ZELLE_PHONE` | Your Zelle phone (optional) |
| `NEXT_PUBLIC_SITE_URL` | Leave blank for now |

### 3.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Once deployed, you'll see a success screen with your URL

### 3.5 Update Site URL

1. Copy your production URL (e.g., `https://whisky-nights-club.vercel.app`)
2. Go back to "Settings" > "Environment Variables"
3. Edit `NEXT_PUBLIC_SITE_URL` and paste your URL
4. Click "Save"
5. Go to "Deployments" and click "Redeploy" on the latest deployment

## Step 4: Configure Supabase for Production

### 4.1 Add Vercel URL to Supabase

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "URL Configuration"
3. Add your Vercel URL to "Site URL": `https://your-app.vercel.app`
4. Add to "Redirect URLs":
   - `https://your-app.vercel.app/**`
   - `https://*.vercel.app/**` (for preview deployments)
5. Click "Save"

### 4.2 Update Email Templates (Optional)

1. Go to "Authentication" > "Email Templates"
2. Customize the email templates with your branding
3. Update the URLs to point to your production domain

## Step 5: Test Your Deployment

### 5.1 Basic Tests

1. Visit your production URL
2. Check that the homepage loads
3. Try viewing an event (create one first as admin)
4. Test registration flow
5. Verify payment instructions display correctly

### 5.2 Admin Tests

1. Go to `/login` on your production site
2. Sign in with your admin credentials
3. Create a test event
4. Verify the event appears on the homepage
5. Create a test registration
6. Mark it as paid
7. Check that stats update correctly

### 5.3 Check CI/CD

1. Make a small change to your code (e.g., update README)
2. Push to GitHub
3. Check "Actions" tab in GitHub - workflow should run
4. Vercel should automatically deploy the change

## Step 6: Set Up Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. In Vercel, go to your project settings
2. Click "Domains"
3. Enter your domain (e.g., `whiskyclub.com`)
4. Follow the instructions to add DNS records

### 6.2 Update Environment Variables

1. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
2. Redeploy the application

### 6.3 Update Supabase

1. Go to Supabase "Authentication" > "URL Configuration"
2. Update "Site URL" to your custom domain
3. Add custom domain to "Redirect URLs"

## Step 7: Ongoing Maintenance

### Monitoring

- **Vercel Analytics**: Enable in project settings for traffic insights
- **Supabase Logs**: Monitor in Database > Logs
- **GitHub Actions**: Check workflow runs for test results

### Updates

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy your changes.

### Backups

- Supabase automatically backs up your database
- Export registrations regularly via admin dashboard (future feature)
- Keep your environment variables documented securely

## Troubleshooting

### Issue: "API key not found"

**Solution**: 
- Check that environment variables are set correctly in Vercel
- Ensure no trailing spaces in the keys
- Redeploy after adding variables

### Issue: "Not authorized" errors

**Solution**:
- Verify RLS policies are set up correctly in Supabase
- Check that your user has admin role in profiles table
- Clear browser cache and cookies

### Issue: Redirect URL mismatch

**Solution**:
- Ensure your Vercel URL is added to Supabase redirect URLs
- Add wildcard `*.vercel.app` for preview deployments
- Check that Site URL matches exactly

### Issue: Build fails in Vercel

**Solution**:
- Check build logs in Vercel
- Run `npm run build` locally to reproduce
- Verify all dependencies are in package.json
- Check TypeScript errors: `npx tsc --noEmit`

## Security Checklist

Before going live, verify:

- ✅ Service role key is kept secret (only in environment variables)
- ✅ RLS policies are enabled on all tables
- ✅ Admin routes check for admin role
- ✅ Supabase redirect URLs are properly configured
- ✅ GitHub secrets are set (not in code)
- ✅ Database password is strong and secure
- ✅ Email templates don't expose sensitive information

## Performance Optimization

For better performance:

1. **Enable Edge Functions** in Vercel
2. **Set up Caching** for static assets
3. **Add Image Optimization** for event images
4. **Enable Compression** in Vercel settings
5. **Monitor Core Web Vitals** in Vercel Analytics

## Support

If you run into issues:

1. Check the [README.md](./README.md) troubleshooting section
2. Review Vercel deployment logs
3. Check Supabase logs for database errors
4. Review GitHub Actions output for CI/CD issues
5. Reach out to support channels for help

---

## Quick Reference

### URLs

- **Production**: `https://your-app.vercel.app`
- **Admin Login**: `https://your-app.vercel.app/login`
- **Supabase**: `https://app.supabase.com/project/your-project-id`
- **Vercel**: `https://vercel.com/your-username/whisky-nights-club`

### Common Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Run tests
npm run test

# Deploy (push to GitHub)
git push origin main
```

---

Congratulations! 🥃 Your Whisky Nights Club is now live!

