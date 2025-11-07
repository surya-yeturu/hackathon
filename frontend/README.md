# PULSEVO - Team Productivity Dashboard (Frontend)

A real-time, consolidated view of team performance metrics with AI-powered insights. This frontend application provides a unified dashboard for tracking productivity across collaboration tools like GitHub, Trello, and Notion.

## Features

- **Real-time Updates**: WebSocket-based live data synchronization
- **Overview Dashboard**: KPI cards, task distribution charts, and trend analysis
- **Task Management**: Team member performance tracking with search and pagination
- **AI Insights**: Predictive analytics, team benchmarking, and sentiment analysis
- **Conversational Query**: Natural language interface for querying team metrics
- **Settings**: API configuration for GitHub and Trello integrations
- **Dark Theme**: Modern, minimal UI optimized for data visualization

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **WebSocket** for real-time updates
- **Lucide React** for icons

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A backend server running on `ws://localhost:8080/ws` (for WebSocket connection)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── charts/         # Chart components (Donut, Line, Bar, Bubble)
│   │   ├── KPICard.tsx     # KPI metric card component
│   │   └── Layout.tsx      # Main layout with navigation
│   ├── pages/              # Page components
│   │   ├── Overview.tsx    # Main dashboard view
│   │   ├── Tasks.tsx       # Task management view
│   │   ├── AIInsights.tsx  # AI-powered insights view
│   │   ├── Query.tsx       # Conversational query interface
│   │   └── Settings.tsx    # Settings and API configuration
│   ├── services/           # Services and utilities
│   │   ├── websocket.ts    # WebSocket service for real-time updates
│   │   └── mockData.ts     # Mock data for development
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Shared types and interfaces
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## WebSocket Configuration

The application connects to a WebSocket server at `ws://localhost:8080/ws` by default. You can modify this in `src/services/websocket.ts`.

### WebSocket Message Types

- `metrics_update`: Updates dashboard metrics and KPIs
- `task_update`: Updates task and team member data
- `ai_insight`: AI-generated insights and responses
- `error`: Error messages from the server

## Environment Configuration

Create a `.env` file in the frontend directory (optional):

```env
VITE_WS_URL=ws://localhost:8080/ws
VITE_API_URL=http://localhost:8080/api
```

## API Integration

### GitHub Integration

1. Generate a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create a token with `repo` and `read:org` permissions
   - Add the token in Settings → API Configuration

### Trello Integration

1. Get Trello API Key and Token:
   - Visit https://trello.com/app-key
   - Generate an API key
   - Create a token with read permissions
   - Add both in Settings → API Configuration

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Features in Detail

### Overview Dashboard
- Real-time KPI metrics (Open Tasks, In Progress, Closed Today, etc.)
- Task distribution donut chart
- 7-day trend analysis line chart
- Team performance stacked bar chart

### Task Management
- Searchable team member table
- Task filtering by status
- Pagination support
- Project-based task visualization
- Open issues bubble chart

### AI Insights
- AI-powered summary with alerts
- Performance metrics cards
- Predictive sprint completion
- Team benchmarking comparison
- Communication sentiment analysis

### Conversational Query
- Natural language interface
- Real-time AI responses
- Query history
- Context-aware answers

### Settings
- GitHub API token configuration
- Trello API key and token setup
- Notification preferences
- Toggle switches for various alerts

## Mock Data

The application includes mock data for development and testing. This can be found in `src/services/mockData.ts`. In production, this would be replaced with real API calls.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of a hackathon submission.

## Future Enhancements

- Multi-team benchmarking
- Slack/Email integration for summaries
- Advanced filtering and sorting
- Export functionality (PDF, CSV)
- Custom dashboard widgets
- Real-time collaboration features
- Mobile app version

## Troubleshooting

### WebSocket Connection Issues

If you see "Disconnected" in the header:
1. Ensure the backend WebSocket server is running
2. Check the WebSocket URL in `src/services/websocket.ts`
3. Verify firewall/network settings

### Build Errors

If you encounter build errors:
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check Node.js version: `node --version` (should be 18+)

## Support

For issues and questions, please open an issue on the GitHub repository.

