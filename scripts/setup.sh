#!/bin/bash

# Whisky Nights Club - Setup Script
# This script helps you set up the project quickly

set -e

echo "🥃 Whisky Nights Club - Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - NEXT_PUBLIC_ZELLE_EMAIL"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript..."
npx tsc --noEmit && echo "✅ TypeScript check passed!" || echo "⚠️  TypeScript errors found"
echo ""

# Run linter
echo "🔍 Running linter..."
npm run lint && echo "✅ Linting passed!" || echo "⚠️  Linting errors found"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project (see DEPLOYMENT.md)"
echo "2. Update .env.local with your Supabase credentials"
echo "3. Run database migrations in Supabase SQL Editor"
echo "4. Create your admin user"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed instructions, see:"
echo "  - SETUP.md (quick start)"
echo "  - DEPLOYMENT.md (full deployment guide)"
echo "  - README.md (comprehensive documentation)"
echo ""
echo "Happy coding! 🥃"

