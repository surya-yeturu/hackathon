# PULSEVO - Complete Project Summary

## Overview

PULSEVO is a full-stack Team Productivity Dashboard that provides real-time, consolidated views of team performance metrics from multiple collaboration tools (GitHub, Trello) with AI-powered insights.

## Project Structure

```
hackathon/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   │   ├── charts/   # Chart components
│   │   │   ├── KPICard.tsx
│   │   │   └── Layout.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── Overview.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── AIInsights.tsx
│   │   │   ├── Query.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/     # WebSocket client, mock data
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── backend/              # Node.js + Express backend
│   ├── config/           # Database & Redis config
│   │   ├── database.js
│   │   └── redis.js
│   ├── models/           # MongoDB models
│   │   ├── Task.js
│   │   ├── TeamMember.js
│   │   └── Config.js
│   ├── routes/           # API routes
│   │   └── api.js
│   ├── services/         # Business logic
│   │   ├── websocketService.js
│   │   ├── githubService.js
│   │   ├── trelloService.js
│   │   ├── aiService.js
│   │   ├── metricsService.js
│   │   └── dataSync.js
│   ├── server.js         # Main server file
│   └── package.json
│
├── README.md             # Main project README
├── API_KEYS_GUIDE.md     # API keys setup guide
└── PROJECT_SUMMARY.md    # This file
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **WebSocket** for real-time updates

### Backend
- **Node.js** with Express
- **MongoDB** for data persistence
- **Redis** for caching (with in-memory fallback)
- **WebSocket (ws)** for real-time communication
- **OpenAI API** for AI features
- **Axios** for HTTP requests
- **node-cron** for scheduled tasks

## Features

### 1. Real-time Dashboard
- Live metrics updates via WebSocket
- KPI cards with trend indicators
- Multiple chart types (donut, line, bar, bubble)
- 7-day trend analysis
- Team performance visualization

### 2. Task Management
- Searchable team member table
- Task filtering and pagination
- Project-based task distribution
- Open issues tracking

### 3. AI Insights
- AI-powered summaries
- Predictive analytics
- Team benchmarking
- Communication sentiment analysis
- Natural language queries

### 4. API Integrations
- **GitHub**: Fetch issues and PRs
- **Trello**: Fetch cards and boards
- Automatic synchronization every 5 minutes
- Manual sync triggers

### 5. Settings
- API key configuration
- Notification preferences
- Secure credential storage

## Required API Keys

### 1. GitHub Personal Access Token ⭐ REQUIRED
- **Get from:** https://github.com/settings/tokens
- **Scopes needed:** `repo`, `read:org`, `read:user`
- **Format:** `ghp_xxxxxxxxxxxxx`

### 2. Trello API Key & Token ⭐ REQUIRED
- **Get from:** https://trello.com/app-key
- **Format:** API Key + Token (both required)

### 3. OpenAI API Key ⚠️ OPTIONAL
- **Get from:** https://platform.openai.com/api-keys
- **Format:** `sk-xxxxxxxxxxxxx`
- **Note:** App works without it (uses fallback)

## Setup Instructions

### Backend Setup

1. **Navigate to backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
npm run create-env
# OR manually create .env file
```

4. **Edit .env and add your API keys:**
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/pulsevo
GITHUB_TOKEN=your_token_here
TRELLO_API_KEY=your_key_here
TRELLO_TOKEN=your_token_here
OPENAI_API_KEY=your_key_here
```

5. **Start MongoDB** (or use MongoDB Atlas)

6. **Start server:**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start dev server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:3000
```

## API Endpoints

### Metrics
- `GET /api/metrics` - Dashboard metrics

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `DELETE /api/tasks/:id` - Delete task

### Configuration
- `GET /api/config` - Get config
- `POST /api/config` - Save API keys

### Sync
- `POST /api/sync/github` - Sync GitHub
- `POST /api/sync/trello` - Sync Trello

### AI
- `POST /api/ai/query` - Natural language query
- `GET /api/ai/insights` - AI insights

## WebSocket

- **URL:** `ws://localhost:8080/ws`
- **Message Types:**
  - `metrics_update` - Dashboard metrics
  - `task_update` - Task changes
  - `ai_insight` - AI insights
  - `error` - Error messages

## Data Flow

1. **Backend fetches data** from GitHub/Trello APIs
2. **Data is normalized** and stored in MongoDB
3. **Metrics are calculated** and cached in Redis
4. **WebSocket broadcasts** updates to connected clients
5. **Frontend receives** updates and re-renders

## Automated Sync

- **GitHub:** Every 5 minutes
- **Trello:** Every 5 minutes
- **Metrics:** Every 1 minute
- **AI Insights:** Every 10 minutes

## Documentation Files

- `backend/README.md` - Backend documentation
- `backend/SETUP_GUIDE.md` - Complete setup guide
- `backend/QUICK_START.md` - Quick start guide
- `API_KEYS_GUIDE.md` - API keys setup
- `README.md` - Frontend documentation
- `QUICKSTART.md` - Frontend quick start

## Development

### Backend
```bash
cd backend
npm run dev  # Auto-reload with nodemon
```

### Frontend
```bash
npm run dev  # Vite dev server
```

## Production Build

### Frontend
```bash
npm run build
# Output in dist/
```

### Backend
```bash
npm start
# Or use PM2: pm2 start server.js
```

## Environment Variables

### Backend (.env)
```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pulsevo
REDIS_HOST=localhost
REDIS_PORT=6379
GITHUB_TOKEN=ghp_xxx
TRELLO_API_KEY=xxx
TRELLO_TOKEN=xxx
OPENAI_API_KEY=sk-xxx
JWT_SECRET=xxx
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists
- Check port 8080 is available

### WebSocket not connecting
- Ensure backend is running
- Check WebSocket URL in frontend
- Verify CORS settings

### No data showing
- Check API keys are configured
- Trigger manual sync: `POST /api/sync/github`
- Check MongoDB has data

### AI features not working
- Verify OpenAI API key
- Check account has credits
- App works without it (fallback mode)

## Next Steps

1. **Get API keys** (see API_KEYS_GUIDE.md)
2. **Set up databases** (MongoDB + optional Redis)
3. **Configure .env** file
4. **Start backend** server
5. **Start frontend** dev server
6. **Configure API keys** in Settings page
7. **Watch data sync** in real-time!

## Support

For detailed help:
- Backend setup: `backend/SETUP_GUIDE.md`
- API keys: `API_KEYS_GUIDE.md`
- Backend docs: `backend/README.md`
- Frontend docs: `README.md`

