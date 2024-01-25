import { Router } from 'express';
import userModel from '../dao/models/user.model.js'
import ProductsController from '../controllers/products.controllers.js'
import { UserDTO } from '../dto/user.dto.js';

const router = Router();

//MIDLEWARES 
const authorizeAdmin = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos de administrador' });
  }
  next();
};

const authorizeUser = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== 'user') {
    return res.status(403).json({ message: 'No tienes permisos de usuario' });
  }
  next();
};


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

  //GET DE PROFILE USER
router.get('/profile', authorizeUser , async (req, res) => {
  if(!req.user){
    return res.redirect('login');
  }
  try {
    // Obtener productos
    const productos = await ProductsController.getAll();

    // Obtener información del carrito del usuario desde la base de datos
    const userCart = await obtenerCarritoDelUsuario(req.user._id); 
    const userDTO = new UserDTO(req.user);
    
    res.render('profile', {
      title: 'Profile ✅',
      user: userDTO,
      products: productos,
      cart: userCart 
    });
  } catch (error) {
    console.error('Error al obtener información para el perfil:', error);
    res.render('error', { title: 'Error ❌', messageError: 'Error al obtener información para el perfil' });
  }
});

router.get('/contact', authorizeUser , async (req, res) => {
  if(!req.user){
    return res.redirect('login');
  }
  try {

    const userDTO = new UserDTO(req.user);
    
    res.render('contact', {
      title: 'Conctact ✅',
      user: userDTO,
    });
  } catch (error) {
    console.error('Error al obtener información para el perfil:', error);
    res.render('error', { title: 'Error ❌', messageError: 'Error al obtener información para el perfil' });
  }
});

  //GET DE ADMIN PROFILE
router.get('/admin', authorizeAdmin, async (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.render('adminProfile', {
    title: 'Admin ✅',
    user: userDTO,
  });
});
  //GET DE ADD PRODUCT
router.get('/admin/addProduct', authorizeAdmin, async (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.render('addProduct', {
    title: 'Admin ✅',
    user: userDTO,
  });
});
  //GET DE DELETE PRODUCT
router.get('/admin/deleteProduct', authorizeAdmin, async (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.render('deleteProduct', {
    title: 'Admin ✅',
    user: userDTO,
  });
});
  //GET DE UPDATE PRODUCT
router.get('/admin/updateProduct', authorizeAdmin, async (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.render('updateProduct', {
    title: 'Admin ✅',
    user: userDTO,
  });
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