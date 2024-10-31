import express from 'express';
import cartManager from '../manager/cartManager.js';
import { authMiddleware, userOnlyMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const result = await cartManager.createCart();
    return result.success ? res.status(201).json(result.cart) : next(new Error('Error al crear el carrito'));
  } catch (error) {
    next(error);
  }
});

router.get('/:cid', async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const result = await cartManager.getCartById(cartId);
    return result.success ? res.status(200).json(result.cart.products) : res.status(404).send(result.message);
  } catch (error) {
    next(error);
  }
});

router.post('/:cid/product/:pid', authMiddleware, userOnlyMiddleware, async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const result = await cartManager.addProductToCart(cartId, productId);
    return result.success ? res.status(200).send(result.message) : res.status(404).send(result.message);
  } catch (error) {
    next(error);
  }
});

router.delete('/:cartId/product/:productId', async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const result = await cartManager.removeProductFromCart(cartId, productId);
    if (result.success) {
      res.status(200).json({ message: 'Producto eliminado del carrito' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito', error: error.message });
  }
});

export default router;
