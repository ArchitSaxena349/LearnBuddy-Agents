# LearnBuddy Startup Script (PowerShell)
# This script helps you start both frontend and backend services

Write-Host "🚀 Starting LearnBuddy Platform..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python is not installed. Please install Python first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green
Write-Host ""

# Check if .env files exist
if (-not (Test-Path "LearningBuddy\.env")) {
    Write-Host "⚠️  Warning: LearningBuddy\.env not found" -ForegroundColor Yellow
    Write-Host "   Create it with VITE_GEMINI_API_KEY and VITE_BACKEND_URL" -ForegroundColor Yellow
}

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Warning: backend\.env not found" -ForegroundColor Yellow
    Write-Host "   Create it with GROQ_API_KEY and OPENAI_API_KEY" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Cyan

# Install frontend dependencies if node_modules doesn't exist
if (-not (Test-Path "LearningBuddy\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location LearningBuddy
    npm install
    Set-Location ..
}

# Install root dependencies (concurrently) if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing root dependencies (concurrently)..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "🎯 Starting services..." -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Services Starting:" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  📡 Backend API:    http://localhost:8000" -ForegroundColor Cyan
Write-Host "  🌐 Frontend UI:    http://localhost:5173" -ForegroundColor Cyan
Write-Host "  📚 API Docs:       http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Start both services using concurrently (if installed) or sequentially
if (Test-Path "node_modules\concurrently") {
    npm run dev
} else {
    Write-Host "Concurrently not found. Starting services in separate windows..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opening backend..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; python -m uvicorn main:app --reload --port 8000"
    Start-Sleep -Seconds 2
    Write-Host "Opening frontend..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\LearningBuddy'; npm run dev"
}

