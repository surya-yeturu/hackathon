# API Keys Setup Guide

This document explains exactly what API keys you need and how to get them.

## Required API Keys

### 1. GitHub Personal Access Token ⭐ REQUIRED

**Purpose:** Fetch issues and pull requests from GitHub repositories

**How to Get:**
1. Go to: https://github.com/settings/tokens
2. Click: "Generate new token (classic)"
3. Fill in:
   - **Note:** `PULSEVO Dashboard`
   - **Expiration:** 90 days (or your preference)
   - **Scopes:** Check these:
     - ✅ `repo` - Full control of private repositories
     - ✅ `read:org` - Read org and team membership  
     - ✅ `read:user` - Read user profile data
4. Click: "Generate token"
5. **COPY THE TOKEN** (starts with `ghp_`)
   - ⚠️ You can only see it once!
   - Save it securely

**Add to .env:**
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**What it does:**
- Fetches all issues from your repositories
- Tracks open, closed, and in-progress issues
- Syncs automatically every 5 minutes

---

### 2. Trello API Key & Token ⭐ REQUIRED

**Purpose:** Fetch cards and boards from Trello

**How to Get:**

**Step 1: Get API Key**
1. Go to: https://trello.com/app-key
2. Your **API Key** is displayed on this page
3. Copy it

**Step 2: Get Token**
1. On the same page, scroll down
2. Find the section: "Token"
3. Click the link to generate token
4. Authorize the application
5. Copy the **Token** (long string)

**Add to .env:**
```env
TRELLO_API_KEY=your_api_key_here
TRELLO_TOKEN=your_token_here
```

**What it does:**
- Fetches all cards from your Trello boards
- Tracks card status and assignments
- Syncs automatically every 5 minutes

---

### 3. OpenAI API Key ⚠️ OPTIONAL

**Purpose:** AI-powered insights, summaries, and natural language queries

**How to Get:**
1. Go to: https://platform.openai.com/signup
2. Create account (requires credit card for paid tier)
3. Go to: https://platform.openai.com/api-keys
4. Click: "Create new secret key"
5. Name it: `PULSEVO`
6. Copy the key (starts with `sk-`)

**Add to .env:**
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Cost:** 
- Pay-as-you-go pricing
- ~$0.002 per 1K tokens
- Free tier available with limited credits

**What it does:**
- Generates AI summaries of team activity
- Answers natural language questions
- Provides predictive analytics
- Analyzes sentiment

**Without OpenAI:**
- App still works perfectly!
- Uses intelligent fallback responses
- All other features work normally

---

## Optional: Database Services

### MongoDB Atlas (Free Tier Available)

**Purpose:** Store tasks and team data

**How to Get:**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0 - 512MB)
4. Create database user
5. Whitelist your IP (or 0.0.0.0/0 for development)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/pulsevo
   ```

**Add to .env:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pulsevo
```

**Alternative:** Use local MongoDB (no account needed)

---

### Redis Cloud (Free Tier Available)

**Purpose:** Fast caching for better performance

**How to Get:**
1. Go to: https://redis.com/try-free/
2. Sign up for free account
3. Create free database (30MB)
4. Get connection URL:
   ```
   redis://:password@host:port
   ```

**Add to .env:**
```env
REDIS_URL=redis://:password@host:port
```

**Alternative:** Use local Redis or skip (app uses in-memory cache)

---

## Complete .env Template

Copy this and fill in your values:

```env
# Server
PORT=8080
NODE_ENV=development

# MongoDB (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/pulsevo
# OR: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pulsevo

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
# OR: REDIS_URL=redis://:password@host:port

# ⭐ REQUIRED API KEYS
GITHUB_TOKEN=ghp_paste_your_token_here
TRELLO_API_KEY=paste_your_api_key_here
TRELLO_TOKEN=paste_your_token_here

# ⚠️ OPTIONAL API KEY
OPENAI_API_KEY=sk-paste_your_key_here

# JWT Secret (generate random string)
JWT_SECRET=generate_a_long_random_string_here

# Refresh Intervals
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
```

## Security Best Practices

1. **Never commit .env file** to version control
2. **Rotate API keys** regularly (every 90 days)
3. **Use environment variables** in production
4. **Limit token scopes** to minimum required
5. **Store keys securely** (use password manager)

## Testing Your Keys

### Test GitHub Token:
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

### Test Trello Credentials:
```bash
curl "https://api.trello.com/1/members/me?key=YOUR_KEY&token=YOUR_TOKEN"
```

### Test OpenAI Key:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

## Troubleshooting

### "Invalid GitHub token"
- Check token starts with `ghp_`
- Verify scopes are correct
- Token may have expired

### "Trello authentication failed"
- Verify API key and token are correct
- Check token hasn't been revoked
- Re-generate token if needed

### "OpenAI API error"
- Check key starts with `sk-`
- Verify account has credits
- Check rate limits

### "MongoDB connection failed"
- Verify connection string format
- Check credentials
- Ensure IP is whitelisted (for Atlas)

## Quick Start Checklist

- [ ] GitHub token generated and added to .env
- [ ] Trello API key and token added to .env
- [ ] OpenAI key added (optional)
- [ ] MongoDB configured (local or Atlas)
- [ ] Redis configured (optional)
- [ ] .env file saved
- [ ] Backend server started successfully
- [ ] Tested API endpoints

## Need Help?

If you're stuck:
1. Check the error message in server logs
2. Verify API keys are correct
3. Test keys individually (see Testing section)
4. Check API service status pages
5. Review the main README.md

