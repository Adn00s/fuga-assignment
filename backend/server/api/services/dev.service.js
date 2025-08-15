import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../../common/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DevService {
  async resetDatabase() {
    try {
      const seedScript = fs.readFileSync(
        path.join(__dirname, '../../../scripts/seed-dev.sql'),
        'utf8'
      );

      await db.query(seedScript);

      return {
        success: true,
        message: 'Database reset with development data',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error resetting database:', error);
      throw new Error(`Database reset failed: ${error.message}`);
    }
  }
}

export default new DevService();
