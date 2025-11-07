import cron from 'node-cron';
import Config from '../models/Config.js';
import { syncGitHubIssues } from './githubService.js';
import { syncTrelloCards } from './trelloService.js';
import { calculateMetrics } from './metricsService.js';
import { generateAISummary, generatePredictiveMetrics, analyzeSentiment } from './aiService.js';
import { broadcastUpdate } from './websocketService.js';

let syncInterval = null;

export const startDataSync = (wss) => {
  console.log('Starting data synchronization...');

  // Initial sync
  performSync(wss);

  // Schedule periodic syncs
  const githubInterval = parseInt(process.env.GITHUB_REFRESH_INTERVAL) || 300; // 5 minutes
  const trelloInterval = parseInt(process.env.TRELLO_REFRESH_INTERVAL) || 300; // 5 minutes
  const metricsInterval = parseInt(process.env.METRICS_UPDATE_INTERVAL) || 60; // 1 minute

  // Sync GitHub every 5 minutes
  cron.schedule(`*/${githubInterval} * * * *`, async () => {
    console.log('Syncing GitHub...');
    await syncGitHubData(wss);
  });

  // Sync Trello every 5 minutes
  cron.schedule(`*/${trelloInterval} * * * *`, async () => {
    console.log('Syncing Trello...');
    await syncTrelloData(wss);
  });

  // Update metrics every minute
  cron.schedule(`*/${metricsInterval} * * * *`, async () => {
    await updateMetrics(wss);
  });

  // Generate AI insights every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    await updateAIInsights(wss);
  });
};

const performSync = async (wss) => {
  try {
    await syncGitHubData(wss);
    await syncTrelloData(wss);
    await updateMetrics(wss);
    await updateAIInsights(wss);
  } catch (error) {
    console.error('Error in initial sync:', error);
  }
};

const syncGitHubData = async (wss) => {
  try {
    const config = await Config.findOne({ key: 'github_token' });
    if (!config || !config.value) {
      return;
    }

    const reposConfig = await Config.findOne({ key: 'github_repos' });
    const repos = reposConfig?.value || [];

    const result = await syncGitHubIssues(config.value, repos);
    console.log(`GitHub sync: ${result.synced} issues from ${result.repos} repos`);

    // Broadcast update
    await updateMetrics(wss);
  } catch (error) {
    console.error('Error syncing GitHub:', error);
  }
};

const syncTrelloData = async (wss) => {
  try {
    const apiKeyConfig = await Config.findOne({ key: 'trello_api_key' });
    const tokenConfig = await Config.findOne({ key: 'trello_token' });

    if (!apiKeyConfig || !tokenConfig || !apiKeyConfig.value || !tokenConfig.value) {
      return;
    }

    const boardsConfig = await Config.findOne({ key: 'trello_boards' });
    const boardIds = boardsConfig?.value || [];

    const result = await syncTrelloCards(apiKeyConfig.value, tokenConfig.value, boardIds);
    console.log(`Trello sync: ${result.synced} cards from ${result.boards} boards`);

    // Broadcast update
    await updateMetrics(wss);
  } catch (error) {
    console.error('Error syncing Trello:', error);
  }
};

const updateMetrics = async (wss) => {
  try {
    const metrics = await calculateMetrics();
    broadcastUpdate('metrics_update', metrics);
  } catch (error) {
    console.error('Error updating metrics:', error);
  }
};

const updateAIInsights = async (wss) => {
  try {
    const [summary, predictive, sentiment] = await Promise.all([
      generateAISummary(),
      generatePredictiveMetrics(),
      analyzeSentiment(),
    ]);

    broadcastUpdate('ai_insight', {
      aiSummary: summary,
      predictiveMetrics: predictive,
      sentiment,
    });
  } catch (error) {
    console.error('Error updating AI insights:', error);
  }
};

export const stopDataSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

