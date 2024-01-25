import config from '../config/config.js';

export let productDao;
switch (config.persistence) {
      case 'mongodb':
            const ProductDaoMongoDb = (await import('./product.mongodb.dao.js')).default;
            productDao = new ProductDaoMongoDb();
            break;

      default:
            const ProductDaoMemory= (await import('./product.memory.dao.js')).default;
            productDao = new ProductDaoMemory();
            break;
}
