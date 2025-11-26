# Quick Setup Guide

This is a condensed setup guide. For full deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Local Development Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run the SQL from `supabase/migrations/001_initial_schema.sql` in SQL Editor
4. Get your project URL and keys from Project Settings > API

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_ZELLE_EMAIL=your-zelle-email
```

### 4. Create Admin User

1. Sign up at `http://localhost:3000/login` (after starting dev server)
2. In Supabase SQL Editor, run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Quick Test

```bash
# Run type check
npx tsc --noEmit

# Run linter
npm run lint

# Run tests (requires dev server running)
npm run test
```

## Project Structure

```
whisky_club/
├── app/                    # Next.js pages
│   ├── admin/             # Admin dashboard
│   ├── event/[id]/        # Event pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   └── ui/               # ShadCN components
├── lib/                   # Utilities
│   ├── actions/          # Server actions
│   └── supabase/         # Supabase clients
├── supabase/             # Database migrations
└── tests/                # Playwright tests
```

## Common Tasks

### Create an Event

1. Login as admin at `/login`
2. Go to `/admin`
3. Click "Create Event"
4. Fill in details and submit

### Test Registration Flow

1. Visit homepage
2. Click on an event
3. Click "Register Now"
4. Fill in form
5. View payment instructions

### View Registrations

1. Login as admin
2. Go to `/admin`
3. Click "Manage" on an event
4. See all registrations and mark as paid

## Need Help?

- Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Detailed docs: [README.md](./README.md)
- Troubleshooting: See README.md

## Next Steps

Once local development works:

1. Push to GitHub
2. Deploy to Vercel
3. Configure production environment variables
4. Test production deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

