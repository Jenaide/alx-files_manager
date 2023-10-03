import redisClient from '../utils/redis';
import dbClient from '../utils/db';


class AppController {
  static getStatus(req, res) {
    res.statusCode = 200;
    res.send({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static async getStats(req, res) {
    res.statusCode = 200;
    res.send({
      user: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    });
  }
}

export default AppController;
