# LearnBuddy - AI-Powered Learning Platform

LearnBuddy is a comprehensive EdTech platform that redefines digital learning using AI personalization, gamification, and augmented reality (AR). The platform addresses key challenges in traditional education such as rigid learning paths, low engagement, lack of emotional support, and limited hands-on experiences.

## 🚀 Features

- **AI-Personalized Learning Paths**: Customized learning experiences tailored to each student
- **Gamified Learning**: Quests with badges, leaderboards, and interactive challenges
- **Emotionally Aware Chatbots**: Mental health support leveraging Gemini API
- **AR Expeditions**: Virtual labs and historical reenactments using WebGL
- **3D Visualizations**: Interactive 3D models for enhanced learning experiences

## 📁 Project Structure

The project is organized with **separate frontend and backend** directories that can be run independently or together:

```
LearnBuddy/
├── frontend/           # Frontend: React application (standalone)
│   ├── src/                 #   - Can run independently
│   ├── package.json         #   - Own dependencies
│   └── .env                 #   - Own environment config
│
├── backend/                 # Backend: FastAPI application (standalone)
│   ├── main.py             #   - Can run independently
│   ├── requirements.txt    #   - Own dependencies
│   └── .env                #   - Own environment config
│
├── package.json            # Root: Scripts to run both together
├── start.ps1               # Windows: Startup script
└── start.sh                # Linux/Mac: Startup script
```

**Key Points:**
- ✅ Frontend and backend are **completely separate**
- ✅ Each has its own dependencies and configuration
- ✅ Can be run **independently** or **together**
- ✅ Root scripts allow running both with one command

## 🛠️ Technology Stack

- **Frontend**: React.js + Vite, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **AI/ML**: Google Gemini API, Groq API, OpenAI API
- **3D/AR**: Three.js, React Three Fiber, @react-three/drei, WebXR, Sketchfab
- **Database**: MongoDB (planned)

## 📦 Installation & Setup

### Step 1: Install Dependencies

**Root (for running both together):**
```bash
npm install
```

**Frontend (separate - can be run independently):**
```bash
cd frontend
npm install
cd ..
```

**Backend (separate - can be run independently):**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Step 2: Configure Environment Variables

**Frontend (`frontend/.env`):**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_BACKEND_URL=http://localhost:8000
```

**Backend (`backend/.env`):**
```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Running the Application

### Option 1: Run Both Together (Recommended for Development)

**Using npm script:**
```bash
npm run dev
```

**Using startup scripts:**
- **Windows:** `.\start.ps1`
- **Linux/Mac:** `chmod +x start.sh && ./start.sh`

This will start both frontend (port 5173) and backend (port 8000) simultaneously.

### Option 2: Run Separately

**Frontend only:**
```bash
cd frontend
npm run dev
```
Access at: http://localhost:5173

**Backend only:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```
Access at: http://localhost:8000

## 📍 Access Points

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔑 Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_BACKEND_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

> **Note:** Both frontend and backend have separate `.env` files with their own configurations.

## 📖 Documentation

- **Quick Start**: See above installation steps
- **Running Guide**: See [RUN.md](RUN.md) for detailed run instructions
- **API Documentation**: Available at http://localhost:8000/docs when backend is running

## 🎯 API Endpoints

### Backend API (FastAPI)

- `GET /` - Welcome message
- `POST /planner` - Generate personalized learning plans
- `POST /subject` - Get subject explanations
- `POST /feedback` - Receive feedback on student responses
- `POST /motivation` - Get motivational messages based on mood
- `POST /api/ar/generate` - Generate 3D model URLs based on text prompts
  - Request: `{ "prompt": "human heart" }`
  - Response: `{ "modelUrl": "https://models.readyplayer.me/...", "keyword": "..." }`

## 📝 License

ISC

## 👥 Contributors

Archit Saxena
