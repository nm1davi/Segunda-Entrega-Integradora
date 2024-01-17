import ProductDao from "../dao/product.mongodb.dao.js";

const productDao = new ProductDao();

export default class ProductsService {
      static getAll(filters ={}, opts = {}){
            return productDao.get(filters, opts)
      }
}