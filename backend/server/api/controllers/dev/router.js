import express from 'express';
import controller from './controller.js';

const router = express.Router();

// Development endpoints
const isDevelopment =
  !process.env.NODE_ENV ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'test';

if (isDevelopment) {
  router.post('/reset', controller.reset);
}

export default router;
