import * as express from 'express';
import controller from './controller.js';
import upload from '../../../common/upload.js';

export default express
  .Router()
  .post('/upload', upload.single('coverArt'), controller.createWithUpload)
  .post('/', controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId);
