import productsRouter from './api/controllers/products/router.js';
import healthRouter from './api/controllers/health/router.js';

export default function routes(app) {
  app.use('/api/v1/products', productsRouter);
  app.use('/api/v1/health', healthRouter);
}
