# 🎯 Quick Test Commands

Fast reference for testing your Whisky Nights Club app.

## 🚀 Essential Commands (Copy & Paste)

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Then edit .env.local with your Supabase credentials

# 3. Install Playwright browsers
npx playwright install --with-deps chromium
```

### Daily Development

```bash
# Start development server
npm run dev
# Visit: http://localhost:3000

# In another terminal, run tests
npm run test
```

## 🧪 Testing Commands

```bash
# Run all Playwright tests
npm run test

# Run tests with visual UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/homepage.spec.ts

# Run tests with debug output
npx playwright test --debug
```

## 🔍 Code Quality

```bash
# TypeScript type check
npx tsc --noEmit

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint -- --fix

# Build for production (test build)
npm run build

# Start production build locally
npm run build && npm run start
```

## 🛠️ Utility Scripts

```bash
# Run all pre-flight checks
./scripts/quick-test.sh

# Check environment variables
./scripts/check-env.sh

# Full setup (dependencies + checks)
./scripts/setup.sh
```

## 📊 Manual Testing Checklist

```bash
# 1. Start the dev server
npm run dev

# 2. Open these URLs in browser:
# Homepage
open http://localhost:3000

# Admin login
open http://localhost:3000/login

# After creating an event with ID abc-123
open http://localhost:3000/event/abc-123
open http://localhost:3000/register/abc-123
```

## 🐛 Debug Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check environment variables are loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# View build output
npm run build 2>&1 | tee build.log

# Check for TypeScript errors with details
npx tsc --noEmit --pretty
```

## 📱 Browser Testing

```bash
# Test in different browsers (with Playwright)
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Generate test report
npx playwright show-report
```

## 🎯 Quick Test Flow

**Complete test in 5 minutes:**

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run checks
npx tsc --noEmit     # Type check
npm run lint         # Lint check
npm run test         # Run tests
```

## 📋 Test Data Setup (Supabase SQL)

```sql
-- Create test admin user (after signing up at /login)
UPDATE profiles SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Create a test event
INSERT INTO events (title, description, date, start_time, price, max_seats, created_by)
VALUES (
  'Test Event',
  'A test whisky tasting',
  '2024-12-31',
  '19:00',
  75,
  20,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);

-- Create a test registration
INSERT INTO registrations (event_id, full_name, email, phone, payment_status)
VALUES (
  (SELECT id FROM events LIMIT 1),
  'Test User',
  'test@example.com',
  '555-1234',
  'pending'
);

-- View all events
SELECT * FROM events;

-- View all registrations
SELECT * FROM registrations;

-- Clean up test data
DELETE FROM registrations;
DELETE FROM events WHERE title LIKE 'Test%';
```

## 🚀 Pre-Deployment Test

Before deploying to production:

```bash
# 1. Full build
npm run build

# 2. Run production build locally
npm run start

# 3. Run all tests
npm run test

# 4. Type check
npx tsc --noEmit

# 5. Lint check
npm run lint

# If all pass, you're ready to deploy!
```

## 🎬 Playwright Test Options

```bash
# Run only failed tests
npx playwright test --last-failed

# Run tests matching pattern
npx playwright test admin

# Run single test file
npx playwright test tests/auth.spec.ts

# Run with specific timeout
npx playwright test --timeout=60000

# Generate test traces for debugging
npx playwright test --trace=on
```

## 📊 Performance Testing

```bash
# Build and analyze bundle
npm run build

# Check build size (Next.js shows this automatically)

# For detailed analysis, add to package.json:
# "@next/bundle-analyzer": "^14.1.0"
# Then: ANALYZE=true npm run build
```

## 🔄 Git + Test Workflow

```bash
# Before committing
git add .
npm run lint
npx tsc --noEmit
npm run test
git commit -m "Your message"

# Push
git push
```

## 🆘 Common Issues

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
# Or use different port
PORT=3001 npm run dev
```

### Tests timing out
```bash
# Increase timeout in playwright.config.ts
# Or run with explicit timeout
npx playwright test --timeout=60000
```

### Build fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## ✅ Success Indicators

You're good to go if:
- ✅ `npm run dev` starts without errors
- ✅ `npm run test` all tests pass
- ✅ `npx tsc --noEmit` no type errors
- ✅ `npm run lint` no warnings
- ✅ `npm run build` completes successfully
- ✅ Can login as admin
- ✅ Can create and view events
- ✅ Can register for events

---

**Need detailed testing instructions?** See [TESTING_GUIDE.md](./TESTING_GUIDE.md)

**Need setup help?** See [SETUP.md](./SETUP.md) or [QUICKSTART.md](./QUICKSTART.md)

