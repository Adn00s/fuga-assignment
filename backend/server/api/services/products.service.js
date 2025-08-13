import l from '../../common/logger.js';
import dbMemory from './products.db.service.js';
import dbPG from './products.db.pg.service.js';

class ProductService {
  constructor() {
    // Use PostgreSQL if DB_HOST is set (Docker environment), otherwise use in-memory
    const usePostgres =
      process.env.DB_HOST && process.env.DB_HOST !== 'localhost';
    this.db = usePostgres ? dbPG : dbMemory;
    
    l.info(
      `ProductService initialized with ${usePostgres ? 'PostgreSQL' : 'in-memory'} database`
    );
  }

  all() {
    l.info(`${this.constructor.name}.all()`);
    return this.db.all();
  }

  byId(id) {
    l.info(`${this.constructor.name}.byId(${id})`);
    return this.db.byId(id);
  }

  create(productData) {
    l.info(`${this.constructor.name}.create()`, productData);
    
    // Basic hardcoded validation for now
    if (!productData.name || !productData.artist) {
      throw new Error('Product name and artist are required');
    }
    
    return this.db.insert(productData);
  }
}

export default new ProductService();
