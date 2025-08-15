import * as express from 'express';
import controller from './controller.js';
import upload from '../../../common/upload.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (err.message === 'Only JPG, PNG, and WebP files are allowed') {
      return res
        .status(400)
        .json({ error: 'Only JPG, PNG, and WebP files are allowed' });
    }
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }
  next();
};

export default express
  .Router()
  .post(
    '/upload',
    authMiddleware,
    upload.single('coverArt'),
    handleUploadError,
    controller.createWithUpload
  )
  .post(
    '/upload/:id',
    authMiddleware,
    upload.single('coverArt'),
    handleUploadError,
    controller.updateWithUpload
  )
  .post('/', authMiddleware, controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId)
  .put('/:id', authMiddleware, controller.update)
  .delete('/:id', authMiddleware, controller.delete);
