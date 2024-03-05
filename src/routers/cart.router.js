import { Router } from 'express';

import Cart from '../dao/models/cart.model.js';
import Producto from '../dao/models/product.model.js';
import userModel from '../dao/models/user.model.js';

import TicketsService from '../services/ticket.service.js';

import CartController from '../controllers/carts.controllers.js';
import ProductsController from '../controllers/products.controllers.js';
import { logger } from '../config/logger.js';

import { v4 as uuidv4 } from 'uuid';
import Handlebars from 'handlebars';




const router = Router();

// Middleware para verificar si un carrito existe
const checkCartExists = async (req, res, next) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    req.cart = cart;
    next();
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const myMiddleware = (req, res, next) => {
  logger.info("Se ha recibido una nueva solicitud de Carrito");
  next();
};
Handlebars.registerHelper('multiply', function(a, b) {
  return a * b;
});

//Router para renderizar el carrito con los Productos
router.get('/:cid', myMiddleware, async (req, res) => {
  const { cid } = req.params;
  try {
    const cartInfo = await CartController.getCartById(cid);


    if (!cartInfo) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.render('cart', {
      title: "Carrito",
      cartId: cartInfo._id,
      user: req.user.toJSON(),
      products: cartInfo.products,
    });
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//Router para ver la informacion del Carrito del Cliente
router.get('/cartinfo/:cid', myMiddleware, async (req, res) => {
  const { cid } = req.params;
  try {
    const cartInfo = await CartController.getCartById(cid);


    if (!cartInfo) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cartInfo);
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ productos: [] });
    res.status(201).json({ message: 'Nuevo carrito creado', cartId: newCart._id });
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const product = await Producto.findById(pid);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.productos.findIndex(item => item.product && item.product._id && item.product._id.toString() === pid);

    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      cart.productos[existingProductIndex].quantity += parseInt(quantity);
    } else {
      // Si el producto no está en el carrito, agrégalo con detalles completos
      cart.productos.push({
        product: {
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail,
          code: product.code,
          stock: product.stock,
          category: product.category,
          status: product.status,
          _id: product._id // Asegurar que se incluya el ID del producto
        },
        quantity: parseInt(quantity)
      });
    }

    await cart.save();

    // Obtener el carrito actualizado con todos los detalles de los productos
    const updatedCart = await Cart.findById(cid).populate('productos.product');

    res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart: updatedCart });
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});





