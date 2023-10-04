import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';


async function getUserIdFromToken(request) {
  const token = request.header('X-Token');
  const key = `auth_${token}`;
  return await redisClient.get(key);
}

async function isValidParent(parentId, userId) {
  const parentFile = await dbClient.db.collection('files').findOne({ _id: parentId, userId });
  return parentFile && parentFile.type === 'folder';
}

async function saveFile(data) {
  const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
  const uuidstr = uuidv4();
  const filePath = `${folderPath}/${uuidstr}`;
  const buff = Buffer.from(data, 'base64');
  
  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(filePath, buff, 'utf-8');
    return filePath;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
}

async function insertFile(fileData) {
  const filesCollection = dbClient.db.collection('files');
  const inserted = await filesCollection.insertOne(fileData);
  const fileId = inserted.insertedId;

  // Start thumbnail generation worker for images
  if (fileData.type === 'image') {
    const jobName = `Image thumbnail [${fileData.userId}-${fileId}]`;
    fileQueue.add({ userId: fileData.userId, fileId, name: jobName });
  }

  return {
    id: fileId,
    userId: fileData.userId,
    name: fileData.name,
    type: fileData.type,
    isPublic: fileData.isPublic,
    parentId: fileData.parentId,
  };
}

async function getUserById(userId) {
  const users = dbClient.db.collection('users');
  return await users.findOne({ _id: new ObjectID(userId) });
}

async function getFileById(fileId) {
  const files = dbClient.db.collection('files');
  return await files.findOne({ _id: fileId });
}
