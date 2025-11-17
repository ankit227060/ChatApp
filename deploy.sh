#!/bin/bash

echo "🚀 Deploying ChatApp to Vercel..."
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📦 Step 1: Deploy Backend..."
cd server
echo "Deploying backend from $(pwd)"
vercel --prod --yes

echo ""
echo "🎨 Step 2: Deploy Frontend..."
cd ../client
echo "Deploying frontend from $(pwd)"
vercel --prod --yes

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🔗 URLs:"
echo "Backend: Check Vercel dashboard for backend URL"
echo "Frontend: Check Vercel dashboard for frontend URL"
echo ""
echo "📋 Next Steps:"
echo "1. Update backend CLIENT_BASE_URL with frontend URL"
echo "2. Update frontend VITE_SERVER_BASE_URL with backend URL"
echo "3. Test the application"