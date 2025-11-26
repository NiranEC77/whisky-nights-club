# 🥃 Whisky Nights Club - Quick Start

Get up and running in **5 minutes**!

## Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./scripts/setup.sh

# Edit your environment variables
nano .env.local

# Start the dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Option 2: Manual Setup

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Set Up Environment (2 min)

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Required values:
- `NEXT_PUBLIC_SUPABASE_URL` - from Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - from Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` - from Supabase project settings
- `NEXT_PUBLIC_ZELLE_EMAIL` - your Zelle payment email

### 3. Set Up Database (2 min)

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run `supabase/migrations/001_initial_schema.sql`
4. Verify tables created in Table Editor

### 4. Start Development

```bash
npm run dev
```

## Create Your First Admin User

1. Visit [http://localhost:3000/login](http://localhost:3000/login)
2. Sign up will redirect - that's OK! Check Supabase Auth
3. In Supabase SQL Editor, run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

4. Now login at `/login` - you'll see the admin dashboard!

## Create Your First Event

1. Login as admin
2. Click "Create Event"
3. Fill in the form:
   - Title: "Highland Single Malt Tasting"
   - Date: Future date
   - Time: "7:00 PM"
   - Price: 75
   - Max Seats: 20
   - Description: (optional)
4. Click "Create Event"
5. Visit homepage to see your event!

## Test Registration

1. Open homepage in incognito/private window
2. Click on your event
3. Click "Register Now"
4. Fill in the form
5. See Zelle payment instructions!

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npx tsc --noEmit       # Type check

# Testing
npm run test           # Run Playwright tests
npm run test:ui        # Run with UI
npm run test:headed    # Run in browser

# Utilities
./scripts/check-env.sh # Verify environment variables
```

## Troubleshooting

### "API key not found"
- Check `.env.local` exists
- Verify all values are set correctly
- Restart dev server

### "Not authorized"
- Check admin role in Supabase profiles table
- Clear browser cookies
- Try incognito/private window

### Database connection fails
- Verify Supabase URL and keys
- Check if RLS migration ran successfully
- Look for errors in Supabase logs

### Can't create events
- Verify you're logged in as admin
- Check profiles table has `role = 'admin'`
- Check browser console for errors

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- 🧪 Run tests with `npm run test`
- 🎨 Customize the theme in `tailwind.config.ts`
- 📧 Set up email notifications (future feature)

## File Structure Overview

```
whisky_club/
├── app/               # All pages
├── components/        # React components
├── lib/              # Server actions & utilities
├── supabase/         # Database migrations
├── tests/            # Playwright tests
└── scripts/          # Helper scripts
```

## Key Files to Know

- `app/page.tsx` - Homepage
- `app/admin/page.tsx` - Admin dashboard
- `lib/actions/events.ts` - Event CRUD operations
- `lib/actions/registrations.ts` - Registration operations
- `supabase/migrations/001_initial_schema.sql` - Database schema

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (keep secret!) |
| `NEXT_PUBLIC_ZELLE_EMAIL` | Yes | Zelle payment email |
| `NEXT_PUBLIC_ZELLE_PHONE` | No | Zelle payment phone |
| `NEXT_PUBLIC_SITE_URL` | No | Your site URL (for production) |

## Support

- 📄 Check [README.md](./README.md) for detailed docs
- 🐛 Look at browser console for errors
- 🔍 Check Supabase logs in dashboard
- 📧 Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues

## Success Checklist

- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] Supabase project created
- [ ] Database migration run
- [ ] Admin user created
- [ ] Dev server running
- [ ] Can login as admin
- [ ] Created first event
- [ ] Event appears on homepage
- [ ] Registration flow works

---

**You're all set!** 🎉

Visit [http://localhost:3000](http://localhost:3000) to see your Whisky Nights Club!

Questions? Check the full [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md).

