import { Router } from 'express';
import userModel from '../models/user.model.js'
import ProductsController from '../controllers/products.controllers.js'

const router = Router();

//GET INICIO
router.get('/', async (req, res) => {
  try {
    res.render('index',{ title: 'Inicio',})
  } catch (error) {
    console.error('Error:', error);
    res.render('error', { title: 'Error ❌', messageError: 'Error' });
  }
  });

  export async function obtenerCarritoDelUsuario(userId) {
    try {
      const usuario = await userModel.findById(userId).populate('cart');
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      
      return usuario.cart; // Devuelve el carrito asociado al usuario
    } catch (error) {
      throw new Error('Error al obtener el carrito del usuario: ' + error.message);
    }
  }
  
//GET DE PROFILE
router.get('/profile', async (req, res) => {
  if(!req.user){
    return res.redirect('login');
  }
  try {
    // Obtener productos
    const productos = await ProductsController.getAll();

    // Obtener información del carrito del usuario desde la base de datos
    const userCart = await obtenerCarritoDelUsuario(req.user._id); // Suponiendo una función ficticia para obtener el carrito

    // Renderizar la vista 'profile' y pasar datos a la plantilla
    res.render('profile', {
      title: 'Profile ✅',
      user: req.user.toJSON(),
      products: productos,
      cart: userCart // Pasar la información del carrito a la vista
    });
  } catch (error) {
    console.error('Error al obtener información para el perfil:', error);
    res.render('error', { title: 'Error ❌', messageError: 'Error al obtener información para el perfil' });
  }
});

//GET DE LOGIN
router.get('/login', (req, res) => {
  res.render('login',{title: 'Login ✅'})
});

//GET DE REGISTER
router.get('/register', (req, res) => {
  res.render('register',{title: 'Register ✅'})
});

//GET DE RECUPERAR CONTRASEÑA
router.get('/recovery-password', (req, res) => {
  res.render('recover-password', {title: 'Recuperar Contraseña'})
});


export default router;