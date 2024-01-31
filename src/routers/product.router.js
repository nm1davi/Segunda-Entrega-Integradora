import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import ProductsController from '../controllers/products.controllers.js';
import { generateProduct } from '../utils/utils.js';
import { generatorProductError } from '../utils/causeMessageError.js';
import {customError} from '../utils/customError.js';
import enumsError from '../utils/enumsError.js';


const router = Router();

// Configuración de multer para manejar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); // Ruta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

// Ruta para crear un producto
router.post('/', upload.single('thumbnail'), async (req, res, next) => {
  try {
    const { body, file } = req;
    const { 
      title,
      description,
      price,
      code,
      stock,
      category,
      status } = body;
      if (   
        !title || !description || !price || !code || !stock || !category || status === undefined ){
          const errorMessage = generatorProductError(body);
          customError.create({
            name : 'Invalid data Product',
            cause: errorMessage,
            message: 'Ocurrio un error mientras se intenta agregar un Producto ❌',
            code: enumsError.INVALID_PARAMS_ERROR,
          });
        }
          const thumbnail = file ? `/uploads/${file.filename}` : '';
          // Agrega la ruta del archivo a los datos del producto
          const productData = { ...body, thumbnail };
          const product = await ProductsController.create(productData);
          res.status(201).json(product);
          // Si se proporciona un archivo, utiliza la ruta del archivo
  } catch (error) {
    next(error);
  }
});
    
//Ruta para ver mockingproducts
router.get('/mockingproducts', async (req, res) => {
  const products = [];
  for (let index = 0; index < 100; index++) {
    products.push(generateProduct());
  }
  res.render('mockingproducts', {
    title: 'Mockingproducts ✅',
    products: products
  });
});

// Ruta para actualizar un producto
router.put('/:productId', upload.single('thumbnail'), async (req, res) => {
  try {
    const { params, body, file } = req;
    const productId = params.productId;

    const thumbnail = file ? `/uploads/${file.filename}` : '';


    const productData = { ...body, thumbnail };

    await ProductsController.updateById(productId, productData);
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

    
    // Ruta para eliminar un producto
    router.delete('/:productId', async (req, res) => {
      try {
        const { productId } = req.params;
        await ProductsController.deleteById(productId);
        res.status(204).json({message: 'Product deleted successfully'});
      } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

export default router;