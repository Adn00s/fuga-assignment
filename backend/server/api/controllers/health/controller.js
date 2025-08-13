import db from '../../services/db.health.service.js';

export class Controller {
  async health(req, res) {
    try {
      const dbStatus = await db.checkHealth();
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        uptime: Math.floor(process.uptime()),
      };
      res.json(health);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: { status: 'disconnected', error: error.message },
        uptime: Math.floor(process.uptime()),
      });
    }
  }
}

export default new Controller();
