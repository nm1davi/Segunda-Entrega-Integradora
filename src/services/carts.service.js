import CartDao from "../dao/cart.mongodb.dao.js";

const cartDao = new CartDao();

export default class CartService {
  static getById(cartId) {
    return cartDao.getById(cartId);
  }
}
