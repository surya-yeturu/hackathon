# Quick Start Guide - Frontend

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:3000`

## WebSocket Connection

The app will attempt to connect to a WebSocket server at `ws://localhost:8080/ws`. 

**Note:** If you don't have a backend server running, the app will still work with mock data. You'll see "Disconnected" in the header, but all features will function using the mock data provided.

## Features Overview

### Overview Page
- View real-time KPIs (Open Tasks, In Progress, Closed Today, etc.)
- Task distribution donut chart
- 7-day trend analysis
- Team performance metrics

### Tasks Page
- Search and filter team members
- View task assignments and completion rates
- Project-based task visualization
- Pagination support

### AI Insights Page
- AI-powered summaries and alerts
- Predictive analytics
- Team benchmarking
- Communication sentiment analysis

### Query Page
- Natural language interface
- Ask questions about team productivity
- Real-time AI responses

### Settings Page
- Configure GitHub API token
- Configure Trello API key and token
- Manage notification preferences

## Mock Data

The application includes comprehensive mock data for all features, so you can explore the entire dashboard without a backend connection.

## Troubleshooting

**Port already in use?**
- Change the port in `vite.config.ts` or use `npm run dev -- --port 3001`

**WebSocket connection issues?**
- The app works fine without a backend - it uses mock data
- To connect to a real backend, ensure it's running on `ws://localhost:8080/ws`

**Build errors?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

