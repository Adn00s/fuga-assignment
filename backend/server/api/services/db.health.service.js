import db from '../../common/db.js';
import l from '../../common/logger.js';

class DbHealthService {
  async checkHealth() {
    try {
      const start = Date.now();
      const result = await db.query('SELECT 1 as alive, NOW() as current_time');
      const responseTime = Date.now() - start;

      return {
        status: 'connected',
        responseTime: `${responseTime}ms`,
        serverTime: result.rows[0].current_time,
      };
    } catch (error) {
      l.error('Database health check failed', { error: error.message });
      return {
        status: 'disconnected',
        error: error.message,
      };
    }
  }
}

export default new DbHealthService();
