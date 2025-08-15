import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prismaDb from '../../../common/prisma.js';
import l from '../../../common/logger.js';

export class Controller {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existing = await prismaDb.client.user.findUnique({
        where: { email },
      });

      if (existing) {
        return res.status(400).json({ error: 'Email already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prismaDb.client.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name,
        },
      });

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
          created_at: user.createdAt,
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

      const user = await prismaDb.client.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
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
      const user = await prismaDb.client.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      l.error('Get profile error:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default new Controller();
