import { Pool } from 'pg';
import l from './logger.js';

class Database {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'fuga_music_db',
      user: process.env.DB_USER || 'fuga_user',
      password: process.env.DB_PASSWORD || 'fuga_password',
      max: 20, // maximum number of clients in the pool
      idleTimeoutMillis: 30000, // close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
    });

    this.pool.on('error', (err) => {
      l.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    l.info('Database connection pool initialized');
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      l.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      l.error('Query error', { text, error: error.message });
      throw error;
    }
  }

  async getClient() {
    return this.pool.connect();
  }

  async close() {
    await this.pool.end();
    l.info('Database connection pool closed');
  }

  // For development - check if database is accessible
  async testConnection() {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      l.info('Database connection test successful', {
        time: result.rows[0].current_time,
      });
      return true;
    } catch (error) {
      l.error('Database connection test failed', { error: error.message });
      return false;
    }
  }
}

const db = new Database();

export default db;
