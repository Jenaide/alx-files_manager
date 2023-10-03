import redisClient from '../utils/redis';
import dbClient from '../utils/db';


class AppController {
  static async getStatus(req, res) {
    const redisAlive = await redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();

    res.status(200).json({ 
      redis: redisClient.isAlive(),
      db: dbclient.idAlive() 
    });
  }

  static async getStats(req, res) {
    Promise.all([dbClient.ndUsers(), dbClient.ndFiles()])
      .then(([userCount, filesCount]) => {
        res.status(200).json({ users: usersCount, files: filesCount })
      });
  }
}

module.exports = AppController;
