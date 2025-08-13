import l from '../../common/logger.js';
import dbMemory from './products.db.service.js';
// import dbPG from './products.db.pg.service.js'; // Uncomment when PostgreSQL is available

class ProductService {
  constructor() {
    // For now, use in-memory database until PostgreSQL is set up
    this.db = dbMemory;
    // TODO: Switch to PostgreSQL when available: this.db = dbPG;
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
