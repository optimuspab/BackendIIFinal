import ProductDAO from '../daos/product.dao.js';
import fs from 'fs';
import path from 'path';

const productDAO = new ProductDAO();

class ProductManager {
    async addProduct(title, description, price, stock, category, thumbnails = []) {
        const newProductData = { title, description, price, stock, category, thumbnails };
        try {
            const savedProduct = await productDAO.create(newProductData);
            return { success: true, message: `Producto agregado con ID ${savedProduct._id || savedProduct.id}`, newProduct: savedProduct };
        } catch (error) {
            return { success: false, message: 'Error al agregar producto: ' + error.message };
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const products = await productDAO.findAll(filter, options);
            return products;
        } catch (error) {
            return { docs: [], totalDocs: 0, totalPages: 0, page: 1 };
        }
    }

    async getProductById(id) {
        try {
            const product = await productDAO.findById(id);
            return product ? { success: true, product } : { success: false, message: `No existe producto con el ID ${id}.` };
        } catch (error) {
            return { success: false, message: 'Error al obtener producto: ' + error.message };
        }
    }

    async updateProduct(id, updatedInfo) {
        try {
            const product = await productDAO.update(id, updatedInfo);
            return product ? { success: true, product, message: 'Producto actualizado exitosamente.' } : { success: false, message: `El producto con el ID ${id} no se encuentra.` };
        } catch (error) {
            return { success: false, message: 'Error al actualizar producto: ' + error.message };
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productDAO.delete(id);
            if (!product) {
                return { success: false, message: `Producto con ID ${id} no encontrado` };
            }
            await this._deleteThumbnails(product.thumbnails);
            return { success: true, message: 'Producto eliminado exitosamente' };
        } catch (error) {
            return { success: false, message: 'Error al eliminar producto: ' + error.message };
        }
    }

    async _deleteThumbnails(thumbnails) {
        if (thumbnails && thumbnails.length > 0) {
            for (let thumbnail of thumbnails) {
                if (thumbnail.startsWith('/files/uploads/')) {
                    const imagePath = path.join(__dirname, '..', 'public', thumbnail);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
            }
        }
    }
}

export default new ProductManager();
