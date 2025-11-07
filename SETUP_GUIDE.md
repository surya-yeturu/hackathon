# Complete Setup Guide

This guide will walk you through setting up the entire backend from scratch.

## Step 1: Install Prerequisites

### Node.js
1. Download from https://nodejs.org/ (v18 or higher)
2. Verify installation:
```bash
node --version
npm --version
```

### MongoDB
**Option A: Local Installation**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Verify: `mongod --version`

**Option B: MongoDB Atlas (Recommended for beginners)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster (M0)
4. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/pulsevo`)

### Redis (Optional)
**Option A: Local Installation**
1. Download from https://redis.io/download
2. Start Redis: `redis-server`
3. Verify: `redis-cli ping` (should return PONG)

**Option B: Skip Redis**
- The app will work without Redis using in-memory cache
- Just don't set Redis variables in `.env`

## Step 2: Get API Keys

### GitHub Token (Required for GitHub integration)

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Your Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click "Generate new token (classic)"
   - Name: `PULSEVO Dashboard`
   - Expiration: Choose based on your needs (90 days recommended)

3. **Select Scopes** (check these boxes):
   - ✅ `repo` - Full control of private repositories
   - ✅ `read:org` - Read org and team membership
   - ✅ `read:user` - Read user profile data

4. **Generate and Copy**
   - Click "Generate token"
   - **IMPORTANT:** Copy the token immediately (starts with `ghp_`)
   - You won't be able to see it again!

### Trello API Key & Token (Required for Trello integration)

1. **Get API Key**
   - Visit: https://trello.com/app-key
   - Your API Key is displayed on this page
   - Copy it

2. **Get Token**
   - On the same page, scroll down
   - Click the "Token" link
   - Authorize the application
   - Copy the token (long string)

### OpenAI API Key (Optional - for AI features)

1. **Sign Up**
   - Go to https://platform.openai.com/signup
   - Create account (requires credit card for paid tier)

2. **Get API Key**
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: `PULSEVO`
   - Copy the key (starts with `sk-`)

**Note:** OpenAI has a free tier with limited credits. You can use the app without it, but AI features will use simpler fallback responses.

## Step 3: Configure Backend

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

4. **Edit .env file** with your values:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/pulsevo

# OR for MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsevo

# Redis (Optional - leave empty if not using Redis)
REDIS_HOST=localhost
REDIS_PORT=6379
# OR use full URL:
# REDIS_URL=redis://localhost:6379

# API Keys - ADD YOUR KEYS HERE
GITHUB_TOKEN=ghp_paste_your_github_token_here
TRELLO_API_KEY=paste_your_trello_api_key_here
TRELLO_TOKEN=paste_your_trello_token_here
OPENAI_API_KEY=sk-paste_your_openai_key_here

# JWT Secret (generate a random string)
JWT_SECRET=your_random_secret_here_make_it_long_and_random

# Refresh Intervals (in seconds)
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
```

## Step 4: Start the Server

1. **Start MongoDB** (if using local):
```bash
# Windows
net start MongoDB

# Mac/Linux
mongod
```

2. **Start Redis** (if using, optional):
```bash
redis-server
```

3. **Start the backend server**:
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
✅ Redis connected (or in-memory cache if Redis unavailable)
✅ Data sync started
🚀 Server running on http://localhost:8080
📡 WebSocket server running on ws://localhost:8080/ws
```

## Step 5: Verify Setup

1. **Test Health Endpoint**
```bash
curl http://localhost:8080/health
```
Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Metrics Endpoint**
```bash
curl http://localhost:8080/api/metrics
```
Should return dashboard metrics (may be empty initially)

3. **Test WebSocket** (using browser console or WebSocket client)
```javascript
const ws = new WebSocket('ws://localhost:8080/ws');
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```

## Step 6: Configure API Keys via API

You can also set API keys via the API instead of .env:

```bash
# Set GitHub token
curl -X POST http://localhost:8080/api/config \
  -H "Content-Type: application/json" \
  -d '{"githubToken": "ghp_your_token_here"}'

# Set Trello credentials
curl -X POST http://localhost:8080/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "trelloApiKey": "your_api_key",
    "trelloToken": "your_token"
  }'
```

## Step 7: Sync Data

Once API keys are configured, trigger a sync:

```bash
# Sync GitHub
curl -X POST http://localhost:8080/api/sync/github

# Sync Trello
curl -X POST http://localhost:8080/api/sync/trello
```

Data will also sync automatically every 5 minutes.

## Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:**
- Check MongoDB is running
- Verify connection string in `.env`
- For Atlas: Check IP whitelist and credentials

### Issue: "Redis connection error"
**Solution:**
- This is OK! App will use in-memory cache
- To fix: Start Redis server or remove Redis config

### Issue: "GitHub API rate limit"
**Solution:**
- Wait a few minutes
- Use authenticated requests (token helps with rate limits)
- Reduce sync frequency

### Issue: "Trello authentication failed"
**Solution:**
- Verify API key and token are correct
- Check token hasn't expired
- Re-generate token if needed

### Issue: "OpenAI API error"
**Solution:**
- Check API key is correct
- Verify account has credits
- App will work without it (uses fallback)

### Issue: "Port already in use"
**Solution:**
- Change PORT in `.env` to another port (e.g., 8081)
- Or stop the process using port 8080

## Next Steps

1. **Start the frontend** (in another terminal):
```bash
cd ..  # Go back to root
npm run dev  # Start frontend
```

2. **Open browser**: http://localhost:3000

3. **Configure API keys** in the Settings page of the frontend

4. **Watch data sync** in real-time via WebSocket!

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas
3. Use Redis Cloud or similar
4. Set up environment variables on hosting platform
5. Use PM2 for process management
6. Set up HTTPS
7. Implement authentication

## Need Help?

- Check server logs for detailed error messages
- Verify all API keys are correct
- Ensure databases are accessible
- Check network/firewall settings

