# Backend Quick Setup Guide

## ✅ Current Status
- ✅ Dependencies installed
- ✅ .env file created

## 📋 Next Steps (In Order)

### Step 1: Get API Keys

#### GitHub Token (Required)
1. Visit: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `PULSEVO Dashboard`
4. Check scopes: `repo`, `read:org`, `read:user`
5. Copy token (starts with `ghp_`)

#### Trello API Key & Token (Optional - Can Skip)
1. Visit: https://trello.com/app-key
2. Copy API Key (shown on page)
3. Click "Token" link and authorize
4. Copy Token
5. **Note:** You can leave Trello empty and use only GitHub

#### OpenAI Key (Optional)
1. Visit: https://platform.openai.com/api-keys
2. Create new secret key
3. Copy key (starts with `sk-`)

---

### Step 2: Set Up MongoDB

**Option A: MongoDB Atlas (Easiest - Free)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP: `0.0.0.0/0`
6. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/pulsevo`)

**Option B: Local MongoDB**
1. Download: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Use: `mongodb://localhost:27017/pulsevo`

---

### Step 3: Edit .env File

Open `backend/.env` and replace these values:

```env
GITHUB_TOKEN=ghp_paste_your_token_here
TRELLO_API_KEY=  # Optional - leave empty if not using Trello
TRELLO_TOKEN=    # Optional - leave empty if not using Trello
OPENAI_API_KEY=sk-paste_your_key_here  # Optional
MONGODB_URI=mongodb://localhost:27017/pulsevo  # Or your Atlas connection
JWT_SECRET=any_random_string_here
```

**Note:** You only need GitHub token. Trello is optional - leave those fields empty.

---

### Step 4: Start Backend

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected
✅ Redis connected (or in-memory cache)
✅ Data sync started
🚀 Server running on http://localhost:8080
📡 WebSocket server running on ws://localhost:8080/ws
```

---

### Step 5: Verify It Works

1. Open browser: http://localhost:8080/health
   - Should show: `{"status":"ok",...}`

2. Check frontend:
   - Should show "Connected" instead of "Disconnected"

---

## 🚨 Common Issues

**MongoDB connection error?**
- Check MongoDB is running (if local)
- Verify connection string in `.env`
- For Atlas: Check IP whitelist

**Port 8080 in use?**
- Change `PORT=8081` in `.env`

**GitHub/Trello errors?**
- Verify API keys are correct
- Check keys haven't expired

---

## 📚 Detailed Guides

- Full setup: `backend/BACKEND_SETUP_STEPS.md`
- API keys: `API_KEYS_GUIDE.md`
- Backend docs: `backend/README.md`

---

## ✅ Checklist

- [ ] GitHub token obtained and added to `.env`
- [ ] Trello API key and token added to `.env` (optional - can skip)
- [ ] MongoDB set up (Atlas or local)
- [ ] `.env` file edited with required values
- [ ] Backend server starts successfully
- [ ] Health endpoint works
- [ ] Frontend shows "Connected"

**Note:** Trello is optional. You can use the app with just GitHub!

---

**You're done when the backend server starts without errors!** 🎉

