import { createClient } from 'redis';


class RedisClient {
  /**
   * class that creates a redisclient instance.
   */
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.error('Redis Client unable to connect:', err);
    });
  }

  isAlive() {
    return !this.client.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if (error) {
	  reject(error);
	} else {
	  resolve(value);
	}
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (error) => {
        if (error) {
	  reject(error);
	} else {
	  resolve('OK');
	}
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, response) => {
        if (error) {
	  reject(error);
	} else {
	  resolve(response === 1);
	}
      });
    });
  }
}

export const redisClient = new RedisClient();
export default redisClient;
