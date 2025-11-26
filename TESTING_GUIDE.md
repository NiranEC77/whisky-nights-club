# 🧪 Whisky Nights Club - Testing Guide

Complete guide to testing your application locally and in production.

## 📋 Prerequisites

- Node.js 20+ installed
- A Supabase account (free tier works!)
- A web browser
- Terminal access

## 🚀 Part 1: Local Development Setup & Testing

### Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/niranevenchen/Documents/code/whisky_club
npm install
```

You should see packages being installed. This will take 1-2 minutes.

### Step 2: Set Up Environment Variables (2 minutes)

```bash
# Copy the example file
cp .env.example .env.local

# Open it in your editor
nano .env.local
# or
code .env.local
```

**You need a Supabase project first!** If you don't have one yet:

1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - Name: `whisky-nights-club`
   - Database Password: (generate strong one)
   - Region: (closest to you)
5. Wait 2 minutes for setup

**Get your credentials:**
1. In Supabase, go to **Settings** → **API**
2. Copy these values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_ZELLE_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Set Up Database (2 minutes)

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents
5. Paste into SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

**Verify it worked:**
1. Click **Table Editor** (left sidebar)
2. You should see 3 tables: `profiles`, `events`, `registrations`

### Step 4: Start Development Server (instant)

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000

✓ Ready in 2.5s
```

**Visit http://localhost:3000** - you should see the beautiful whisky-themed homepage! 🥃

## 🧪 Part 2: Manual Testing

### Test 1: Homepage (30 seconds)

1. **Visit:** http://localhost:3000
2. **Check:**
   - ✅ "Whisky Nights Club" header with gold text
   - ✅ Hero section with whisky glass icon
   - ✅ Three feature cards (Regular Events, Intimate Gatherings, Expert Guidance)
   - ✅ "Upcoming Events" section
   - ✅ "Admin Login" button in header

**Expected:** Beautiful dark theme with gold accents

### Test 2: Admin Login & Setup (3 minutes)

First, create your admin user:

1. **Visit:** http://localhost:3000/login
2. **Fill in:**
   - Email: `admin@test.com`
   - Password: `Test123456!`
3. **Click:** Sign In

**It will fail** - that's expected! We need to create the user first.

**Create admin user in Supabase:**

1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Enter:
   - Email: `admin@test.com`
   - Password: `Test123456!`
   - Confirm password: `Test123456!`
5. Click **Create user**

**Set admin role:**

1. Go to **SQL Editor**
2. Run this query:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
   ```
3. Should see "Success. 1 row(s) affected"

**Now login:**

1. Go back to http://localhost:3000/login
2. Sign in with `admin@test.com` / `Test123456!`
3. You should be redirected to **Admin Dashboard** 🎉

### Test 3: Create Your First Event (2 minutes)

1. **From Admin Dashboard**, click **Create Event**
2. **Fill in the form:**
   - Title: `Highland Single Malt Tasting`
   - Description: `Join us for an exploration of Scotland's finest Highland single malts`
   - Date: (pick a future date)
   - Start Time: `19:00`
   - Price: `75`
   - Max Seats: `20`
3. **Click:** Create Event
4. **Expected:** Redirected to dashboard, event appears in list

### Test 4: View Event as Public User (1 minute)

1. **Open incognito/private window** (or different browser)
2. **Visit:** http://localhost:3000
3. **Expected:** You should see your "Highland Single Malt Tasting" event!
4. **Click:** View Details & Register
5. **Expected:** Beautiful event detail page with:
   - Event title and description
   - Date, time, price, availability
   - "What to Expect" section
   - "Register Now" button

### Test 5: Registration Flow (2 minutes)

1. **From event page**, click **Register Now**
2. **Fill in:**
   - Full Name: `John Smith`
   - Email: `john@example.com`
   - Phone: `555-123-4567`
3. **Click:** Complete Registration
4. **Expected:** Success page with Zelle payment instructions
5. **Check:**
   - ✅ Amount shown ($75)
   - ✅ Zelle email displayed
   - ✅ Unique memo code shown
   - ✅ Copy buttons work

### Test 6: Manage Registrations as Admin (2 minutes)

1. **Go back to admin tab** (or login again)
2. **From dashboard**, click **Manage** on your event
3. **Expected:** See John Smith's registration
4. **Check:**
   - ✅ Name, email, phone displayed
   - ✅ "Pending Payment" badge (yellow)
   - ✅ Stats show: 1 registration, 0 paid, 1 pending
5. **Click:** Mark Paid
6. **Expected:**
   - ✅ Badge changes to "Paid" (green)
   - ✅ Stats update: 1 paid, 0 pending

### Test 7: Edit Event (1 minute)

1. **From admin dashboard**, click **Edit** on your event
2. **Change:** Price to `85`
3. **Click:** Update Event
4. **Expected:** Redirected back, price updated everywhere

