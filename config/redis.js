import { createClient } from 'redis';

let redisClient = null;

export const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 
      `redis://${process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : ''}${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (error) {
    console.warn('Redis connection failed, using in-memory cache:', error.message);
    // Fallback to in-memory cache
    redisClient = createInMemoryCache();
    return redisClient;
  }
};

// In-memory cache fallback
const inMemoryCache = new Map();

function createInMemoryCache() {
  return {
    async get(key) {
      const value = inMemoryCache.get(key);
      if (!value) return null;
      const { data, expiry } = value;
      if (expiry && Date.now() > expiry) {
        inMemoryCache.delete(key);
        return null;
      }
      return JSON.parse(data);
    },
    async set(key, value, options = {}) {
      const expiry = options.EX ? Date.now() + options.EX * 1000 : null;
      inMemoryCache.set(key, { data: JSON.stringify(value), expiry });
    },
    async del(key) {
      inMemoryCache.delete(key);
    },
    async exists(key) {
      return inMemoryCache.has(key) ? 1 : 0;
    },
    async keys(pattern) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return Array.from(inMemoryCache.keys()).filter(key => regex.test(key));
    },
    isOpen: true,
  };
}

export const getRedisClient = () => {
  if (!redisClient) {
    console.warn('Redis not initialized, using in-memory cache');
    return createInMemoryCache();
  }
  return redisClient;
};

