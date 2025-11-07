# PULSEVO Backend API

Backend server for the Team Productivity Dashboard with real-time WebSocket updates, GitHub/Trello integration, and AI-powered insights.

## Features

- **Real-time WebSocket Server**: Live updates for dashboard metrics
- **GitHub Integration**: Fetch and sync issues from GitHub repositories
- **Trello Integration**: Fetch and sync cards from Trello boards
- **MongoDB**: Persistent storage for tasks and team data
- **Redis Caching**: Fast data retrieval with caching layer
- **AI Integration**: OpenAI-powered insights, summaries, and natural language queries
- **Automated Sync**: Scheduled data synchronization from external APIs
- **RESTful API**: Complete API for frontend integration

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Redis (optional - falls back to in-memory cache if not available)
- API Keys:
  - GitHub Personal Access Token
  - Trello API Key & Token
  - OpenAI API Key (optional, for AI features)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with the required API keys (see below)

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Environment Configuration

### Required API Keys

#### 1. GitHub Personal Access Token

**How to get:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "PULSEVO Dashboard")
4. Select scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `read:user` (Read user profile data)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)
7. Add to `.env`: `GITHUB_TOKEN=ghp_your_token_here`

**Note:** The token will only be shown once. Save it securely.

#### 2. Trello API Key & Token

**How to get:**
1. Go to https://trello.com/app-key
2. Copy your **API Key** (visible on the page)
3. Scroll down and click "Token" link
4. Authorize the application
5. Copy the **Token** (long string)
6. Add to `.env`:
   ```
   TRELLO_API_KEY=your_api_key_here
   TRELLO_TOKEN=your_token_here
   ```

**Note:** The token gives read access to your Trello boards and cards.

#### 3. OpenAI API Key (Optional - for AI features)

**How to get:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Give it a name (e.g., "PULSEVO")
5. Copy the key (starts with `sk-`)
6. Add to `.env`: `OPENAI_API_KEY=sk-your_key_here`

**Note:** OpenAI API usage is paid. You can use the app without it, but AI features will use fallback responses.

### Database Configuration

#### MongoDB

**Option 1: Local MongoDB**
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use default connection: `mongodb://localhost:27017/pulsevo`

**Option 2: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Add to `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsevo`

#### Redis (Optional)

**Option 1: Local Redis**
1. Install Redis: https://redis.io/download
2. Start Redis server
3. Use default: `localhost:6379`

**Option 2: Redis Cloud**
1. Go to https://redis.com/try-free/
2. Create free instance
3. Get connection URL
4. Add to `.env`: `REDIS_URL=redis://:password@host:port`

**Note:** If Redis is not available, the app will use in-memory caching automatically.

### Complete .env Example

```env
# Server
PORT=8080
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/pulsevo
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pulsevo

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
# OR use Redis URL:
# REDIS_URL=redis://:password@host:port

# API Keys
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TRELLO_API_KEY=your_trello_api_key
TRELLO_TOKEN=your_trello_token
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT Secret (for future auth features)
JWT_SECRET=your_random_secret_key_here

# Refresh Intervals (seconds)
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
```

## API Endpoints

### Metrics
- `GET /api/metrics` - Get dashboard metrics

### Tasks
- `GET /api/tasks` - Get tasks (with filters)
- `POST /api/tasks` - Create/update task manually
- `DELETE /api/tasks/:id` - Delete task

### Team
- `GET /api/team-members` - Get team member statistics

### Configuration
- `GET /api/config` - Get API configuration
- `POST /api/config` - Save API keys

### Sync
- `POST /api/sync/github` - Manually sync GitHub issues
- `POST /api/sync/trello` - Manually sync Trello cards

### AI
- `POST /api/ai/query` - Natural language query
- `GET /api/ai/insights` - Get AI insights and summaries

## WebSocket

The WebSocket server runs on `ws://localhost:8080/ws`

### Message Types

**Client → Server:**
- `{ type: 'query', question: 'How many tasks are open?' }`
- `{ type: 'ping' }`

**Server → Client:**
- `{ type: 'metrics_update', data: {...}, timestamp: '...' }`
- `{ type: 'task_update', data: {...}, timestamp: '...' }`
- `{ type: 'ai_insight', data: {...}, timestamp: '...' }`
- `{ type: 'error', data: { error: '...' }, timestamp: '...' }`

## Data Synchronization

The backend automatically syncs data on a schedule:
- **GitHub**: Every 5 minutes (configurable)
- **Trello**: Every 5 minutes (configurable)
- **Metrics**: Every 1 minute
- **AI Insights**: Every 10 minutes

You can also trigger manual syncs via API endpoints.

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── redis.js         # Redis connection
├── models/
│   ├── Task.js          # Task model
│   ├── TeamMember.js    # Team member model
│   └── Config.js        # Configuration model
├── routes/
│   └── api.js           # API routes
├── services/
│   ├── websocketService.js  # WebSocket handling
│   ├── githubService.js     # GitHub API integration
│   ├── trelloService.js     # Trello API integration
│   ├── aiService.js         # AI/OpenAI integration
│   ├── metricsService.js    # Metrics calculation
│   └── dataSync.js          # Automated sync
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check service status
- Verify connection string in `.env`
- Check firewall/network settings

### Redis Connection Error
- App will automatically use in-memory cache
- To use Redis: ensure Redis server is running
- Check Redis connection settings

### GitHub API Errors
- Verify token has correct scopes
- Check token hasn't expired
- Ensure repositories are accessible

### Trello API Errors
- Verify API key and token are correct
- Check token hasn't been revoked
- Ensure boards are accessible

### OpenAI API Errors
- Verify API key is correct
- Check account has credits
- App will use fallback responses if unavailable

### WebSocket Not Connecting
- Ensure server is running on correct port
- Check CORS settings
- Verify WebSocket path: `/ws`

## Development

### Running in Development Mode
```bash
npm run dev
```
Uses nodemon for auto-reload on file changes.

### Testing API Endpoints
Use tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example:
```bash
# Get metrics
curl http://localhost:8080/api/metrics

# Save GitHub token
curl -X POST http://localhost:8080/api/config \
  -H "Content-Type: application/json" \
  -d '{"githubToken": "ghp_your_token"}'
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas for database
3. Use Redis Cloud for caching
4. Set up environment variables on hosting platform
5. Use PM2 or similar for process management:
```bash
npm install -g pm2
pm2 start server.js --name pulsevo-backend
```

## Security Notes

- Never commit `.env` file to version control
- Use environment variables in production
- Rotate API keys regularly
- Use HTTPS in production
- Implement authentication for production use

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs for errors

## License

Part of the PULSEVO hackathon project.

