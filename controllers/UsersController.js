import dbClient from '../utils/db';
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';


const userQueue = new Queue('email sending');

/**
 * A UserController class that will handle
 * the creation of new user
 */
class UsersController {
  /**
   * contains user email
   * and password
   * and returns the new user's data
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the database
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert the new user into the database
    try {
      const insertedUser = await dbClient.db.collection('user').insertOne(newUser);
      const { _id } = insertedUser.ops[0];

      // queue email sending
      userQueue.add({ userId: _id });

      // Return the newly created user with email and id only
      const responseUser = { email, id: _id };
      return res.status(201).json(responseUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    const { userId } = req;

    // Check if userId is available from the request
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Retrieve the user from the database based on userId
      const user = await dbClient.db.collection('users').findOne({ _id: userId });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const responseUser = { email: user.email, id: user._id };
      return res.status(200).json(responseUser);
    } catch (error) {
      console.error('Error retrieving user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
