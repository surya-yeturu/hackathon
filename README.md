# PULSEVO - Team Productivity Dashboard

A full-stack real-time dashboard that provides a consolidated view of team performance metrics from multiple collaboration tools (GitHub, Trello) with AI-powered insights.

## 📁 Project Structure

```
hackathon/
├── frontend/          # React + TypeScript frontend application
│   ├── src/          # Source code
│   ├── package.json  # Frontend dependencies
│   └── ...
│
├── backend/          # Node.js + Express backend API
│   ├── services/     # Business logic services
│   ├── routes/       # API routes
│   ├── models/       # Database models
│   ├── config/       # Configuration files
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
│
├── API_KEYS_GUIDE.md      # Detailed API keys setup guide
└── PROJECT_SUMMARY.md     # Complete project overview
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Redis (optional - falls back to in-memory cache)
- API Keys:
  - GitHub Personal Access Token
  - Trello API Key & Token
  - OpenAI API Key (optional)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
npm run create-env
# OR manually create .env file (see backend/.env.example)

# Edit .env and add your API keys
# See API_KEYS_GUIDE.md for detailed instructions

# Start MongoDB (if using local)
mongod

# Start Redis (optional)
redis-server

# Start backend server
npm run dev
```

Backend will run on `http://localhost:8080`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Open Browser

Navigate to `http://localhost:3000` to see the dashboard!

## 📚 Documentation

### Frontend
- `frontend/README.md` - Complete frontend documentation
- `frontend/QUICKSTART.md` - Frontend quick start guide

### Backend
- `backend/README.md` - Complete backend documentation
- `backend/SETUP_GUIDE.md` - Step-by-step backend setup
- `backend/QUICK_START.md` - Backend quick start guide

### API Keys
- `API_KEYS_GUIDE.md` - Detailed guide for getting all API keys

### Project Overview
- `PROJECT_SUMMARY.md` - Complete project summary and architecture

## 🔑 Required API Keys

### 1. GitHub Personal Access Token ⭐ REQUIRED
- **Get from:** https://github.com/settings/tokens
- **Scopes:** `repo`, `read:org`, `read:user`
- **Format:** `ghp_xxxxxxxxxxxxx`

### 2. Trello API Key & Token ⭐ REQUIRED
- **Get from:** https://trello.com/app-key
- **Need both:** API Key and Token

### 3. OpenAI API Key ⚠️ OPTIONAL
- **Get from:** https://platform.openai.com/api-keys
- **Format:** `sk-xxxxxxxxxxxxx`
- **Note:** App works without it (uses fallback)

See `API_KEYS_GUIDE.md` for detailed instructions.

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- React Router
- WebSocket client

### Backend
- Node.js + Express
- MongoDB
- Redis (with in-memory fallback)
- WebSocket (ws)
- OpenAI API
- GitHub API
- Trello API

## ✨ Features

- **Real-time Dashboard** - Live metrics updates via WebSocket
- **Task Management** - Track tasks from GitHub and Trello
- **AI Insights** - Predictive analytics and summaries
- **Natural Language Queries** - Ask questions in plain English
- **Team Benchmarking** - Compare team performance
- **Multiple Integrations** - GitHub, Trello support
- **Dark Theme UI** - Modern, minimal design

## 📡 API Endpoints

### Backend API (http://localhost:8080)

- `GET /api/metrics` - Dashboard metrics
- `GET /api/tasks` - List tasks
- `POST /api/config` - Save API keys
- `POST /api/sync/github` - Sync GitHub
- `POST /api/sync/trello` - Sync Trello
- `POST /api/ai/query` - Natural language query
- `GET /api/ai/insights` - AI insights

### WebSocket (ws://localhost:8080/ws)

- Real-time metrics updates
- Task updates
- AI insights

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-reload with nodemon
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

## 🏗️ Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Backend
```bash
cd backend
npm start
# Or use PM2: pm2 start server.js
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 8080 is available

### Frontend won't start
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check port 3000 is available

### WebSocket not connecting
- Ensure backend is running
- Check WebSocket URL in frontend code
- Verify CORS settings

### No data showing
- Check API keys are configured in backend
- Trigger manual sync: `POST /api/sync/github`
- Check MongoDB has data

## 📖 Next Steps

1. **Get API Keys** - See `API_KEYS_GUIDE.md`
2. **Set up Databases** - MongoDB + optional Redis
3. **Configure Backend** - Edit `backend/.env`
4. **Start Backend** - `cd backend && npm run dev`
5. **Start Frontend** - `cd frontend && npm run dev`
6. **Configure API Keys** - Use Settings page in frontend
7. **Watch Data Sync** - Real-time updates via WebSocket!

## 📝 License

This project is part of a hackathon submission.

## 🤝 Support

For detailed help:
- **Backend setup:** `backend/SETUP_GUIDE.md`
- **API keys:** `API_KEYS_GUIDE.md`
- **Backend docs:** `backend/README.md`
- **Frontend docs:** `frontend/README.md`

---

**Happy Coding! 🚀**
