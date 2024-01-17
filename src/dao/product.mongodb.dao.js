import productModel from './models/product.model.js';

export default class ProductDao {
    async get(filters = {}, opts = {}) {
        const productos = await productModel.find({}).sort({"title": 1});
        const formattedProducts = productos.map(product => ({
          _id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail,
          code: product.code,
          stock: product.stock,
          category: product.category,
          status: product.status
        }))
        return formattedProducts;
    }
}