const RedisClient = require('../utils/redis');
const DBClient = require('../utils/db');

const AppController = {
  getStatus: async (req, res) => {
    // Check if Redis and the DB are alive
    const redisAlive = RedisClient.isAlive();
    const dbAlive = await DBClient.isAlive();

    // Send the status as JSON response
    res.status(200).json({ redis: redisAlive, db: dbAlive });
  },

  getStats: async (req, res) => {
    try {
      // Use your DBClient to fetch the number of users and files
      const usersCount = await DBClient.nbUsers();
      const filesCount = await DBClient.nbFiles();

      // Send the stats as JSON response
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      // Handle any errors that may occur during DB operations
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = AppController;
