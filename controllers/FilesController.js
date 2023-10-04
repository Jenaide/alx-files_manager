import fs from 'fs';
import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { getUserFromToken, isValidParent, saveFile, insertFile } from '../utils/auth';


class FilesController {
  /**
   * Create a new file in DB and in disk.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async postUpload(req, res) {
    const userId = await getUserIdFromToken(request);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, data, parentId, isPublic } = req.body;
    const allowedTypes = ['file', 'folder', 'image'];

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid type' });
    }

    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId && !(await isValidParent(parentId, userId))) {
      return res.status(400).json({ error: 'Invalid parent' });
    }

    const filePath = type !== 'folder' ? await saveFile(data) : null;

    const insertedFile = await inserFile({
      userId,
      name,
      type,
      isPublic: !!isPublic,
      parentId: parentId || '0',
      localPath: filePath,
    });

    return res.status(201).json(insertedFile);
  }

  static async getShow(req, res) {
    const fileId = req.params.id;
    const fileObjId = new ObjectId(fileId);
    const userId = await getUserIdFromToken(request);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const requestedFile = await getFileById(fileObjId);

    if (!requestedFile) {
      return res.status(401).json({ error: 'Not found' });
    }

    res.status(200).json({
      id: requestedFile._id,
      userId: requestedFile.userId,
      name: requestedFile.name,
      type: requestedFile.type,
      isPublic: requestedFile.isPublic,
      parentId: requestedFile.parentId,
    });
  }

  static async getIndex(req, res) {
    const userId = await getUserIdFromToken(request);

    if (!userId) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const existingUser = await getUserById(userId);

  if (!existingUser) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const { parentId, page = 0 } = request.query;

  const parentObjId = parentId ? new ObjectID(parentId) : null;
  const userObjId = new ObjectID(userId);

  const query = {
    userId: userObjId,
  };

  if (parentObjId) {
    query.parentId = parentObjId;
  }

  const files = await getFiles(query, page);

  const finalFilesArray = files.map((file) => ({
    id: file._id,
    userId: file.userId,
    name: file.name,
    type: file.type,
    isPublic: file.isPublic,
    parentId: file.parentId,
  }));

  response.status(201).send(finalFilesArray);
  }


  static async putPublish(req, res) {
    const { id } = req.params;
    const token = req.header('X-Token');
    const userId = await getUserIdFromToken(token);
  
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileId = new ObjectID(id);
    const file = await getFileByIdAndUserId(fileId, userId);

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    await updateFileToPublic(fileId);

    const updatedFile = {
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: true,
      parentId: file.parentId,
    };

    res.status(200).json(updatedFile);
  }

  static async putUnPublish(req, res) {
    const { id } = req.params;
    const token = req.header('X-Token');
    const userId = await getUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileId = new ObjectID(id);
    const file = await getFileByIdAndUserId(fileId, userId);

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    await updateFileToUnpublic(fileId);

    const updatedFile = {
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: false,
      parentId: file.parentId,
    };

    res.status(200).json(updatedFile);
  }
}

export default FilesController;
