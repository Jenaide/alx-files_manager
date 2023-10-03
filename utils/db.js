import { MongoClient } from 'mongodb';


const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;


class DBClient {
  /**
   * class that creates a DBClient instance
   */
  constructor() {
    this.client = new MongoClient(URI, { useUnifiedTopology: true });
    this.isConnected = false;
    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.isConnected = true;
      this.db = this.client.db(DB_DATABASE);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Could not connect to MongoDB', error);
      throw error;
    }
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    const userCollection = this.db.collection('users');
    return userCollection.countDocuments();
  }

  async nbFiles() {
    const fileCollection = this.db.collection('files');
    return fileCollection.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
