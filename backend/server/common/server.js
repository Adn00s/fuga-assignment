import Express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import l from './logger.js';
import OpenApiValidator from 'express-openapi-validator';
import errorHandler from '../api/middlewares/error.handler.js';

const app = new Express();

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);

    const apiSpec = path.join(__dirname, 'api.yml');
    const validateResponses = !!(
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === 'true'
    );

    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      })
    );

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests',
    });
    app.use(limiter);

    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many login attempts',
    });

    const uploadLimiter = rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 10,
      message: 'Too many uploads',
    });

    app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        credentials: true,
      })
    );

    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));
    app.use('/uploads', Express.static(`${root}/uploads`));

    app.use('/api/v1/auth', authLimiter);

    app.use('/api/v1/products', (req, res, next) => {
      if (
        req.method === 'POST' &&
        req.headers['content-type']?.includes('multipart/form-data')
      ) {
        return uploadLimiter(req, res, next);
      }
      next();
    });

    app.use(process.env.OPENAPI_SPEC || '/spec', Express.static(apiSpec));
    app.use(
      OpenApiValidator.middleware({
        apiSpec,
        validateResponses,
        ignorePaths: /.*\/spec(\/|$)|.*\/products\/upload|.*\/dev(\/|$)/,
      })
    );
  }

  router(routes) {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
