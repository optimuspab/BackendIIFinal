import ProductDAO from '../daos/product.dao.js';
import fs from 'fs';
import path from 'path';

const productDAO = new ProductDAO();

class ProductManager {
    async addProduct(title, description, price, stock, category, thumbnails = []) {
        console.log('Adding product:', { title, description, price, stock, category, thumbnails });
    
        const newProductData = { title, description, price, stock, category, thumbnails };

        try {
            const savedProduct = await productDAO.create(newProductData);
            const successMsg = `Producto agregado con ID ${savedProduct._id}`;
            console.log('Product saved:', savedProduct);
            return { success: true, message: successMsg, newProduct: savedProduct };
        } catch (error) {
            console.error('Error saving product:', error.message);
            return { success: false, message: 'Error al agregar producto: ' + error.message };
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const products = await productDAO.findAll(filter, options);
            return {
                docs: products.docs,
                totalDocs: products.totalDocs,
                totalPages: products.totalPages,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage
            };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return { docs: [], totalDocs: 0, totalPages: 0, page: 1, hasPrevPage: false, hasNextPage: false };
        }
    }

    async getProductById(id) {
        try {
            const product = await productDAO.findById(id);
            if (!product) {
                const errorMsg = `No existe producto con el ID ${id}.`;
                return { success: false, message: errorMsg };
            }
            return { success: true, product };
        } catch (error) {
            return { success: false, message: 'Error al obtener producto: ' + error.message };
        }
    }

    async updateProduct(id, updatedInfo) {
        try {
            const product = await productDAO.update(id, updatedInfo);
            if (!product) {
                const errorMsg = `El producto con el ID ${id} no se encuentra.`;
                return { success: false, message: errorMsg };
            }
            return { success: true, product, message: 'Producto actualizado exitosamente.' };
        } catch (error) {
            return { success: false, message: 'Error al actualizar producto: ' + error.message };
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productDAO.delete(id);
            if (!product) {
                console.log(`El producto con el ID ${id} no se encuentra.`);
                return { success: false, message: `Producto con ID ${id} no encontrado` };
            }
    
            if (product.thumbnails && product.thumbnails.length > 0) {
                for (let thumbnail of product.thumbnails) {
                    if (thumbnail.startsWith('/files/uploads/')) {
                        const imagePath = path.join(__dirname, '..', 'public', thumbnail);
                        console.log(`Intentando eliminar la imagen en: ${imagePath}`);
    
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                            console.log(`Imagen eliminada: ${imagePath}`);
                        } else {
                            console.log(`La imagen no se encontró en la ruta: ${imagePath}`);
                        }
                    }
                }
            }
    
            console.log('Producto eliminado:', product);
            return { success: true, message: 'Producto eliminado exitosamente' };
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return { success: false, message: 'Error al eliminar producto: ' + error.message };
        }
    }    
}

export default new ProductManager();
