# Redhead Whiskey - Event Management Platform

A complete web application for managing whiskey tasting events with online registration, payment tracking, automatic email confirmations, and an admin dashboard.

![Redhead Whiskey](https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800)

---

## 📖 Table of Contents

- [What This App Does](#what-this-app-does)
- [How It Works](#how-it-works)
- [Technologies Used](#technologies-used)
- [Complete Setup Guide](#complete-setup-guide)
- [Features](#features)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## 🥃 What This App Does

This is a **complete event management system** for your whiskey club. Think of it as your own private Eventbrite specifically designed for whiskey tastings.

### For Your Club Members:
1. **Browse Events** - See all upcoming whiskey tastings on the homepage
2. **Register Online** - Simple form with name, email, phone
3. **Choose Tickets** - Select 1 or 2 tickets per registration
4. **Get Confirmation** - Automatic email with event details and payment instructions
5. **Pay via Zelle** - Clear instructions with a unique payment reference

### For You (Admin):
1. **Create Events** - Easy form to set up new tastings
2. **Upload Images** - Add featured images for each event with built-in cropping
3. **Track Registrations** - See who registered and for how many tickets
4. **Manage Payments** - Mark who has paid, who hasn't
5. **Manage Users** - Add other admins or team members
6. **View Analytics** - See total registrations, revenue, and seat availability

---

## 🔄 How It Works

### The User Journey

```
1. Member visits your website
   ↓
2. Sees upcoming events with photos and details
   ↓
3. Clicks "Register" on an event
   ↓
4. Fills out form (name, email, phone, # of tickets)
   ↓
5. Clicks "Complete Registration"
   ↓
6. Gets email confirmation with payment instructions
   ↓
7. Sends payment via Zelle with reference number
   ↓
8. You (admin) receive payment
   ↓
9. You mark them as "Paid" in admin dashboard
   ↓
10. They get "Payment Confirmed" email
   ↓
11. They show up to the event! 🥃
```

### The Admin Workflow

```
1. Login to admin dashboard
   ↓
2. Click "Create New Event"
   ↓
3. Upload a whiskey bottle photo (crops automatically)
   ↓
4. Fill in details: title, date, time, price, max seats
   ↓
5. Click "Create Event"
   ↓
6. Event appears on public website immediately
   ↓
7. As people register, you see them in "Manage" page
   ↓
8. When payment received, click "Mark as Paid"
   ↓
9. They get confirmation email automatically
```

---

## 💻 Technologies Used (In Plain English)

### Frontend (What Users See)

**Next.js 14** - The framework that powers the website
- Think of it as the foundation of your house
- Makes the website fast and SEO-friendly
- Handles routing (different pages)

**TypeScript** - JavaScript with extra safety features
- Catches errors before they happen
- Makes code more reliable

**Tailwind CSS** - Styling system
- Makes the website look beautiful
- Handles all the colors, spacing, and animations
- Responsive (works on phones, tablets, computers)

**ShadCN UI** - Pre-built components
- Buttons, forms, cards, dialogs
- Professional-looking UI elements
- Saves development time

### Backend (Behind the Scenes)

**Supabase** - Your database and authentication system
- **Database**: Stores events, registrations, user accounts
- **Authentication**: Handles login/logout securely
- **Storage**: Stores uploaded event images
- **Security**: Built-in protection with Row Level Security (RLS)

Think of Supabase as your:
- Filing cabinet (database)
- Security guard (authentication)
- Photo album (image storage)
- All in one cloud service

**Resend** - Email sending service
- Sends registration confirmations automatically
- Sends payment confirmations
- Professional-looking HTML emails
- Free tier: 3,000 emails/month

### Hosting

**Vercel** - Where your website lives on the internet
- Hosts your site with a URL
- Automatically updates when you push code to GitHub
- Free tier is perfect for this app
- Handles all the server stuff

**GitHub** - Where your code is stored
- Version control (tracks all changes)
- Backup of all your code
- Triggers automatic deployments

---

## 🚀 Complete Setup Guide

Follow these steps to get your whiskey club website running from scratch.

### Prerequisites (What You Need)

- A computer (Mac, Windows, or Linux)
- An internet connection
- About 1 hour for complete setup

### Part 1: Install Required Software

#### 1. Install Node.js (JavaScript runtime)

**On Mac:**
```bash
# If you have Homebrew:
brew install node

# Verify installation:
node --version  # Should show v20 or higher
```

**On Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Run the installer
- Restart your terminal

#### 2. Install Git (Version control)

**On Mac:**
```bash
# Usually already installed, check with:
git --version

# If not installed:
brew install git
```

**On Windows:**
- Download from [git-scm.com](https://git-scm.com/)

### Part 2: Set Up Accounts (All Free!)

#### 1. Create a GitHub Account
- Go to [github.com](https://github.com)
- Sign up (free)
- This stores your code

#### 2. Create a Supabase Account
- Go to [supabase.com](https://supabase.com)
- Sign up with GitHub (free)
- Create a new project:
  - **Name**: `whiskey-club`
  - **Database Password**: (create a strong password, save it!)
  - **Region**: Choose closest to you
- Wait 2 minutes for project to initialize

#### 3. Create a Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub (free)
- This will host your website

#### 4. Create a Resend Account (For Emails)
- Go to [resend.com](https://resend.com)
- Sign up (free - 3,000 emails/month)
- This sends registration confirmation emails

### Part 3: Download and Install the Code

#### 1. Clone This Repository

```bash
# Navigate to where you want the project
cd ~/Documents

# Clone the repo (replace with your repo URL)
git clone https://github.com/NiranEC77/whisky-nights-club.git

# Go into the folder
cd whisky-nights-club

# Install all dependencies
npm install
```

This downloads all the code and installs all required packages.

### Part 4: Configure Supabase Database

#### 1. Get Your Supabase Credentials

Go to your Supabase project:
- Click **Project Settings** (gear icon)
- Go to **API** section
- Copy these values (you'll need them soon):
  - **Project URL** (looks like: `https://xxxxx.supabase.co`)
  - **anon/public key** (long string starting with `eyJ...`)
  - **service_role key** (different long string, keep secret!)

#### 2. Run Database Migrations

In Supabase dashboard:

1. Click **SQL Editor** in sidebar
2. Click **"New query"**
3. Copy ENTIRE content of `supabase/migrations/001_initial_schema.sql` from your project
4. Paste into SQL editor
5. Click **"Run"** (or Cmd/Ctrl + Enter)
6. Should see: "Success"

7. Repeat for other migrations:
   - `002_seed_admin.sql` (creates first admin user)
   - `003_add_ticket_quantity.sql` (adds ticket count feature)
   - `004_add_event_featured_image.sql` (adds image support)

#### 3. Set Your First Admin User

After running migrations, in Supabase SQL Editor, run:

```sql
-- Replace with YOUR email
UPDATE profiles 
SET role = 'admin', full_name = 'Your Name'
WHERE email = 'your-email@example.com';
```

#### 4. Create Supabase Storage Bucket (For Event Images)

In Supabase dashboard:

1. Click **Storage** in sidebar
2. Click **"New bucket"**
3. **Name**: `event-images`
4. ✅ **Check "Public bucket"** (important!)
5. Click **"Create bucket"**

6. Set storage policy:
   - Go to **Storage** → **Policies**
   - Click **event-images** bucket
   - Click **"New Policy"**
   - Select **"Allow public read access"**
   - Click **"Save policy"**

### Part 5: Configure Resend (Email Service)

#### 1. Get Resend API Key

In Resend dashboard:
1. Go to **API Keys**
2. Click **"Create API Key"**
3. Name: `whiskey-club`
4. Copy the key (starts with `re_`)

#### 2. Choose Email Domain

**Option A: Test Domain (Quick, for testing)**
- Use: `onboarding@resend.dev`
- Works immediately
- Emails might go to spam

**Option B: Your Own Domain (Better, for production)**
1. In Resend, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `redheadwhiskey.com`)
4. Add DNS records to your domain registrar
5. Wait for verification
6. Use: `events@yourdomain.com`

### Part 6: Configure Environment Variables

#### 1. Create .env.local File

In your project folder, create a file called `.env.local`:

```bash
# Create the file
touch .env.local

# Edit it with your values
```

#### 2. Add Your Configuration

Copy this into `.env.local` and **replace with your actual values**:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Zelle Payment Information
NEXT_PUBLIC_ZELLE_EMAIL=your-zelle@email.com
NEXT_PUBLIC_ZELLE_PHONE=555-123-4567

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (Resend)
RESEND_API_KEY=re_YourResendApiKey
EMAIL_FROM=Redhead Whiskey <onboarding@resend.dev>
```

**Where to find each value:**
- **Supabase values**: Supabase Dashboard → Settings → API
- **Zelle info**: Your Zelle account email/phone
- **Resend key**: Resend Dashboard → API Keys
- **Email from**: `onboarding@resend.dev` for testing, or your verified domain

### Part 7: Test Locally

```bash
# Make sure you're in the project folder
cd ~/Documents/whisky-nights-club

# Start the development server
npm run dev
```

Open your browser to: **http://localhost:3000**

You should see your whiskey club website! 🎉

**Test everything:**
1. Browse events (empty at first)
2. Go to `/login`
3. Sign in with the email you set as admin
4. Create a test event
5. Upload an image
6. View the event on homepage
7. Try registering
8. Check your email for confirmation

### Part 8: Deploy to Production (Make It Live!)

#### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel detects it's Next.js ✅

#### 2. Add Environment Variables in Vercel

Click **"Environment Variables"** and add the SAME variables from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_ZELLE_EMAIL
NEXT_PUBLIC_ZELLE_PHONE
NEXT_PUBLIC_SITE_URL (use your Vercel URL)
RESEND_API_KEY
EMAIL_FROM
```

#### 3. Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://your-project.vercel.app`
4. Your site is LIVE! 🎉

#### 4. Update Site URL

After deployment:
1. Copy your Vercel URL
2. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables
3. Redeploy

---

## ✨ Features

### 🌐 Public Features (What Anyone Can See)

#### Homepage
- List of upcoming events with featured images
- Beautiful hero section with your custom image
- Event cards showing date, time, price, availability

#### Event Details Page
- Large featured image banner
- Full event description
- Date, time, price, seats available
- "Register Now" button

#### Registration Page
- Simple form: name, email, phone
- Ticket selector (1 or 2 tickets)
- Shows total price automatically
- Live seat availability check

#### Success Page
- Confirmation message
- Zelle payment instructions
- Unique payment reference number
- Copy-to-clipboard buttons

#### Email Confirmations
- **Registration email** sent immediately
  - Event details
  - Payment instructions
  - Zelle reference number
  
- **Payment confirmation** when marked paid
  - "You're all set!" message
  - Event reminder

### 🔐 Admin Features (Requires Login)

#### Admin Dashboard (`/admin`)
- Overview of all events
- Total registrations and revenue
- Quick access to manage events
- "Create Event" button

#### Create Event (`/admin/events/new`)
- Title, description
- Date and time (HH:MM format)
- Price per person
- Maximum seats
- **Image upload with cropping tool** 🎨
  - Drag and drop
  - Crop and zoom before uploading
  - 2:1 aspect ratio for consistency

#### Manage Attendees (`/admin/events/[id]`)
- Full list of registrants
- See ticket count per person
- Payment status (pending/paid)
- Mark as paid (sends confirmation email)
- Delete registrations
- Export to CSV

#### Edit Event (`/admin/events/[id]/edit`)
- Update any event details
- Change featured image
- Adjust seats, price, etc.

#### User Management (`/admin/users`)
- Create new admin accounts
- View all users
- Change user roles (admin/member)
- Cannot change your own role (safety feature)

---

## 🛠 Technologies Used (What Each Does)

### Frontend (The Website You See)

| Technology | What It Does | Why We Use It |
|------------|-------------|---------------|
| **Next.js 14** | Framework for building the website | Fast, SEO-friendly, modern React framework |
| **TypeScript** | Programming language | Catches bugs early, makes code safer |
| **Tailwind CSS** | Styling system | Beautiful design without writing CSS files |
| **ShadCN UI** | UI component library | Professional-looking buttons, forms, cards |
| **Lucide Icons** | Icon library | Beautiful icons throughout the site |
| **React Easy Crop** | Image cropping tool | Crop images before uploading |

### Backend (Behind the Scenes)

| Technology | What It Does | Why We Use It |
|------------|-------------|---------------|
| **Supabase** | Database + Auth + Storage | All-in-one backend service, PostgreSQL database |
| **Server Actions** | Form handling | Submit forms securely without API routes |
| **Resend** | Email service | Send beautiful HTML emails automatically |

### Deployment & DevOps

| Technology | What It Does | Why We Use It |
|------------|-------------|---------------|
| **Vercel** | Website hosting | Automatic deployments, global CDN, free tier |
| **GitHub** | Code repository | Stores code, version control, collaboration |
| **GitHub Actions** | Automated testing | Runs tests on every code change |
| **Playwright** | Testing framework | End-to-end testing to ensure everything works |

### How They Work Together

```
User visits site (Vercel hosting)
  ↓
Website loads (Next.js)
  ↓
Displays events from database (Supabase)
  ↓
User registers (Server Action)
  ↓
Saves to database (Supabase)
  ↓
Sends confirmation email (Resend)
  ↓
Admin marks paid (Server Action)
  ↓
Sends confirmation email (Resend)
```

---

## 📚 Complete Setup Guide

### Quick Start (For the Impatient)

Already have accounts? Just need to configure?

```bash
# 1. Clone repo
git clone <your-repo-url>
cd whisky-nights-club

# 2. Install dependencies
npm install

# 3. Copy env file
cp .env.example .env.local

# 4. Edit .env.local with your credentials
# (Use any text editor)

# 5. Run migrations in Supabase SQL Editor
# (Copy/paste from supabase/migrations/)

# 6. Start dev server
npm run dev

# 7. Visit http://localhost:3000
```

### Detailed Setup

See the sections above for step-by-step instructions for:
- Installing Node.js and Git
- Creating accounts (Supabase, Vercel, Resend, GitHub)
- Downloading the code
- Setting up the database
- Configuring email
- Deploying to production

Or check these guide files in your project:
- **`SETUP.md`** - Local development setup
- **`DEPLOYMENT.md`** - Production deployment
- **`EMAIL_SETUP.md`** - Email configuration
- **`SUPABASE_STORAGE_SETUP.md`** - Image storage setup
- **`RUN_THIS_SQL.md`** - Database migration instructions

---

## 🗂 Project Structure

```
whisky-nights-club/
│
├── 📁 app/                          # All your pages
│   ├── page.tsx                    # Homepage (public)
│   ├── layout.tsx                  # Wrapper for all pages
│   ├── 📁 event/[id]/              # Event detail pages
│   │   └── page.tsx
│   ├── 📁 register/[id]/           # Registration pages
│   │   └── page.tsx
│   ├── 📁 success/[id]/            # Success pages (payment instructions)
│   │   └── page.tsx
│   ├── 📁 login/                   # Admin login
│   │   └── page.tsx
│   └── 📁 admin/                   # Admin dashboard (protected)
│       ├── page.tsx                # Main dashboard
│       ├── 📁 events/              # Event management
│       │   ├── 📁 new/             # Create event
│       │   └── 📁 [id]/            # Manage/edit specific event
│       └── 📁 users/               # User management
│           └── page.tsx
│
├── 📁 components/                   # Reusable UI pieces
│   ├── header.tsx                  # Site header/navigation
│   ├── event-card.tsx              # Event display card
│   ├── image-upload-client.tsx     # Image upload with cropping
│   ├── image-cropper.tsx           # Image cropping modal
│   ├── copy-button.tsx             # Copy to clipboard button
│   ├── scroll-to-top.tsx           # Auto-scroll on navigation
│   ├── submit-button.tsx           # Form submit with loading state
│   ├── 📁 ui/                      # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (more UI components)
│   └── 📁 icons/                   # Custom icons
│       └── dram-glass.tsx          # Custom whisky glass icon
│
├── 📁 lib/                          # Backend logic & utilities
│   ├── 📁 actions/                 # Server-side functions
│   │   ├── events.ts               # Event CRUD operations
│   │   ├── registrations.ts        # Registration operations
│   │   ├── auth.ts                 # Authentication
│   │   └── users.ts                # User management
│   ├── 📁 supabase/                # Database clients
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   ├── service.ts              # Service role client
│   │   ├── middleware.ts           # Auth middleware
│   │   └── storage.ts              # Storage helper
│   ├── email.ts                    # Email sending (Resend)
│   ├── types.ts                    # TypeScript type definitions
│   └── utils.ts                    # Helper functions (date formatting, etc.)
│
├── 📁 supabase/migrations/          # Database setup SQL files
│   ├── 001_initial_schema.sql      # Tables: profiles, events, registrations
│   ├── 002_seed_admin.sql          # Creates first admin user
│   ├── 003_add_ticket_quantity.sql # Adds ticket count (1-2)
│   └── 004_add_event_featured_image.sql # Adds image support
│
├── 📁 public/                       # Static files (served directly)
│   └── 📁 images/
│       ├── logo.png                # Your Redhead Whiskey logo
│       ├── featured_image.jpg      # Homepage hero image
│       └── 📁 events/              # Event images uploaded here
│
├── 📁 tests/                        # Automated tests
│   ├── homepage.spec.ts
│   ├── auth.spec.ts
│   └── registration.spec.ts
│
├── 📁 .github/workflows/            # CI/CD automation
│   └── ci.yml                      # Runs tests on every push
│
├── 📄 Configuration Files
│   ├── package.json                # Dependencies list
│   ├── tsconfig.json               # TypeScript settings
│   ├── tailwind.config.ts          # Design system colors/fonts
│   ├── next.config.js              # Next.js configuration
│   ├── .env.local                  # Your secret credentials (not in git)
│   └── vercel.json                 # Vercel deployment settings
│
└── 📄 Documentation Files
    ├── README.md                   # This file!
    ├── SETUP.md                    # Local setup guide
    ├── DEPLOYMENT.md               # Deployment guide
    ├── EMAIL_SETUP.md              # Email configuration
    ├── SUPABASE_STORAGE_SETUP.md   # Image storage setup
    ├── IMAGE_UPLOAD_GUIDE.md       # How to use image upload
    ├── TESTING_GUIDE.md            # Testing instructions
    └── RUN_THIS_SQL.md             # Database migration help
```

---

## 🗄 Database Schema

### Tables

#### `profiles` - User Accounts
```
id          (uuid)      - Unique user ID
email       (text)      - User email
full_name   (text)      - User's full name
phone       (text)      - Phone number
role        (text)      - "admin" or "member"
created_at  (timestamp) - When account was created
```

#### `events` - Whiskey Tasting Events
```
id              (uuid)      - Unique event ID
title           (text)      - Event name (e.g., "Scotch Tasting Night")
description     (text)      - What to expect
date            (date)      - Event date
start_time      (text)      - Time (e.g., "19:00")
price           (number)    - Price per person ($)
max_seats       (number)    - Maximum attendees
featured_image  (text)      - URL to event image
created_by      (uuid)      - Admin who created it
created_at      (timestamp) - When created
```

#### `registrations` - Event Sign-ups
```
id             (uuid)      - Unique registration ID
event_id       (uuid)      - Which event
user_id        (uuid)      - User (if logged in)
full_name      (text)      - Registrant name
email          (text)      - Contact email
phone          (text)      - Contact phone
ticket_count   (number)    - How many tickets (1-2)
payment_status (text)      - "pending" or "paid"
created_at     (timestamp) - When registered
```

### Security (Row Level Security)

**RLS Policies** protect your data:
- ✅ Anyone can VIEW events (public)
- ✅ Only logged-in users can VIEW their own registrations
- ✅ Only ADMINS can create/edit/delete events
- ✅ Only ADMINS can update payment status
- ✅ Users cannot change their own role

---

## 🎨 Design & Branding

### Color Palette

The site uses a warm, premium whiskey club aesthetic:

```
Background:     #0F0E0E (deep charcoal)
Cards:          #1A1919 (dark gray)
Primary Gold:   #C6A667 (whiskey amber)
Accent:         #DAA520 (golden)
Bourbon:        #8C5E3C (warm brown)
Text:           #F7F3E9 (cream)
```

### Typography

- **Headings**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)
- Loaded from Google Fonts

### Custom Features

- Gold gradient text effects
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Dark theme with warm accents
- Custom Glencairn glass icon 🥃

---

## 🔧 How Each Feature Works

### Image Upload & Cropping

**What happens when you upload an event image:**

1. Click upload area in Create/Edit Event form
2. Select image from your computer (JPG, PNG, WebP up to 5MB)
3. **Crop modal opens automatically**
   - Drag to reposition
   - Zoom slider to adjust (1x-3x)
   - 2:1 aspect ratio (perfect for cards)
4. Click "Apply Crop"
5. Image uploads to **Supabase Storage** (cloud-based)
6. Returns a public URL
7. URL saved in database with event
8. Image displays on event card and detail page

**Technical flow:**
```
User selects file
  → Browser reads file
  → Shows in crop modal (react-easy-crop)
  → User adjusts crop
  → Canvas creates cropped version
  → Blob sent to API route (/api/upload-event-image)
  → Uploads to Supabase Storage bucket
  → Returns public CDN URL
  → Saved in events.featured_image column
```

### Registration Process

**What happens when someone registers:**

1. User fills out form on `/register/[event-id]`
2. Submits form (Server Action)
3. Backend checks:
   - Event exists?
   - Enough seats available?
   - Email not already registered?
4. Creates registration in database
5. **Sends email via Resend**:
   - Event details
   - Total price
   - Zelle payment instructions
   - Unique payment reference
6. Redirects to success page
7. User sees payment instructions

**Technical flow:**
```
Form submitted
  → createRegistration() server action
  → Validates data
  → Checks seat availability
  → Inserts into registrations table
  → sendRegistrationEmail()
    → Resend API sends HTML email
  → Returns success
  → Redirects to /success/[id]
```

### Payment Tracking

**What happens when you mark someone as paid:**

1. Admin goes to event management page
2. Sees list of registrants with payment status
3. Clicks "Mark as Paid" next to a name
4. **Server Action updates database**:
   - Changes payment_status to 'paid'
   - Fetches registration details
   - **Sends confirmation email via Resend**
5. Registrant receives "Payment Confirmed" email
6. Page updates to show "Paid" status

**Technical flow:**
```
Admin clicks "Mark as Paid"
  → updatePaymentStatus() server action
  → Updates registrations table
  → Fetches registration + event details
  → sendPaymentConfirmation()
    → Resend API sends email
  → Revalidates page cache
  → UI updates
```

### Authentication & Authorization

**How admin access works:**

1. Admin goes to `/login`
2. Enters email and password
3. **Supabase Auth** verifies credentials
4. Creates session cookie
5. **Middleware** checks session on every request
6. Server Actions check user role:
   - Query profiles table for user's role
   - If role = 'admin', allow
   - If not, redirect to login
7. **RLS policies** enforce security at database level

**Technical flow:**
```
User logs in
  → Supabase Auth authenticates
  → Session cookie created
  → Middleware verifies session
  → Gets user from database
  → Checks role in profiles table
  → Admin routes only if role='admin'
  → RLS policies enforce in database queries
```

---

## 🔐 Security Features

### Authentication
- ✅ **Supabase Auth** - Industry-standard authentication
- ✅ **Secure sessions** - HTTP-only cookies
- ✅ **Middleware protection** - Checks auth on every request

### Authorization
- ✅ **Role-based access** - Admin vs Member roles
- ✅ **Server-side checks** - All actions verify permissions
- ✅ **RLS policies** - Database-level security

### Data Protection
- ✅ **Environment variables** - Secrets never in code
- ✅ **Service role key** - Only used server-side
- ✅ **Input validation** - Forms validate data
- ✅ **SQL injection protection** - Supabase client sanitizes queries

### Image Upload Security
- ✅ **File type validation** - Only images allowed
- ✅ **Size limits** - Max 5MB per image
- ✅ **Unique filenames** - Prevents overwriting
- ✅ **Public storage** - Images accessible but secure

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Could not find column" Error

**Problem**: Database migration not run

**Solution**: 
- Go to Supabase → SQL Editor
- Run migrations from `supabase/migrations/`
- See `RUN_THIS_SQL.md` for instructions

#### 2. Image Upload Fails

**Problem**: Supabase Storage not configured

**Solution**:
- Create `event-images` bucket in Supabase Storage
- Set bucket to public
- Add read policies
- See `SUPABASE_STORAGE_SETUP.md`

#### 3. No Emails Sending

**Problem**: Resend not configured

**Solution**:
- Add `RESEND_API_KEY` to environment variables
- Add `EMAIL_FROM` with valid email
- Verify domain in Resend (or use test domain)
- See `EMAIL_SETUP.md`

#### 4. Can't Login as Admin

**Problem**: User role not set

**Solution**:
```sql
-- Run in Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

#### 5. Images Show Broken in Preview

**Problem**: Next.js doesn't allow the domain

**Solution**:
- Already configured for Supabase domains
- Clear `.next` cache: `rm -rf .next`
- Restart dev server

#### 6. Page Loads at Bottom

**Problem**: Scroll position not reset

**Solution**: Already fixed with ScrollToTop component

#### 7. Environment Variables Not Working

**Problem**: Not added to Vercel or local .env.local

**Solution**:
- Check `.env.local` exists and has correct values
- In Vercel, add to Environment Variables
- Redeploy after adding env vars

---

## 🧪 Testing

### Manual Testing Checklist

**Public Features:**
- [ ] Homepage loads and shows events
- [ ] Event detail page displays correctly
- [ ] Registration form submits successfully
- [ ] Email confirmation received
- [ ] Success page shows Zelle instructions

**Admin Features:**
- [ ] Can login with admin account
- [ ] Dashboard shows events and stats
- [ ] Can create new event
- [ ] Can upload and crop event image
- [ ] Can edit existing event
- [ ] Can mark payment as paid
- [ ] Payment confirmation email sent
- [ ] Can create new admin users
- [ ] Can change user roles

### Automated Testing

```bash
# Run all Playwright tests
npm run test

# Run tests with visual interface
npm run test:ui

# Run specific test file
npx playwright test tests/homepage.spec.ts
```

---

## 📈 Usage Analytics

### What You Can Track

With Supabase, you can see:
- Total registrations per event
- Total revenue per event
- Seats remaining
- Payment completion rate
- User registration trends

### Example Analytics Queries

Run these in Supabase SQL Editor:

```sql
-- Total revenue from paid registrations
SELECT 
  e.title,
  COUNT(r.id) as total_registrations,
  SUM(r.ticket_count) as total_tickets,
  SUM(r.ticket_count * e.price) as total_revenue
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id AND r.payment_status = 'paid'
GROUP BY e.id, e.title
ORDER BY e.date DESC;

-- Payment completion rate
SELECT 
  e.title,
  COUNT(CASE WHEN r.payment_status = 'paid' THEN 1 END) as paid,
  COUNT(CASE WHEN r.payment_status = 'pending' THEN 1 END) as pending,
  ROUND(COUNT(CASE WHEN r.payment_status = 'paid' THEN 1 END)::numeric / 
        NULLIF(COUNT(r.id), 0) * 100, 1) as completion_rate
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, e.title;
```

---

## 🔄 Maintenance & Updates

### Regular Tasks

**Weekly:**
- Check Vercel deployments
- Review registration emails
- Monitor Resend email quota (free: 3,000/month)

**Monthly:**
- Archive old events (manual for now)
- Review Supabase storage usage (free: 1GB)
- Check payment completion rates

**As Needed:**
- Update Node.js dependencies: `npm update`
- Review security alerts: `npm audit`

### Updating the Code

```bash
# Make changes to your code
# (edit files in your editor)

# Save and commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push

# Vercel automatically deploys! 🚀
```

---

## 💰 Cost Breakdown (Monthly)

All free tier options available:

| Service | Free Tier | What You Get | Upgrade If |
|---------|-----------|--------------|------------|
| **Vercel** | Free | Unlimited sites, 100GB bandwidth | Need more bandwidth (unlikely) |
| **Supabase** | Free | 500MB database, 1GB storage, 2GB transfer | Need more storage/connections |
| **Resend** | Free | 3,000 emails/month, 100/day | Sending 100+ emails/day |
| **GitHub** | Free | Unlimited public/private repos | Need advanced features |

**Total monthly cost: $0** for most whiskey clubs!

**When you might need to upgrade:**
- 30+ events per month with 100+ registrations each → Supabase Pro ($25/mo)
- 100+ emails per day → Resend Pro ($20/mo)
- Very high traffic → Vercel Pro ($20/mo)

---

## 🎯 Key Concepts Explained

### What is "Serverless"?

Your app doesn't run on a traditional server. Instead:
- Code runs on-demand when someone visits
- You don't manage servers
- Scales automatically
- Pay only for what you use (or free tier)

### What is "Server Action"?

Instead of creating API routes, Next.js Server Actions let you:
- Write backend functions directly in your code
- Call them from forms
- Automatically secure
- No need to create separate API endpoints

### What is "Row Level Security (RLS)"?

Database-level security that:
- Checks every query
- Enforces who can see/edit what
- Works even if your code has bugs
- Example: Users can't see other users' registrations

### What is "CDN"?

Content Delivery Network:
- Your images stored in multiple locations worldwide
- Served from location closest to user
- Faster loading
- Supabase Storage uses CDN automatically

---

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev              # Start local server
npm run build            # Build for production
npm run start            # Run production build locally

# Testing
npm run test             # Run all tests
npm run test:ui          # Run tests with UI
npm run lint             # Check code quality

# Database
# (Run in Supabase SQL Editor)
# See supabase/migrations/ for SQL files

# Deployment
git push                 # Auto-deploys to Vercel
```

---

## 📞 Getting Help

### Documentation Files in This Project

- **`README.md`** (this file) - Complete overview
- **`SETUP.md`** - Step-by-step local setup
- **`DEPLOYMENT.md`** - How to deploy to Vercel
- **`EMAIL_SETUP.md`** - Configure Resend emails
- **`SUPABASE_STORAGE_SETUP.md`** - Image storage setup
- **`IMAGE_UPLOAD_GUIDE.md`** - Using the image cropper
- **`TESTING_GUIDE.md`** - Running tests
- **`RUN_THIS_SQL.md`** - Database migrations

### External Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Tailwind Docs**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

### Support

- Open an issue on GitHub
- Check documentation files
- Review console logs (F12 in browser)
- Check Vercel deployment logs
- Check Supabase logs

---

## 🎉 What Makes This Special

### Professional Features
- ✅ **Image cropping** - Upload and crop images in one step
- ✅ **Automatic emails** - Confirmation and payment emails
- ✅ **Ticket quantities** - Support 1-2 tickets per registration
- ✅ **Real-time availability** - Prevents overbooking
- ✅ **Admin user management** - Add team members
- ✅ **Role-based access** - Admin vs Member permissions

### Developer-Friendly
- ✅ **TypeScript** - Type safety throughout
- ✅ **Server Actions** - No API routes needed
- ✅ **Component library** - Consistent UI
- ✅ **Automated testing** - Playwright E2E tests
- ✅ **CI/CD pipeline** - GitHub Actions
- ✅ **Hot reload** - See changes instantly

### Production-Ready
- ✅ **Serverless** - Scales automatically
- ✅ **Global CDN** - Fast worldwide
- ✅ **Database security** - RLS policies
- ✅ **Error handling** - Graceful failures
- ✅ **Loading states** - User feedback
- ✅ **Responsive** - Works on all devices

---

## 🤝 Contributing

Want to improve the app? Here's how:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make changes** and test locally
4. **Commit**: `git commit -m "Add your feature"`
5. **Push**: `git push origin feature/your-feature`
6. **Open a Pull Request** on GitHub

See `CONTRIBUTING.md` for detailed guidelines.

---

## 📄 License

MIT License - Feel free to use this for your whiskey club!

---

## 🙏 Credits & Acknowledgments

### Design Inspiration
- [Redhead Whiskey Community](https://redheadwhiskey.community/) - Branding and community focus
- [Virtual Whisky Club](https://virtualwhiskyclub.lovable.app/) - Visual aesthetic

### Built With
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform
- [Vercel](https://vercel.com/) - Hosting platform
- [Resend](https://resend.com/) - Email service
- [ShadCN UI](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon library

---

## 📧 Support & Contact

- **Issues**: Open a GitHub issue
- **Email**: events@redheadwhiskey.com
- **Documentation**: See other .md files in this repo

---

## 🎯 Next Steps After Setup

1. ✅ Complete all setup steps above
2. ✅ Create your first event
3. ✅ Test registration flow
4. ✅ Verify email confirmations work
5. ✅ Share your site URL with members
6. ✅ Manage your first event!

---

Made with ❤️ and 🥃 for whiskey enthusiasts everywhere.

**Bringing people together through good drinks, delicious food, engaging company and great conversation. It's about the togetherness.**
