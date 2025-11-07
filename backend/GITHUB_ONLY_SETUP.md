# GitHub-Only Setup Guide

This guide shows how to set up PULSEVO using only GitHub (Trello is optional).

## Step 1: Get GitHub Token ⭐ REQUIRED

1. Go to: https://github.com/settings/tokens
2. Click: **"Generate new token (classic)"**
3. Fill in:
   - **Note:** `PULSEVO Dashboard`
   - **Expiration:** 90 days (or your preference)
   - **Scopes:** Check these:
     - ✅ `repo` - Full control of private repositories
     - ✅ `read:org` - Read org and team membership
     - ✅ `read:user` - Read user profile data
4. Click: **"Generate token"**
5. **COPY THE TOKEN** (starts with `ghp_`)
   - ⚠️ You can only see it once!

---

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended - Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a **free cluster** (M0 - 512MB)
4. Create database user:
   - Username: `pulsevo` (or your choice)
   - Password: Create a strong password
5. Whitelist IP:
   - Click "Network Access"
   - Add IP: `0.0.0.0/0` (for development) or your specific IP
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/pulsevo`

### Option B: Local MongoDB

1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   mongod
   ```
4. Use default connection: `mongodb://localhost:27017/pulsevo`

---

## Step 3: Edit .env File

Open `backend/.env` and set these values:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsevo
# OR for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/pulsevo

# Redis Configuration (Optional - can skip)
REDIS_HOST=localhost
REDIS_PORT=6379

# GitHub Token - REQUIRED
GITHUB_TOKEN=ghp_paste_your_token_here

# Trello API Configuration - OPTIONAL (leave empty if not using)
TRELLO_API_KEY=
TRELLO_TOKEN=

# OpenAI API Key (Optional - for AI features)
OPENAI_API_KEY=sk-your_openai_api_key_here

# JWT Secret (any random string)
JWT_SECRET=your_random_secret_key_here

# Data Refresh Intervals
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
```

**Important:** 
- Set `GITHUB_TOKEN` with your token
- Leave `TRELLO_API_KEY` and `TRELLO_TOKEN` empty (or remove those lines)
- Set `MONGODB_URI` with your MongoDB connection string

---

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected
✅ Redis connected (or in-memory cache)
✅ Data sync started
🚀 Server running on http://localhost:8080
📡 WebSocket server running on ws://localhost:8080/ws
```

**Note:** If you see "Trello sync skipped" messages, that's normal - Trello is optional.

---

## Step 5: Configure GitHub in Frontend

1. Open frontend: http://localhost:3000
2. Go to **Settings** page
3. Enter your **GitHub Token**
4. Leave Trello fields **empty** (or skip them)
5. Click **"Save API Keys"**

---

## Step 6: Verify It Works

### Test 1: Health Check
Open: http://localhost:8080/health
Should show: `{"status":"ok",...}`

### Test 2: Get Metrics
Open: http://localhost:8080/api/metrics
Should return dashboard metrics

### Test 3: Check Frontend
- Should show "Connected" instead of "Disconnected"
- Overview page should show metrics
- Tasks page should show GitHub issues

### Test 4: Manual GitHub Sync
```bash
curl -X POST http://localhost:8080/api/sync/github
```

---

## How It Works

- **GitHub Integration:** Fetches issues and pull requests from your GitHub repositories
- **Trello Integration:** Skipped (optional, not required)
- **Data Sync:** Automatically syncs GitHub data every 5 minutes
- **Real-time Updates:** WebSocket pushes updates to frontend

---

## Troubleshooting

### "GitHub token not configured"
- Make sure you added the token to `.env` file
- Or configure it via Settings page in frontend

### "No data showing"
- Trigger manual sync: `POST /api/sync/github`
- Check GitHub token has correct scopes
- Verify repositories are accessible

### "MongoDB connection error"
- Check MongoDB is running (if local)
- Verify connection string in `.env`
- For Atlas: Check IP whitelist

---

## What Gets Synced from GitHub

- **Issues:** All open and closed issues
- **Pull Requests:** Treated as tasks
- **Assignees:** Team members from issue assignments
- **Labels:** Used for categorization
- **Projects:** Organized by repository name

---

## Next Steps

1. **Add GitHub Repositories:**
   - The app will automatically fetch from all your accessible repositories
   - Or specify repos in the sync request

2. **View Dashboard:**
   - Open http://localhost:3000
   - See real-time metrics
   - Track team productivity

3. **Configure Notifications:**
   - Go to Settings page
   - Toggle notification preferences

---

## Summary

✅ **Required:**
- GitHub Personal Access Token
- MongoDB (Atlas or local)

❌ **Optional:**
- Trello (can be skipped)
- Redis (uses in-memory cache if not available)
- OpenAI (uses fallback responses if not available)

That's it! You can now use PULSEVO with just GitHub integration.

