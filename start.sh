#!/bin/bash
# LearnBuddy Startup Script (Linux/Mac)
# This script helps you start both frontend and backend services

echo "🚀 Starting LearnBuddy Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Check if .env files exist
if [ ! -f "LearningBuddy/.env" ]; then
    echo "⚠️  Warning: LearningBuddy/.env not found"
    echo "   Create it with VITE_GEMINI_API_KEY and VITE_BACKEND_URL"
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "   Create it with GROQ_API_KEY and OPENAI_API_KEY"
fi

echo ""
echo "📦 Installing dependencies (if needed)..."

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "LearningBuddy/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd LearningBuddy
    npm install
    cd ..
fi

# Install root dependencies (concurrently) if needed
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies (concurrently)..."
    npm install
fi

echo ""
echo "🎯 Starting services..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Services Starting:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📡 Backend API:    http://localhost:8000"
echo "  🌐 Frontend UI:    http://localhost:5173"
echo "  📚 API Docs:       http://localhost:8000/docs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Determine Python command
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

# Start both services using concurrently (if installed) or with & background
if [ -d "node_modules/concurrently" ]; then
    npm run dev
else
    echo "Concurrently not found. Starting services..."
    echo "Backend starting..."
    cd backend && $PYTHON_CMD -m uvicorn main:app --reload --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    sleep 2
    
    echo "Frontend starting..."
    cd LearningBuddy && npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "Services started!"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo ""
    echo "To stop, run: kill $BACKEND_PID $FRONTEND_PID"
    
    # Wait for user interrupt
    wait
fi

