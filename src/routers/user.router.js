import { Router } from "express";
import { UserDTO } from "../dto/user.dto.js";
import { upload } from "../middlewares/multer-middleware.js";
import { logger } from "../config/logger.js";
import { authorizeUser, authorizeAdmin } from "../middlewares/authorize-middlewares.js";


import userModel from "../dao/models/user.model.js";
import ProductsController from '../controllers/products.controllers.js'

const router = Router();

// obtenerCarritoDelUsuario
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

//Redirect a Formulario de agregar documentos
router.get("/add/documents", authorizeUser, async (req, res) => {
  try {
    const userDTO = new UserDTO(req.user);
    res.render("addDocuments", {
      title: "Agregar Documentos",
      user: userDTO,
    });
  } catch (error) {
    logger.error("Error:", error);
    res.render("error", { title: "Error ❌", messageError: "Error" });
  }
});

//Agregar Documentos
router.post("/:uid/documents", upload.single("archivo"), async (req, res) => {
  try {
    const fileType = "document";
    const filePath = req.file.path;
    const fileName = "archivo";

    console.log(`fileType: ${fileType}`);
    console.log(`filePath: ${filePath}`);
    res.status(200).json(`Archivo cargado exitosamente: ${fileName}`);
  } catch (error) {
    logger.error("Error:", error);
    res.status(500).json({ error: "Error al subir el documento" });
  }
});

//Perfil del Premium
router.get('/premium', authorizeAdmin, async (req, res) =>{
  try {
    const productos = await ProductsController.getAll();
    const userDTO = new UserDTO(req.user);
    const userCart = await obtenerCarritoDelUsuario(req.user._id); 
    res.render('premiumProfile', {
      title: 'Perfil Premium',
      user: userDTO,
      products: productos,
      cart: userCart 
      
    })
  } catch (error) {
    logger.error("Error:", error);
    res.render("error", { title: "Error ❌", messageError: "Error" });
  }
})

//Cambiar el rol de user a premium y viceversa
router.put('/premium/:uid', async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();
    req.session.userRole = user.role;
    // Mostramos msj de éxito
    res.status(200).json({ message: 'Rol cambiado con éxito', role: user.role });
  } catch (error) {
    logger.error('Error:', error);
    res.status(500).json({ error: 'Error al cambiar el rol' });
  }
});

//Agregar un producto siendo Premium
router.get('/premium/addProduct', async (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.render('addProductPremium', {
    title: 'Premium ✅',
    user: userDTO,
  });
});
//Eliminar un producto siendo Premium
router.get('/premium/deleteProduct', async (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.render('deleteProductPremium', {
    title: 'Premium ✅',
    user: userDTO,
  });
});



export default router;
