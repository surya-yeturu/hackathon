import { getRedisClient } from '../config/redis.js';
import { calculateMetrics } from './metricsService.js';

const clients = new Set();

export const setupWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    clients.add(ws);

    // Send initial data
    sendInitialData(ws);

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        await handleMessage(ws, data);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        sendError(ws, 'Invalid message format');
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
};

const sendInitialData = async (ws) => {
  try {
    const metrics = await calculateMetrics();
    sendMessage(ws, {
      type: 'metrics_update',
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error sending initial data:', error);
  }
};

const handleMessage = async (ws, data) => {
  switch (data.type) {
    case 'query':
      await handleQuery(ws, data.question);
      break;
    case 'ping':
      sendMessage(ws, { type: 'pong', timestamp: new Date().toISOString() });
      break;
    default:
      sendError(ws, `Unknown message type: ${data.type}`);
  }
};

const handleQuery = async (ws, question) => {
  try {
    const { generateAIResponse } = await import('./aiService.js');
    const response = await generateAIResponse(question);
    
    sendMessage(ws, {
      type: 'ai_insight',
      data: { response },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error handling query:', error);
    sendError(ws, 'Failed to process query');
  }
};

export const broadcastUpdate = async (type, data) => {
  const message = {
    type,
    data,
    timestamp: new Date().toISOString(),
  };

  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(messageStr);
      } catch (error) {
        console.error('Error broadcasting to client:', error);
        clients.delete(client);
      }
    }
  });
};

const sendMessage = (ws, message) => {
  if (ws.readyState === 1) { // WebSocket.OPEN
    ws.send(JSON.stringify(message));
  }
};

const sendError = (ws, error) => {
  sendMessage(ws, {
    type: 'error',
    data: { error },
    timestamp: new Date().toISOString(),
  });
};

export const getConnectedClients = () => clients.size;

