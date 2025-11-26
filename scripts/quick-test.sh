#!/bin/bash

# Quick Test Script - Run basic checks

set -e

echo "🧪 Whisky Nights Club - Quick Test"
echo "=================================="
echo ""

cd "$(dirname "$0")/.."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Check environment variables
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found!"
    echo "   Run: cp .env.example .env.local"
    echo "   Then edit it with your Supabase credentials"
    exit 1
fi

echo "✅ .env.local exists"
echo ""

# Type check
echo "🔍 Running TypeScript check..."
npx tsc --noEmit && echo "✅ TypeScript check passed" || echo "❌ TypeScript errors found"
echo ""

# Lint check
echo "🔍 Running ESLint..."
npm run lint && echo "✅ Linting passed" || echo "❌ Linting errors found"
echo ""

# Build check
echo "🏗️  Building application..."
npm run build && echo "✅ Build successful" || echo "❌ Build failed"
echo ""

echo "🎉 Pre-flight checks complete!"
echo ""
echo "Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Run tests: npm run test"
echo ""
echo "See TESTING_GUIDE.md for complete testing instructions"

