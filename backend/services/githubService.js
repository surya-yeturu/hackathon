import axios from 'axios';
import Task from '../models/Task.js';
import { getRedisClient } from '../config/redis.js';

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_TTL = 300; // 5 minutes

export const fetchGitHubIssues = async (token, owner, repo) => {
  try {
    const cacheKey = `github:issues:${owner}:${repo}`;
    const redis = getRedisClient();
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          state: 'all',
          per_page: 100,
        },
      }
    );

    const issues = response.data;
    
    // Cache the result
    await redis.set(cacheKey, issues, { EX: CACHE_TTL });

    return issues;
  } catch (error) {
    console.error('Error fetching GitHub issues:', error.message);
    throw error;
  }
};

export const syncGitHubIssues = async (token, repos = []) => {
  try {
    if (!token) {
      throw new Error('GitHub token is required');
    }

    // Default repos if not provided
    if (repos.length === 0) {
      // Try to get repos from user's account
      const userRepos = await fetchUserRepos(token);
      repos = userRepos.map(repo => ({
        owner: repo.owner.login,
        name: repo.name,
      }));
    }

    let totalSynced = 0;

    for (const repo of repos) {
      const issues = await fetchGitHubIssues(token, repo.owner, repo.name);
      
      for (const issue of issues) {
        const taskData = {
          externalId: `github_${issue.id}`,
          source: 'github',
          title: issue.title,
          description: issue.body || '',
          status: mapGitHubState(issue.state, issue.pull_request),
          assignedTo: issue.assignee?.login || '',
          project: repo.name,
          labels: issue.labels.map(label => label.name),
          priority: determinePriority(issue.labels),
          createdAt: new Date(issue.created_at),
          updatedAt: new Date(issue.updated_at),
          closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
          metadata: {
            url: issue.html_url,
            number: issue.number,
            author: issue.user.login,
            comments: issue.comments,
            milestone: issue.milestone?.title,
          },
        };

        await Task.findOneAndUpdate(
          { externalId: taskData.externalId },
          taskData,
          { upsert: true, new: true }
        );

        totalSynced++;
      }
    }

    return { synced: totalSynced, repos: repos.length };
  } catch (error) {
    console.error('Error syncing GitHub issues:', error);
    throw error;
  }
};

const fetchUserRepos = async (token) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      params: {
        per_page: 100,
        sort: 'updated',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    return [];
  }
};

const mapGitHubState = (state, isPullRequest) => {
  if (isPullRequest) {
    return state === 'open' ? 'in_progress' : 'completed';
  }
  
  switch (state) {
    case 'open':
      return 'open';
    case 'closed':
      return 'completed';
    default:
      return 'open';
  }
};

const determinePriority = (labels) => {
  const labelNames = labels.map(l => l.name.toLowerCase());
  if (labelNames.some(l => l.includes('critical') || l.includes('urgent'))) {
    return 'critical';
  }
  if (labelNames.some(l => l.includes('high'))) {
    return 'high';
  }
  if (labelNames.some(l => l.includes('low'))) {
    return 'low';
  }
  return 'medium';
};

export const getGitHubUserInfo = async (token) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub user info:', error);
    throw error;
  }
};

