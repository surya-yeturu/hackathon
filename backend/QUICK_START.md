# Quick Start - Backend Setup

## 1. Install Dependencies
```bash
cd backend
npm install
```

## 2. Create .env File

Create a file named `.env` in the `backend` directory with this content:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pulsevo
REDIS_HOST=localhost
REDIS_PORT=6379
GITHUB_TOKEN=your_github_token_here
TRELLO_API_KEY=your_trello_api_key_here
TRELLO_TOKEN=your_trello_token_here
OPENAI_API_KEY=your_openai_key_here
JWT_SECRET=your_random_secret_key
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
```

## 3. Get API Keys

### GitHub Token (Required)
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `read:org`, `read:user`
4. Copy token (starts with `ghp_`)

### Trello API Key & Token (Required)
1. Go to: https://trello.com/app-key
2. Copy API Key
3. Click Token link and authorize
4. Copy Token

### OpenAI Key (Optional)
1. Go to: https://platform.openai.com/api-keys
2. Create new secret key
3. Copy key (starts with `sk-`)

## 4. Start MongoDB

**Local:**
```bash
mongod
```

**OR use MongoDB Atlas** (free cloud option):
- Sign up at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URI` in .env

## 5. Start Redis (Optional)

```bash
redis-server
```

**OR skip Redis** - app will use in-memory cache automatically

## 6. Start Server

```bash
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

## 7. Test It

```bash
# Health check
curl http://localhost:8080/health

# Get metrics
curl http://localhost:8080/api/metrics
```

## Done! 🎉

Your backend is now running. Start the frontend to see the full dashboard!

For detailed setup instructions, see:
- `SETUP_GUIDE.md` - Complete step-by-step guide
- `API_KEYS_GUIDE.md` - Detailed API key instructions
- `README.md` - Full documentation

