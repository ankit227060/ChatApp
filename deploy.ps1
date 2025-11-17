# 🚀 Deploy ChatApp to Vercel

Write-Host "🚀 Deploying ChatApp to Vercel..." -ForegroundColor Green
Write-Host ""

# Check if vercel is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "📦 Step 1: Deploy Backend..." -ForegroundColor Blue
Set-Location server
Write-Host "Deploying backend from $PWD" -ForegroundColor Gray
vercel --prod --yes

Write-Host ""
Write-Host "🎨 Step 2: Deploy Frontend..." -ForegroundColor Blue
Set-Location ../client
Write-Host "Deploying frontend from $PWD" -ForegroundColor Gray
vercel --prod --yes

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs:" -ForegroundColor Cyan
Write-Host "Backend: Check Vercel dashboard for backend URL"
Write-Host "Frontend: Check Vercel dashboard for frontend URL"
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update backend CLIENT_BASE_URL with frontend URL"
Write-Host "2. Update frontend VITE_SERVER_BASE_URL with backend URL"
Write-Host "3. Test the application"