# GitHub-Only Setup Guide

PULSEVO now works with **just GitHub** - Trello is completely optional!

## ✅ What You Need

1. **GitHub Personal Access Token** ⭐ (Required)
2. **MongoDB** (Atlas or local)
3. **That's it!** Trello is optional

---

## Step 1: Get GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click: **"Generate new token (classic)"**
3. Fill in:
   - **Note:** `PULSEVO Dashboard`
   - **Expiration:** 90 days
   - **Scopes:** Check these:
     - ✅ `repo` - Full control of private repositories
     - ✅ `read:org` - Read org and team membership
     - ✅ `read:user` - Read user profile data
4. Click: **"Generate token"**
5. **COPY THE TOKEN** (starts with `ghp_`)

---

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended - Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create **free cluster** (M0)
4. Create database user
5. Whitelist IP: `0.0.0.0/0`
6. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/pulsevo`

### Option B: Local MongoDB

1. Download: https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. Use: `mongodb://localhost:27017/pulsevo`

---

## Step 3: Edit .env File

Open `backend/.env` and set:

```env
# GitHub Token - REQUIRED
GITHUB_TOKEN=ghp_paste_your_token_here

# MongoDB - REQUIRED
MONGODB_URI=mongodb://localhost:27017/pulsevo
# OR for Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pulsevo

# Trello - OPTIONAL (leave empty)
TRELLO_API_KEY=
TRELLO_TOKEN=

# OpenAI - OPTIONAL
OPENAI_API_KEY=

# JWT Secret (any random string)
JWT_SECRET=any_random_string_here

# Server
PORT=8080
NODE_ENV=development
```

**Important:** 
- ✅ Set `GITHUB_TOKEN`
- ✅ Set `MONGODB_URI`
- ❌ Leave Trello empty (or remove those lines)

---

## Step 4: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected
✅ Data sync started
🚀 Server running on http://localhost:8080
📡 WebSocket server running on ws://localhost:8080/ws
```

**Note:** If you see "Trello sync skipped" - that's normal! Trello is optional.

---

## Step 5: Configure in Frontend

1. Open: http://localhost:3000
2. Go to **Settings** page
3. Enter your **GitHub Token**
4. **Leave Trello fields empty** (they're marked as optional)
5. Click **"Save API Keys"**

---

## Step 6: Verify

1. **Health check:** http://localhost:8080/health
2. **Get metrics:** http://localhost:8080/api/metrics
3. **Frontend:** Should show "Connected"
4. **Manual sync:** `curl -X POST http://localhost:8080/api/sync/github`

---

## What Gets Synced

From GitHub:
- ✅ Issues (open and closed)
- ✅ Pull Requests
- ✅ Assignees (team members)
- ✅ Labels and projects
- ✅ Repository information

Trello:
- ❌ Skipped (optional)

---

## Troubleshooting

**"No data showing?"**
- Trigger sync: `POST /api/sync/github`
- Check GitHub token has correct scopes
- Verify repositories are accessible

**"MongoDB error?"**
- Check MongoDB is running (if local)
- Verify connection string
- For Atlas: Check IP whitelist

---

## Summary

✅ **Required:**
- GitHub Token
- MongoDB

❌ **Optional:**
- Trello (can skip completely)
- Redis (uses in-memory cache)
- OpenAI (uses fallback responses)

**That's it!** You can now use PULSEVO with just GitHub! 🎉

