import jwt from 'jsonwebtoken';
import l from '../../common/logger.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.slice(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret-key'
    );

    req.user = decoded;
    next();
  } catch (error) {
    l.error('Auth failed', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