// Eliminar una unidad del producto específico del carrito
router.delete('/:cid/product/:pid', checkCartExists, async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const { cart } = req;
    const productIndex = cart.productos.findIndex(product => product.product._id.toString() === pid);

    if (productIndex !== -1) {
      if (cart.productos[productIndex].quantity > 1) {
        cart.productos[productIndex].quantity -= 1; // Restar una unidad
      } else {
        cart.productos.splice(productIndex, 1); // Si la cantidad es 1, eliminar completamente el producto
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Se eliminó una unidad del producto del carrito', cart });
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', checkCartExists, async (req, res) => {
  const { pid } = req.params;
  const { quantity } = req.body;

  try {
    const { cart } = req;
    const product = cart.productos.find(p => p._id.equals(pid));

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    if (quantity !== undefined) {
      product.quantity = quantity; // Actualizar la cantidad del producto en el carrito
      await cart.save(); // Guardar los cambios en el carrito
      return res.status(200).json({ message: 'Cantidad del producto actualizada con éxito', cart });
    } else {
      return res.status(400).json({ error: 'Cantidad no proporcionada correctamente' });
    }
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar el carrito con un nuevo arreglo de productos
router.put('/:cid', checkCartExists, async (req, res) => {
  const { cid } = req.params;
  const { productos } = req.body;

  try {
    const { cart } = req;

    // Limpiar los productos actuales del carrito antes de actualizar con nuevos productos
    cart.productos = [];

    // Verifica si se proporciona un arreglo de productos
    if (productos && Array.isArray(productos)) {
      // Agrega cada producto del arreglo al carrito con su cantidad correspondiente
      productos.forEach(producto => {
        cart.productos.push({
          product: { ...producto }, // Guarda el producto completo en lugar de solo algunos campos
          quantity: producto.quantity 
        });
      });
    }

    await cart.save();

    // Obtiene el carrito actualizado con todos los detalles de los productos
    const updatedCart = await Cart.findById(cid).populate('productos.product');

    res.status(200).json({ message: 'Carrito actualizado con éxito', cart: updatedCart });
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Eliminar todos los productos del carrito
router.delete('/:cid', checkCartExists, async (req, res) => {
  try {
    const { cart } = req;
    cart.productos = [];
    await cart.save();
    res.status(200).json({ message: 'Todos los productos del carrito han sido eliminados' });
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// // Ruta para finalizar el proceso de compra del carrito
router.post('/:cid/purchase', async (req, res) => {
  const { cid } = req.params;
  try {
    // Obtener el usuario con su carrito (si existe la relación)
    const user = await userModel.findOne({ cart: cid }).populate('cart');
    
    if (!user || !user.cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const cart = await Cart.findById(cid).populate('productos.product');

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const pricesInCart = cart.productos.map(item => ({
      productId: item.product._id,
      price: item.product.price,
    }));

    // Verificar el stock y realizar la compra
    const productsToPurchase = [];
    const productsNotPurchased = [];

    for (const item of cart.productos) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      // Verificar si hay suficiente stock para la cantidad solicitada
      if (product.stock >= requestedQuantity) {
        // Actualizar el stock del producto
        await ProductsController.updateStockById(product._id, product.stock - requestedQuantity);

        // Agregar el producto a la lista de productos a comprar
        productsToPurchase.push({
          product: product._id,
          quantity: requestedQuantity
        });
      } else {
        productsNotPurchased.push(product._id);
      }
    }

    // Filtrar los productos no comprados
    const productsNotPurchasedInfo = cart.productos.filter(item => productsNotPurchased.includes(item.product._id));

    // Guardar los productos no comprados en el carrito
    cart.productos = productsNotPurchasedInfo;
    await cart.save();
    
    if (productsToPurchase.length === 0) {
      return res.status(400).json({
        error: 'Todos los productos en el carrito están fuera de stock',
        cart: productsNotPurchasedInfo,
      });
    }
    
    // Crear un ticket solo con los productos comprados
    const email = user.email;

    const ticketData = {
      code: generateTicketCode(),
      amount: calculateTotalAmount(productsToPurchase, pricesInCart),
      purchaser: email,
      products: productsToPurchase.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: pricesInCart.find(p => p.productId.equals(item.product)).price
      })),
    };
    const ticket = await TicketsService.create(ticketData);

    res.status(201).json({
      message: 'Compra realizada con éxito',
      ticket,
      productsNotPurchased: productsNotPurchasedInfo,
    });
  } catch (error) {
    logger.error('Error: ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




// Función para generar un código de ticket (puedes implementar tu propia lógica)
function generateTicketCode() {
    const uuid = uuidv4().replace(/-/g, '');
    return uuid.substr(0, 10).toUpperCase();
}


// Función para calcular el monto total de la compra
function calculateTotalAmount(products, pricesInCart) {
  return products.reduce((total, item) => {
    const productPrice = pricesInCart.find(p => p.productId.equals(item.product)).price;
    const quantity = item.quantity;

    // Verificar si tanto el precio como la cantidad son números antes de sumarlo al total
    if (typeof productPrice === 'number' && typeof quantity === 'number') {
      return total + (productPrice * quantity);
    } else {
      console.error('Error: El precio o la cantidad del producto no son números', item.product);
      logger.error(`productPrice: ${productPrice}, quantity: ${quantity}`);
      return total;
    }
  }, 0);
}




export default router;
