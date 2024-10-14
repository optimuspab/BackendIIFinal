import Cart from '../daos/cart.dao.js';

class CartManager {
    async createCart() {
        try {
            const newCart = new Cart();
            console.log("Nuevo carrito creado:", newCart);

            const savedCart = await newCart.save();
            console.log("Carrito guardado en la base de datos:", savedCart);
            return { success: true, cart: savedCart };
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return { success: false, message: 'Error al crear el carrito' };
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product').exec();
            if (!cart) {
                return { success: false, message: 'Carrito no encontrado' };
            }
            return { success: true, cart };
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            return { success: false, message: 'Error al obtener el carrito' };
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cartResult = await this.getCartById(cartId);
            if (!cartResult.success) {
                return cartResult;
            }

            const cart = cartResult.cart;
            const productInCart = cart.products.find(p => p.product._id.toString() === productId);

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            return { success: true, message: 'Producto agregado al carrito' };
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return { success: false, message: 'Error al agregar producto al carrito' };
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cartResult = await this.getCartById(cartId);
            if (!cartResult.success) {
                return cartResult;
            }
    
            const cart = cartResult.cart;
            const initialProductCount = cart.products.length;
    
            cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
    
            if (cart.products.length === initialProductCount) {
                return { success: false, message: `Producto no encontrado en el carrito: ${productId}` };
            }
    
            await cart.save();
            return { success: true, message: 'Producto eliminado del carrito' };
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            return { success: false, message: 'Error al eliminar producto del carrito' };
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cartResult = await this.getCartById(cartId);
            if (!cartResult.success) {
                return cartResult;
            }

            const cart = cartResult.cart;
            const productInCart = cart.products.find(p => p.product._id.toString() === productId);

            if (productInCart) {
                productInCart.quantity = quantity;
            } else {
                return { success: false, message: 'Producto no encontrado en el carrito' };
            }

            await cart.save();
            return { success: true, message: 'Cantidad actualizada' };
        } catch (error) {
            console.error('Error al actualizar cantidad del producto en el carrito:', error);
            return { success: false, message: 'Error al actualizar cantidad del producto en el carrito' };
        }
    }

    async updateCart(cartId, products) {
        try {
            const cartResult = await this.getCartById(cartId);
            if (!cartResult.success) {
                return cartResult;
            }

            const cart = cartResult.cart;
            cart.products = products.map(p => ({
                product: p.product.toString(),
                quantity: p.quantity
            }));

            await cart.save();
            return { success: true, message: 'Carrito actualizado' };
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            return { success: false, message: 'Error al actualizar el carrito' };
        }
    }

    async clearCart(cartId) {
        try {
            const cartResult = await this.getCartById(cartId);
            if (!cartResult.success) {
                return cartResult;
            }

            const cart = cartResult.cart;
            cart.products = [];

            await cart.save();
            return { success: true, message: 'Carrito vaciado' };
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            return { success: false, message: 'Error al vaciar el carrito' };
        }
    }

}

export default new CartManager();
