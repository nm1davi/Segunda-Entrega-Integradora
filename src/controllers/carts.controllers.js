import CartService from '../services/carts.service.js';
export default class CartController {
  static async getCartById(cartId) {
    const cart = await CartService.getById(cartId);
    return cart;
  }
}
