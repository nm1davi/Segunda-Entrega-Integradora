import { productDao } from '../dao/factory.js'

import ProductRepository from './products.repository.js';

const productRepository = new ProductRepository(productDao);
export default productRepository;