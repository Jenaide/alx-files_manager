import mongodb from 'mongodb';
import Collection from 'mongodb/lib/collection';


class DBClient {
  /**
   * class that creates a DBClient instance
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect();
    }

  isAlive() {
    return this.client.connect();
  }

  async nbUsers() {
    const userCollection = await this.client.db().collection('users');
    return userCollection.countDocuments();
  }

  async nbFiles() {
    const fileCollection = await this.client.db().collection('files');
    return fileCollection.countDocuments();
  }
}

export const dbClient = new DBClient();
export default dbClient;
