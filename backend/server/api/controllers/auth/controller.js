import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../../common/db.js';
import l from '../../../common/logger.js';

export class Controller {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existing = await db.query('SELECT id FROM users WHERE email = $1', [
        email,
      ]);

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Email already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
        [email, hashedPassword, name]
      );

      const user = result.rows[0];

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'dev-secret-key',
        { expiresIn: '24h' }
      );

      l.info('User registered', { userId: user.id });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: user.created_at,
        },
        token,
      });
    } catch (error) {
      l.error('Registration failed', error.message);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const result = await db.query(
        'SELECT id, email, password_hash, name FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'dev-secret-key',
        { expiresIn: '24h' }
      );

      l.info('User login', { userId: user.id });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      l.error('Login failed', error.message);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async me(req, res) {
    try {
      const { userId } = req.user;

      const result = await db.query(
        'SELECT id, email, name, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      l.error('Profile fetch failed', error.message);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }
}

export default new Controller();
