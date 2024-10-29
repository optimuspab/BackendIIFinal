import cartDAO from '../daos/cart.dao.js';

class CartService {
    async createCart() {
        try {
            return await cartDAO.createCart({ products: [] });
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await cartDAO.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            const productInCart = cart.products.find(p => p.product_id === productId);

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
            cart.products.push({ product_id: productId, quantity: 1 });
            }

            return await cartDAO.updateCart(cartId, cart.products);
        } catch (error) {
            throw new Error('Error al agregar producto al carrito: ' + error.message);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            const initialProductCount = cart.products.length;

            cart.products = cart.products.filter(p => p.product_id !== productId);

            if (cart.products.length === initialProductCount) {
                throw new Error(`Producto no encontrado en el carrito: ${productId}`);
            }

            return await cartDAO.updateCart(cartId, cart.products);
        } catch (error) {
            throw new Error('Error al eliminar producto del carrito: ' + error.message);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            const productInCart = cart.products.find(p => p.product_id === productId);

            if (productInCart) {
                productInCart.quantity = quantity;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }

            return await cartDAO.updateCart(cartId, cart.products);
        } catch (error) {
            throw new Error('Error al actualizar cantidad del producto en el carrito: ' + error.message);
        }
    }

    async updateCart(cartId, products) {
        try {
            return await cartDAO.updateCart(cartId, { products });
        } catch (error) {
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }

    async clearCart(cartId) {
        try {
            return await cartDAO.updateCart(cartId, { products: [] });
        } catch (error) {
            throw new Error('Error al vaciar el carrito: ' + error.message);
        }
    }
}

export default new CartService();