import * as express from 'express';
import controller from './controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

export default express
  .Router()
  .post('/register', controller.register)
  .post('/login', controller.login)
  .get('/me', authMiddleware, controller.me);
