import ProductsService from "../services/product.service.js";

export default class ProductsController {
    static async getAll(filters = {}, opts = {}) {
        // Obtener productos
        const productos = await ProductsService.getAll(filters, opts);
        return productos;
    }

    static async getById(pid) {
        const product = await ProductsService.getById(pid);
        return product;
    }

    static async create(data) {
        const product = await ProductsService.create(data);
        return product;
    }


    static async updateById(pid, data) {
        await ProductsService.updateById(pid, data);
    }

    static async deleteById(pid) {
        await ProductsService.deleteById(pid);
    }
    //Metodo para Stock
    static async updateStockById(pid, newStock) {
        try {
            // Obtener el producto por su ID
            const product = await ProductsService.getById(pid);

            // Verificar si el producto existe
            if (!product) {
                throw new Error(`Producto con ID ${pid} no encontrado`);
            }

            // Actualizar solo el stock del producto
            product.stock = newStock;

            // Guardar la actualización
            await ProductsService.updateById(pid, { stock: newStock });

            // Devolver el producto actualizado
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
        }
}
}
