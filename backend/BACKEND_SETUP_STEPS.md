# Backend Setup - Step by Step Guide

Follow these steps to complete the backend setup:

## Step 1: Install Dependencies ✅

```bash
cd backend
npm install
```

**Status:** Dependencies are already installed ✅

---

## Step 2: Create .env File

### Option A: Use the helper script (Recommended)
```bash
cd backend
npm run create-env
```

### Option B: Create manually
Create a file named `.env` in the `backend/` directory with this content:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/pulsevo
# OR for MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsevo

# Redis Configuration (Optional - can skip if not using Redis)
REDIS_HOST=localhost
REDIS_PORT=6379
# OR use Redis URL:
# REDIS_URL=redis://:password@host:port

# API Keys - REQUIRED
# GitHub Personal Access Token
GITHUB_TOKEN=ghp_your_github_token_here

# Trello API Configuration
TRELLO_API_KEY=your_trello_api_key_here
TRELLO_TOKEN=your_trello_token_here

# OpenAI API Key (Optional - for AI features)
OPENAI_API_KEY=sk-your_openai_api_key_here

# JWT Secret (generate a random string)
JWT_SECRET=your_random_secret_key_here

# Data Refresh Intervals (in seconds)
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
```

---

## Step 3: Get API Keys

### 3.1 GitHub Personal Access Token ⭐ REQUIRED

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
6. Add to `.env`: `GITHUB_TOKEN=ghp_paste_your_token_here`

### 3.2 Trello API Key & Token ⭐ REQUIRED

1. Go to: https://trello.com/app-key
2. Your **API Key** is displayed on this page - copy it
3. Scroll down to **"Token"** section
4. Click the link to generate token
5. Authorize the application
6. Copy the **Token** (long string)
7. Add to `.env`:
   ```
   TRELLO_API_KEY=your_api_key_here
   TRELLO_TOKEN=your_token_here
   ```

### 3.3 OpenAI API Key ⚠️ OPTIONAL

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click: **"Create new secret key"**
4. Name it: `PULSEVO`
5. Copy the key (starts with `sk-`)
6. Add to `.env`: `OPENAI_API_KEY=sk-paste_your_key_here`

**Note:** App works without OpenAI (uses fallback responses)

---

## Step 4: Set Up Database

### Option A: MongoDB Atlas (Cloud - Recommended for beginners)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a **free cluster** (M0 - 512MB)
4. Create database user:
   - Username: `pulsevo` (or your choice)
   - Password: Create a strong password
5. Whitelist IP:
   - Click "Network Access"
   - Add IP: `0.0.0.0/0` (for development) or your IP
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/pulsevo`
7. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsevo
   ```

### Option B: Local MongoDB

1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   mongod
   ```
4. Use default connection in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/pulsevo
   ```

### Option C: Skip MongoDB (Not Recommended)

The app will fail to start without MongoDB. You must set up at least one database option.

---

## Step 5: Set Up Redis (Optional)

### Option A: Skip Redis

The app will automatically use in-memory caching if Redis is not available. You can skip this step.

### Option B: Local Redis

1. Download Redis: https://redis.io/download
2. Start Redis:
   ```bash
   redis-server
   ```
3. Use default in `.env`:
   ```
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

### Option C: Redis Cloud

1. Go to: https://redis.com/try-free/
2. Sign up for free account
3. Create free database (30MB)
4. Get connection URL
5. Add to `.env`:
   ```
   REDIS_URL=redis://:password@host:port
   ```

---

## Step 6: Edit .env File

Open `backend/.env` and replace the placeholder values:

```env
# Replace these:
GITHUB_TOKEN=ghp_your_github_token_here          ← Your GitHub token
TRELLO_API_KEY=your_trello_api_key_here          ← Your Trello API key
TRELLO_TOKEN=your_trello_token_here              ← Your Trello token
OPENAI_API_KEY=sk-your_openai_api_key_here       ← Your OpenAI key (optional)
JWT_SECRET=your_random_secret_key_here           ← Any random string
MONGODB_URI=mongodb://localhost:27017/pulsevo    ← Your MongoDB connection
```

---

## Step 7: Start the Backend Server

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

---

## Step 8: Verify Backend is Working

### Test 1: Health Check
Open browser or use curl:
```
http://localhost:8080/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### Test 2: Get Metrics
```
http://localhost:8080/api/metrics
```
Should return dashboard metrics (may be empty initially)

### Test 3: Check WebSocket
The frontend should now show "Connected" instead of "Disconnected"

---

## Troubleshooting

### Error: "MongoDB connection error"
- **Solution:** 
  - Check MongoDB is running (if local)
  - Verify connection string in `.env`
  - For Atlas: Check IP whitelist and credentials

### Error: "Redis connection error"
- **Solution:** This is OK! App will use in-memory cache automatically

### Error: "Port 8080 already in use"
- **Solution:** 
  - Change PORT in `.env` to another port (e.g., 8081)
  - Or stop the process using port 8080

### Error: "GitHub API rate limit"
- **Solution:** 
  - Wait a few minutes
  - Verify token is correct
  - Check token hasn't expired

### Error: "Trello authentication failed"
- **Solution:** 
  - Verify API key and token are correct
  - Re-generate token if needed

---

## Quick Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] GitHub token added to `.env`
- [ ] Trello API key and token added to `.env`
- [ ] OpenAI key added (optional)
- [ ] MongoDB set up (Atlas or local)
- [ ] Redis set up (optional)
- [ ] Backend server starts without errors
- [ ] Health endpoint returns OK
- [ ] Frontend shows "Connected"

---

## Next Steps After Backend is Running

1. **Configure API keys in frontend:**
   - Open http://localhost:3000
   - Go to Settings page
   - Add your API keys
   - Click "Save API Keys"

2. **Trigger data sync:**
   - Use Settings page to save API keys (triggers sync)
   - Or manually: `POST http://localhost:8080/api/sync/github`
   - Or manually: `POST http://localhost:8080/api/sync/trello`

3. **Watch real-time updates:**
   - Data will sync automatically every 5 minutes
   - WebSocket will push updates to frontend
   - Check Overview page for live metrics

---

## Need Help?

- See `backend/README.md` for detailed documentation
- See `backend/SETUP_GUIDE.md` for comprehensive setup guide
- See `API_KEYS_GUIDE.md` for API keys instructions

