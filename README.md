# Whisky Nights Club

A premium web application for managing whisky tasting events with registration, payment tracking, and admin dashboard.

![Whisky Nights Club](https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800)

## 🥃 Features

### Public Features
- **Event Discovery**: Browse upcoming whisky tasting events
- **Event Details**: View comprehensive event information with timing, pricing, and availability
- **Easy Registration**: Simple registration form with email confirmation
- **Zelle Payment Instructions**: Clear payment instructions after registration
- **Responsive Design**: Beautiful whisky-themed UI that works on all devices

### Admin Features
- **Dashboard**: Overview of all events, registrations, and revenue
- **Event Management**: Create, edit, and manage events
- **Attendee Management**: View registrations and track payment status
- **Payment Tracking**: Mark registrations as paid/pending
- **Real-time Stats**: See registered count, paid count, and revenue

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom whisky theme
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with RLS
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Testing**: Playwright

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- A Supabase account
- A Vercel account (for deployment)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd whisky_club
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

- Create a new Supabase project at [supabase.com](https://supabase.com)
- Go to Project Settings > API to get your project URL and anon key
- Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

- Fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_ZELLE_EMAIL=your-zelle-email
```

4. **Run database migrations**

In your Supabase SQL Editor, run the migrations from `supabase/migrations/`:

- Execute `001_initial_schema.sql` to create tables and policies
- This will set up the database with RLS policies

5. **Create your first admin user**

- Sign up through the Supabase dashboard or Authentication UI
- After creating the user, run this SQL in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Tables

**profiles**
- User profiles with role-based access (admin/member)
- Automatically created on user signup

**events**
- Event details including title, date, time, price, seats
- Created and managed by admins

**registrations**
- Event registrations with contact info and payment status
- Anyone can register, only admins can modify

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Public can view events and registrations
- Only authenticated users can manage their own profiles
- Only admins can create/edit/delete events
- Only admins can update registration payment status

## 🎨 Design Theme

The application uses a warm, premium whisky-club aesthetic:

- **Colors**: Dark backgrounds (#0F0E0E) with gold accents (#C6A667)
- **Typography**: Playfair Display (serif) for headings, Inter for body
- **Style**: Elegant cards with subtle shadows and warm gradients
- **Animations**: Smooth fade-in transitions and hover effects

## 🧪 Testing

### Run Tests Locally

```bash
# Run all Playwright tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode
npm run test:headed
```

### Test Coverage

- Homepage loading and navigation
- Authentication flow
- Event browsing and details
- Registration form validation
- Admin dashboard access control
- Event creation and management

### Setting Up Test Admin

For full test coverage, set up test credentials:

1. Create a test admin user in Supabase
2. Add to GitHub Secrets (for CI) or `.env.local` (for local testing):

```env
TEST_ADMIN_EMAIL=test@example.com
TEST_ADMIN_PASSWORD=your-test-password
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Connect to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel will auto-detect Next.js

3. **Set Environment Variables**

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_ZELLE_EMAIL
NEXT_PUBLIC_ZELLE_PHONE (optional)
NEXT_PUBLIC_SITE_URL
```

4. **Deploy**

Vercel will automatically deploy on every push to `main` branch.

### Preview Deployments

- Every pull request gets an automatic preview deployment
- Perfect for testing changes before merging
- GitHub Actions will comment on PRs with preview URL

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

1. **Install dependencies**
2. **Type check** with TypeScript
3. **Lint** with ESLint
4. **Build** the application
5. **Run Playwright tests**
6. **Upload test results** as artifacts
7. **Comment on PR** with preview deployment info

### GitHub Secrets Required

Add these to your GitHub repository secrets:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
TEST_ADMIN_EMAIL
TEST_ADMIN_PASSWORD
```

## 📝 Usage Guide

### For Administrators

1. **Login**: Navigate to `/login` and sign in with your admin credentials
2. **Create Event**: Click "Create Event" and fill in the event details
3. **Manage Registrations**: Click "Manage" on any event to see registrations
4. **Track Payments**: Mark registrations as "Paid" when payment is confirmed
5. **Edit Events**: Update event details using the "Edit" button

### For Attendees

1. **Browse Events**: Visit the homepage to see upcoming events
2. **View Details**: Click on any event to see full details
3. **Register**: Click "Register Now" and fill in your information
4. **Pay via Zelle**: Follow the payment instructions on the success page
5. **Include Memo**: Always include the provided memo in your Zelle payment

## 🔐 Security

- All routes are protected with Supabase RLS policies
- Admin routes check for admin role before rendering
- Server actions verify user permissions
- Sensitive data is never exposed to the client
- Environment variables are properly scoped

## 🐛 Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and keys in `.env.local`
- Check if RLS policies are properly set up
- Ensure migrations have been run

### Admin Access Issues

- Verify your user's role is set to 'admin' in the profiles table
- Check if the user is properly authenticated
- Try logging out and back in

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

## 📦 Project Structure

```
whisky_club/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin dashboard pages
│   ├── event/[id]/          # Event detail pages
│   ├── register/[id]/       # Registration pages
│   ├── success/[id]/        # Success/payment instructions
│   ├── login/               # Login page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # ShadCN UI components
│   ├── header.tsx           # Site header
│   └── event-card.tsx       # Event card component
├── lib/                     # Utility functions
│   ├── actions/             # Server actions
│   ├── supabase/            # Supabase clients
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Helper functions
├── supabase/                # Database
│   └── migrations/          # SQL migration files
├── tests/                   # Playwright tests
├── .github/workflows/       # CI/CD workflows
└── public/                  # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspired by [Virtual Whisky Club](https://virtualwhiskyclub.lovable.app/)
- Built with [Next.js](https://nextjs.org/)
- UI components from [ShadCN UI](https://ui.shadcn.com/)
- Hosted on [Vercel](https://vercel.com/)
- Database by [Supabase](https://supabase.com/)

## 📧 Support

For support, email admin@whiskyclub.com or open an issue in the GitHub repository.

---

Made with ❤️ and 🥃 for whisky enthusiasts everywhere.

