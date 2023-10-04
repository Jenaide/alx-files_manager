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
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, data, parentId, isPublic } = req.body;
    const allowedTypes = ['file', 'folder', 'image'];

    if (!name) {
      return response.status(400).json({ error: 'Missing name' });
    }

    if (!type || !allowedTypes.includes(type)) {
      return response.status(400).json({ error: 'Missing or invalid type' });
    }

    if (!data && type !== 'folder') {
      return response.status(400).json({ error: 'Missing data' });
    }

    if (parentId && !(await isValidParent(parentId, userId))) {
      return response.status(400).json({ error: 'Invalid parent' });
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

    return response.status(201).json(insertedFile);
  }
}

export default FilesController;
