import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import ProductsController from '../controllers/products.controllers.js';

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
router.post('/', upload.single('thumbnail'), async (req, res) => {
  try {
    const { body, file } = req;
    
    // Si se proporciona un archivo, utiliza la ruta del archivo
    const thumbnail = file ? `/uploads/${file.filename}` : '';

    // Agrega la ruta del archivo a los datos del producto
    const productData = { ...body, thumbnail };

    const product = await ProductsController.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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