## 🤖 Part 3: Automated Testing with Playwright

### Setup Playwright (first time only)

```bash
# Install Playwright browsers
npx playwright install --with-deps chromium
```

### Run Tests

```bash
# Run all tests (headless)
npm run test

# Run with UI (see tests running)
npm run test:ui

# Run in browser (watch them run)
npm run test:headed
```

### What the Tests Check

**Homepage Tests:**
- Page loads correctly
- Header and navigation visible
- Hero section displays
- Features section shows

**Auth Tests:**
- Login page displays
- Login redirects to admin (with credentials)
- Admin routes protected

**Event Tests:**
- Event details page loads
- Registration form appears
- Form validation works

**Admin Tests:**
- Dashboard displays stats
- Event creation works
- Event management works

### Test Requirements

For full test coverage, add test credentials to `.env.local`:

```env
TEST_ADMIN_EMAIL=admin@test.com
TEST_ADMIN_PASSWORD=Test123456!
```

## 🔍 Part 4: Code Quality Checks

### TypeScript Check

```bash
npx tsc --noEmit
```

**Expected:** No errors (should be clean!)

### Linting

```bash
npm run lint
```

**Expected:** No errors

### Build Test

```bash
npm run build
```

**Expected:** Successful build, no errors

## ✅ Complete Testing Checklist

### Local Testing
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database migrated (ran SQL in Supabase)
- [ ] Admin user created and role set
- [ ] Dev server starts (`npm run dev`)
- [ ] Homepage loads at localhost:3000
- [ ] Can login as admin
- [ ] Can create events
- [ ] Events appear on homepage
- [ ] Can register for events
- [ ] Payment instructions display
- [ ] Can manage registrations as admin
- [ ] Can mark payments as paid

### Automated Testing
- [ ] Playwright browsers installed
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript check passes
- [ ] Linting passes
- [ ] Build succeeds

### Feature Testing
- [ ] Navigation works (links in header)
- [ ] Responsive design (test on mobile size)
- [ ] Forms validate properly
- [ ] Error handling works (try bad login)
- [ ] Loading states show
- [ ] Toast notifications appear

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Invalid Supabase URL"
- Check `.env.local` has correct URL
- Restart dev server after changing env vars

### "Not authorized" when creating events
- Verify your user has `role = 'admin'` in profiles table
- Check SQL: `SELECT * FROM profiles WHERE email = 'your-email';`

### Tests fail with "Timeout"
- Make sure dev server is running (`npm run dev`)
- Increase timeout in `playwright.config.ts` if needed

### Admin dashboard is empty
- Make sure you created at least one event
- Check that migrations ran successfully
- Verify RLS policies in Supabase

### Registration fails
- Check that event has available seats
- Make sure email isn't already registered
- Look at browser console for errors

## 📊 Test Results Interpretation

### Good Results ✅
```
Tests: 15 passed, 15 total
TypeScript: No errors
ESLint: No warnings
Build: Successful
```

### If Tests Fail ❌
1. Check error message carefully
2. Ensure dev server is running
3. Verify database is set up
4. Check environment variables
5. Look at test output for specific failures

## 🎯 Performance Testing

### Lighthouse (Chrome DevTools)

1. Open http://localhost:3000 in Chrome
2. Press F12 (DevTools)
3. Click "Lighthouse" tab
4. Click "Generate report"

**Target scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### Load Testing (Manual)

1. Create 5-10 test events
2. Register 10-15 attendees
3. Check dashboard performance
4. Verify search/filters work (when added)

## 🚀 Testing in Production

Once deployed to Vercel:

1. **Smoke Test:** Visit all main pages
2. **Registration Flow:** Complete end-to-end
3. **Admin Functions:** Create, edit, manage
4. **Mobile Testing:** Test on actual mobile devices
5. **Browser Testing:** Test in Chrome, Safari, Firefox
6. **Payment Flow:** Test with real Zelle (small amount)

## 📝 Test Data Cleanup

To reset your test data:

```sql
-- In Supabase SQL Editor

-- Delete all registrations
DELETE FROM registrations;

-- Delete all events
DELETE FROM events;

-- Keep your admin user but reset others
DELETE FROM profiles WHERE role = 'member';
```

## 🎉 Success Criteria

Your app is working correctly if:

✅ All pages load without errors
✅ Admin can create and manage events
✅ Public users can view and register
✅ Payment instructions display correctly
✅ Automated tests pass
✅ No TypeScript errors
✅ No linting errors
✅ Build completes successfully

---

## 🆘 Need Help?

- Check browser console (F12) for errors
- Check terminal for server errors
- Review [README.md](./README.md) for details
- Check Supabase logs in dashboard
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for env setup

Happy testing! 🥃✨

