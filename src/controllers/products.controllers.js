import ProductsService from "../services/product.service.js";

export default class ProuctsController{
      static async getAll(filters = {}, opts = {}){
                // Obtener productos
    const productos = await ProductsService.getAll(filters, opts);
    return productos;
      };
}