import axios from 'axios';
import Task from '../models/Task.js';
import { getRedisClient } from '../config/redis.js';

const TRELLO_API_BASE = 'https://api.trello.com/1';
const CACHE_TTL = 300; // 5 minutes

export const fetchTrelloBoards = async (apiKey, token) => {
  try {
    const cacheKey = `trello:boards:${apiKey}`;
    const redis = getRedisClient();
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await axios.get(
      `${TRELLO_API_BASE}/members/me/boards`,
      {
        params: {
          key: apiKey,
          token: token,
          filter: 'open',
        },
      }
    );

    const boards = response.data;
    await redis.set(cacheKey, boards, { EX: CACHE_TTL });

    return boards;
  } catch (error) {
    console.error('Error fetching Trello boards:', error.message);
    throw error;
  }
};

export const fetchTrelloCards = async (apiKey, token, boardId) => {
  try {
    const cacheKey = `trello:cards:${boardId}`;
    const redis = getRedisClient();
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await axios.get(
      `${TRELLO_API_BASE}/boards/${boardId}/cards`,
      {
        params: {
          key: apiKey,
          token: token,
          filter: 'all',
        },
      }
    );

    const cards = response.data;
    await redis.set(cacheKey, cards, { EX: CACHE_TTL });

    return cards;
  } catch (error) {
    console.error('Error fetching Trello cards:', error.message);
    throw error;
  }
};

export const syncTrelloCards = async (apiKey, token, boardIds = []) => {
  try {
    if (!apiKey || !token) {
      throw new Error('Trello API key and token are required');
    }

    // Get boards if not provided
    if (boardIds.length === 0) {
      const boards = await fetchTrelloBoards(apiKey, token);
      boardIds = boards.map(board => board.id);
    }

    let totalSynced = 0;

    for (const boardId of boardIds) {
      const cards = await fetchTrelloCards(apiKey, token, boardId);
      
      // Get board info for project name
      const boardResponse = await axios.get(
        `${TRELLO_API_BASE}/boards/${boardId}`,
        {
          params: {
            key: apiKey,
            token: token,
          },
        }
      );
      const board = boardResponse.data;

      for (const card of cards) {
        const taskData = {
          externalId: `trello_${card.id}`,
          source: 'trello',
          title: card.name,
          description: card.desc || '',
          status: mapTrelloList(card.idList, card.closed),
          assignedTo: card.idMembers?.length > 0 ? card.idMembers[0] : '',
          project: board.name,
          labels: card.labels.map(label => label.name),
          priority: determinePriorityFromLabels(card.labels),
          createdAt: new Date(card.dateLastActivity),
          updatedAt: new Date(card.dateLastActivity),
          closedAt: card.closed ? new Date(card.dateLastActivity) : null,
          dueDate: card.due ? new Date(card.due) : null,
          metadata: {
            url: card.url,
            shortUrl: card.shortUrl,
            idList: card.idList,
            idBoard: card.idBoard,
            checkItems: card.checkItems,
            checkItemsChecked: card.checkItemsChecked,
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

    return { synced: totalSynced, boards: boardIds.length };
  } catch (error) {
    console.error('Error syncing Trello cards:', error);
    throw error;
  }
};

const mapTrelloList = (listId, isClosed) => {
  if (isClosed) {
    return 'completed';
  }
  // You can enhance this by fetching list names and mapping them
  // For now, we'll use a simple mapping
  return 'open';
};

const determinePriorityFromLabels = (labels) => {
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

export const getTrelloMemberInfo = async (apiKey, token) => {
  try {
    const response = await axios.get(
      `${TRELLO_API_BASE}/members/me`,
      {
        params: {
          key: apiKey,
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Trello member info:', error);
    throw error;
  }
};

