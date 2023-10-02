const { MongoClient } = require('mongodb');


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

    async isAlive() {
        try {
            await this.client.connect();
            return true;
        } catch (err) {
            return false;
        }
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

const dbClient = new DBClient();

module.exports = { DBClient, dbClient };