import * as express from 'express';
import controller from './controller.js';
import upload from '../../../common/upload.js';

const handleUploadError = (err, req, res, next) => {
  if (err) {
    console.error('Upload middleware error:', err);
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
    upload.single('coverArt'),
    handleUploadError,
    controller.createWithUpload
  )
  .put(
    '/:id/upload',
    upload.single('coverArt'),
    handleUploadError,
    controller.updateWithUpload
  )
  .post('/', controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId)
  .put('/:id', controller.update)
  .delete('/:id', controller.delete);
