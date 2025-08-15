import l from '../../common/logger.js';
import dbPrisma from './products.prisma.service.js';

class ProductService {
  constructor() {
    this.db = dbPrisma;
    l.info('ProductService initialized with Prisma ORM');
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
