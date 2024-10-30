import express from 'express';
import cartManager from '../manager/cartManager.js';

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

router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const result = await cartManager.addProductToCart(cartId, productId);
    return result.success ? res.status(200).send(result.message) : res.status(404).send(result.message);
  } catch (error) {
    next(error);
  }
});

export default router;
