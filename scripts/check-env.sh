#!/bin/bash

# Check if required environment variables are set

echo "🔍 Checking environment variables..."
echo ""

MISSING=0

# Required variables
REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_ZELLE_EMAIL"
)

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "   Run: cp .env.example .env.local"
    exit 1
fi

# Load .env.local
set -a
source .env.local
set +a

# Check each required variable
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var is not set"
        MISSING=1
    else
        # Show partial value for security
        value="${!var}"
        if [ ${#value} -gt 20 ]; then
            echo "✅ $var is set (${value:0:10}...${value: -5})"
        else
            echo "✅ $var is set"
        fi
    fi
done

echo ""

if [ $MISSING -eq 1 ]; then
    echo "❌ Some required environment variables are missing!"
    echo "   Please update your .env.local file."
    exit 1
else
    echo "✅ All required environment variables are set!"
    exit 0
fi

