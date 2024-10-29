import cartService from '../services/cart.service.js';

class CartManager {
    async createCart() {
        try {
            const newCart = await cartService.createCart();
            console.log("Nuevo carrito creado:", newCart);
            return { success: true, cart: newCart };
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return { success: false, message: 'Error al crear el carrito' };
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartService.getCartById(id);
            return { success: true, cart };
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            return { success: false, message: error.message };
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            await cartService.addProductToCart(cartId, productId);
            return { success: true, message: 'Producto agregado al carrito' };
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return { success: false, message: error.message };
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            await cartService.removeProductFromCart(cartId, productId);
            return { success: true, message: 'Producto eliminado del carrito' };
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            return { success: false, message: error.message };
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            await cartService.updateProductQuantity(cartId, productId, quantity);
            return { success: true, message: 'Cantidad actualizada' };
        } catch (error) {
            console.error('Error al actualizar cantidad del producto en el carrito:', error);
            return { success: false, message: error.message };
        }
    }

    async updateCart(cartId, products) {
        try {
            await cartService.updateCart(cartId, products);
            return { success: true, message: 'Carrito actualizado' };
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            return { success: false, message: error.message };
        }
    }

    async clearCart(cartId) {
        try {
            await cartService.clearCart(cartId);
            return { success: true, message: 'Carrito vaciado' };
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            return { success: false, message: error.message };
        }
    }
}

export default new CartManager();