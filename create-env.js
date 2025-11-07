import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTemplate = `# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/pulsevo
# OR for MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsevo

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
# OR use Redis URL:
# REDIS_URL=redis://:password@host:port

# API Keys - REQUIRED
# GitHub Personal Access Token
# Get from: https://github.com/settings/tokens
# Required scopes: repo, read:org, read:user
GITHUB_TOKEN=ghp_your_github_token_here

# Trello API Configuration
# Get from: https://trello.com/app-key
TRELLO_API_KEY=your_trello_api_key_here
TRELLO_TOKEN=your_trello_token_here

# OpenAI API Key (for AI features - OPTIONAL)
# Get from: https://platform.openai.com/api-keys
# Optional: Can use Hugging Face or other LLM services
OPENAI_API_KEY=sk-your_openai_api_key_here

# JWT Secret (for authentication if needed)
JWT_SECRET=your_jwt_secret_key_here

# WebSocket Configuration
WS_PORT=8080

# Data Refresh Intervals (in seconds)
GITHUB_REFRESH_INTERVAL=300
TRELLO_REFRESH_INTERVAL=300
METRICS_UPDATE_INTERVAL=60
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('   If you want to recreate it, delete .env first.');
} else {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file!');
  console.log('📝 Please edit .env and add your API keys:');
  console.log('   - GITHUB_TOKEN');
  console.log('   - TRELLO_API_KEY');
  console.log('   - TRELLO_TOKEN');
  console.log('   - OPENAI_API_KEY (optional)');
  console.log('\n📖 See API_KEYS_GUIDE.md for detailed instructions.');
}

