import express from 'express';
import { body, validationResult } from 'express-validator';
import Config from '../models/Config.js';
import Task from '../models/Task.js';
import TeamMember from '../models/TeamMember.js';
import { syncGitHubIssues, getGitHubUserInfo } from '../services/githubService.js';
import { syncTrelloCards, getTrelloMemberInfo, fetchTrelloBoards } from '../services/trelloService.js';
import { calculateMetrics, getTeamMembers } from '../services/metricsService.js';
import { generateAIResponse, generateAISummary, generatePredictiveMetrics, analyzeSentiment } from '../services/aiService.js';

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await calculateMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get tasks
router.get('/tasks', async (req, res) => {
  try {
    const { status, project, assignedTo, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (project) query.project = project;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get team members
router.get('/team-members', async (req, res) => {
  try {
    const members = await getTeamMembers();
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Save API configuration
router.post(
  '/config',
  [
    body('githubToken').optional().isString(),
    body('trelloApiKey').optional().isString(),
    body('trelloToken').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { githubToken, trelloApiKey, trelloToken } = req.body;

      if (githubToken) {
        await Config.findOneAndUpdate(
          { key: 'github_token' },
          { key: 'github_token', value: githubToken, encrypted: true },
          { upsert: true }
        );

        // Verify token and get user info
        try {
          const userInfo = await getGitHubUserInfo(githubToken);
          console.log('GitHub token verified for user:', userInfo.login);
        } catch (error) {
          console.error('GitHub token verification failed:', error);
        }
      }

      if (trelloApiKey && trelloToken) {
        await Config.findOneAndUpdate(
          { key: 'trello_api_key' },
          { key: 'trello_api_key', value: trelloApiKey },
          { upsert: true }
        );

        await Config.findOneAndUpdate(
          { key: 'trello_token' },
          { key: 'trello_token', value: trelloToken, encrypted: true },
          { upsert: true }
        );

        // Verify credentials and get boards
        try {
          const boards = await fetchTrelloBoards(trelloApiKey, trelloToken);
          await Config.findOneAndUpdate(
            { key: 'trello_boards' },
            { key: 'trello_boards', value: boards.map(b => b.id) },
            { upsert: true }
          );
          console.log('Trello credentials verified, found', boards.length, 'boards');
        } catch (error) {
          console.error('Trello credentials verification failed:', error);
        }
      }

      res.json({ message: 'Configuration saved successfully' });
    } catch (error) {
      console.error('Error saving configuration:', error);
      res.status(500).json({ error: 'Failed to save configuration' });
    }
  }
);

// Get configuration
router.get('/config', async (req, res) => {
  try {
    const configs = await Config.find({
      key: { $in: ['github_token', 'trello_api_key', 'trello_token'] },
    }).lean();

    const configMap = {};
    configs.forEach(config => {
      configMap[config.key] = config.encrypted ? '***' : config.value;
    });

    res.json(configMap);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Manual sync endpoints
router.post('/sync/github', async (req, res) => {
  try {
    const config = await Config.findOne({ key: 'github_token' });
    if (!config || !config.value) {
      return res.status(400).json({ error: 'GitHub token not configured' });
    }

    const reposConfig = await Config.findOne({ key: 'github_repos' });
    const repos = reposConfig?.value || req.body.repos || [];

    const result = await syncGitHubIssues(config.value, repos);
    res.json({ message: 'GitHub sync completed', ...result });
  } catch (error) {
    console.error('Error syncing GitHub:', error);
    res.status(500).json({ error: 'Failed to sync GitHub', message: error.message });
  }
});

router.post('/sync/trello', async (req, res) => {
  try {
    const apiKeyConfig = await Config.findOne({ key: 'trello_api_key' });
    const tokenConfig = await Config.findOne({ key: 'trello_token' });

    if (!apiKeyConfig || !tokenConfig || !apiKeyConfig.value || !tokenConfig.value) {
      return res.status(400).json({ error: 'Trello credentials not configured' });
    }

    const boardsConfig = await Config.findOne({ key: 'trello_boards' });
    const boardIds = boardsConfig?.value || req.body.boardIds || [];

    const result = await syncTrelloCards(apiKeyConfig.value, tokenConfig.value, boardIds);
    res.json({ message: 'Trello sync completed', ...result });
  } catch (error) {
    console.error('Error syncing Trello:', error);
    res.status(500).json({ error: 'Failed to sync Trello', message: error.message });
  }
});

// AI endpoints
router.post('/ai/query', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await generateAIResponse(question);
    res.json({ response });
  } catch (error) {
    console.error('Error processing AI query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

router.get('/ai/insights', async (req, res) => {
  try {
    const [summary, predictive, sentiment] = await Promise.all([
      generateAISummary(),
      generatePredictiveMetrics(),
      analyzeSentiment(),
    ]);

    res.json({
      aiSummary: summary,
      predictiveMetrics: predictive,
      sentiment,
    });
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
});

// Create/Update task manually
router.post('/tasks', async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      source: 'manual',
      externalId: req.body.externalId || `manual_${Date.now()}`,
    };

    const task = await Task.findOneAndUpdate(
      { externalId: taskData.externalId },
      taskData,
      { upsert: true, new: true }
    );

    res.json(task);
  } catch (error) {
    console.error('Error creating/updating task:', error);
    res.status(500).json({ error: 'Failed to create/update task' });
  }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;

