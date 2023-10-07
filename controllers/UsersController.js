import Queue from 'bull';
import { ObjectID } from 'mongodb';
import sha1 from 'sha1';

const RedisClient = require('../utils/redis');
const DBClient = require('../utils/db');

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  static postNew(req, res) {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email) {
        res.status(400).json({ error: 'Missing email' });
        return;
      }

      if (!password) {
        res.status(400).json({ error: 'Missing password' });
        return;
      }

      // Check if the email already exists in the database
      const users = DBClient.db.collection('users');
      users.findOne({ email }, (err, user) => {
        if (user) {
          res.status(400).json({ error: 'Already exist' });
        } else {
          const hashedPassword = sha1(password);
          users.insertOne(
            {
              email,
              password: hashedPassword,
            },
          ).then((result) => {
            res.status(201).json({ id: result.insertedId, email });
            userQueue.add({ userId: result.insertedId });
          }).catch((error) => console.log(error));
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await RedisClient.get(key);
    if (userId) {
      const users = DBClient.db.collection('users');
      const idObject = new ObjectID(userId);
      users.findOne({ _id: idObject }, (err, user) => {
        if (user) {
          res.status(200).json({ id: userId, email: user.email });
        } else {
          res.status(401).json({ error: 'Unauthorized' });
        }
      });
    } else {
      console.log('Hupatikani!');
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = UsersController;
