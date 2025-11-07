import { useState } from 'react';
import { Check, Bell, Save } from 'lucide-react';

export default function Settings() {
  const [githubToken, setGithubToken] = useState('');
  const [trelloApiKey, setTrelloApiKey] = useState('');
  const [trelloToken, setTrelloToken] = useState('');
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would send the data to the backend
    console.log('Saving settings:', {
      githubToken,
      trelloApiKey,
      trelloToken,
      notifications: {
        taskUpdates,
        aiInsights,
        dailyDigest,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">Settings</h2>
        <p className="text-dark-muted">Configure API connections and preferences</p>
      </div>

      {/* API Configuration */}
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <div className="flex items-center gap-3 mb-6">
          <Check className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-dark-text">API Configuration</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              GitHub Personal Access Token
            </label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_XXXXXXXXXXXXXXXX"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-sm text-dark-muted">Required for fetching GitHub issues data</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Trello API Key <span className="text-dark-muted text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              value={trelloApiKey}
              onChange={(e) => setTrelloApiKey(e.target.value)}
              placeholder="Enter your Trello API key (optional)"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-sm text-dark-muted">Leave empty if not using Trello</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Trello Token <span className="text-dark-muted text-xs">(Optional)</span>
            </label>
            <input
              type="password"
              value={trelloToken}
              onChange={(e) => setTrelloToken(e.target.value)}
              placeholder="Enter your Trello token (optional)"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-sm text-dark-muted">Leave empty if not using Trello</p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Save API Keys
            {saved && <span className="text-sm text-green-400 ml-2">Saved!</span>}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-dark-text">Notifications</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-dark-text mb-1">Task Updates</h4>
              <p className="text-sm text-dark-muted">Notify on task status changes</p>
            </div>
            <button
              onClick={() => setTaskUpdates(!taskUpdates)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                taskUpdates ? 'bg-blue-600' : 'bg-dark-border'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  taskUpdates ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-dark-text mb-1">AI Insights</h4>
              <p className="text-sm text-dark-muted">Receive AI-generated summaries</p>
            </div>
            <button
              onClick={() => setAiInsights(!aiInsights)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                aiInsights ? 'bg-blue-600' : 'bg-dark-border'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  aiInsights ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-dark-text mb-1">Daily Digest</h4>
              <p className="text-sm text-dark-muted">Get daily productivity reports</p>
            </div>
            <button
              onClick={() => setDailyDigest(!dailyDigest)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                dailyDigest ? 'bg-blue-600' : 'bg-dark-border'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  dailyDigest ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

