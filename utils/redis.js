const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (error) => {
      console.error('Redis client error:', error);
    });
  }

  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  // get the value for a given key from the redis server
  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    const value = await asyncGet(key);
    return value;
  }

  // Set the key value pair to redis server
  async set(key, value, duration) {
    const asyncSet = promisify(this.client.set).bind(this.client);
    await asyncSet(key, value, 'EX', duration);
    await this.client.expire(key, duration);
  }

  // Del key value pair from redis server
  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    await asyncDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
