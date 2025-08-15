import { PrismaClient } from '@prisma/client';
import l from './logger.js';

class Database {
  constructor() {
    this.prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.prisma.$on('query', (e) => {
        l.debug('Prisma query', {
          query: e.query,
          duration: `${e.duration}ms`,
        });
      });
    }

    this.prisma.$on('error', (e) => {
      l.error('Prisma error', e);
    });

    l.info('Prisma client initialized');
  }

  get client() {
    return this.prisma;
  }

  get pool() {
    return this.prisma;
  }

  async close() {
    await this.prisma.$disconnect();
    l.info('Prisma client disconnected');
  }

  async testConnection() {
    try {
      await this.prisma.$queryRaw`SELECT NOW() as current_time`;
      l.info('Database connection test successful');
      return true;
    } catch (error) {
      l.error('Database connection test failed', error.message);
      throw error;
    }
  }
}

export default new Database();
