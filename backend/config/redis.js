import { createClient } from 'redis';

let redisClient = null;

export const connectRedis = async () => {
  // If Redis is not configured, skip connection attempt
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    console.log('⚠️  Redis not configured, using in-memory cache');
    redisClient = createInMemoryCache();
    return redisClient;
  }

  try {
    const redisUrl = process.env.REDIS_URL || 
      `redis://${process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : ''}${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 2000, // 2 second timeout
        reconnectStrategy: false, // Don't auto-reconnect
      },
    });

    // Suppress error logging after first attempt
    let errorLogged = false;
    redisClient.on('error', (err) => {
      if (!errorLogged) {
        console.warn('Redis connection failed, using in-memory cache');
        errorLogged = true;
      }
      // Don't log every error
    });

    // Try to connect with timeout
    const connectPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Redis connection timeout')), 2000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ Redis connected successfully');
    return redisClient;
  } catch (error) {
    // Close the client if it was created
    if (redisClient && typeof redisClient.quit === 'function') {
      try {
        await redisClient.quit();
      } catch (e) {
        // Ignore quit errors
      }
    }
    // Fallback to in-memory cache
    console.log('⚠️  Using in-memory cache (Redis unavailable)');
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

