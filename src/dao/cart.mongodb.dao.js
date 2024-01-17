import cartModel from "./models/cart.model.js";

export default class CartDao {
  async getById(cartId) {
    try {
      const cart = await cartModel.findById(cartId).populate('productos.product');
  
      if (!cart) {
        return null; // Retornar null si el carrito no se encuentra
      }
  
      return {
        _id: cart._id,
        products: cart.productos.map(item => ({
          _id: item.product._id,
          title: item.product.title,
          description: item.product.description,
          price: item.product.price,
          thumbnail: item.product.thumbnail,
          code: item.product.code,
          stock: item.product.stock,
          category: item.product.category,
          status: item.product.status,
          quantity: item.quantity
        }))
      };
    } catch (error) {
      console.error('Error al obtener información del carrito:', error);
      throw new Error('Error interno al obtener información del carrito');
    }
  }
}
