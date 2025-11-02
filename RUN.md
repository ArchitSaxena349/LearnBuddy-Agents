# How to Run LearnBuddy

## 🎯 Quick Reference

### Run Both Together
```bash
npm run dev
```

### Run Separately

**Frontend:**
```bash
cd LearningBuddy
npm run dev
```

**Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

---

## 📋 Detailed Instructions

### Running Both Services Together

#### Method 1: npm Script (Easiest)
```bash
# From project root
npm run dev
```

This will:
- Start backend on http://localhost:8000
- Start frontend on http://localhost:5173
- Show output from both in one terminal

#### Method 2: Startup Scripts

**Windows:**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

#### Method 3: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd LearningBuddy
npm run dev
```

---

### Running Separately (Development)

#### Frontend Only

```bash
cd LearningBuddy
npm run dev
```

- Runs on: http://localhost:5173
- Note: Will show connection errors if backend isn't running
- Good for: Frontend-only development

#### Backend Only

```bash
cd backend
uvicorn main:app --reload --port 8000
```

- Runs on: http://localhost:8000
- API docs: http://localhost:8000/docs
- Good for: Testing API endpoints independently

---

### Production Build

**Frontend:**
```bash
cd LearningBuddy
npm run build
```

**Backend:**
```bash
cd backend
# Use production server like gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 🔧 Troubleshooting

### Port Already in Use

**Backend (port 8000):**
```bash
# Change port in package.json or use:
cd backend
uvicorn main:app --reload --port 8001

# Update LearningBuddy/.env:
VITE_BACKEND_URL=http://localhost:8001
```

**Frontend (port 5173):**
- Vite will automatically use next available port
- Check terminal output for actual port

### Services Not Connecting

1. Verify backend is running: Visit http://localhost:8000
2. Check `LearningBuddy/.env` has correct `VITE_BACKEND_URL`
3. Restart frontend after changing environment variables

---

## 📍 Access URLs

When running both services:

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/

---

## 💡 Tips

- Use `npm run dev` for development (auto-reloads both)
- Run separately when you only need to work on one
- Check terminal output for any errors
- Use browser console (F12) to debug frontend
- Use http://localhost:8000/docs to test backend APIs


