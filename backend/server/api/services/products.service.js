import l from '../../common/logger.js';
import db from './products.db.service.js';

class ProductService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all();
  }

  byId(id) {
    l.info(`${this.constructor.name}.byId(${id})`);
    return db.byId(id);
  }

  create(productData) {
    l.info(`${this.constructor.name}.create()`, productData);
    
    // Basic hardcoded validation for now
    if (!productData.name || !productData.artist) {
      throw new Error('Product name and artist are required');
    }
    
    return db.insert(productData);
  }
}

export default new ProductService();
