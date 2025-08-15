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

  all(options = {}) {
    l.info(`${this.constructor.name}.all()`);
    return this.db.all(options);
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

  update(id, productData) {
    l.info(`${this.constructor.name}.update(${id})`, productData);
    return this.db.update(id, productData);
  }

  delete(id) {
    l.info(`${this.constructor.name}.delete(${id})`);
    return this.db.delete(id);
  }
}

export default new ProductService();
