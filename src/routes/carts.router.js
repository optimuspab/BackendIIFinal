import express from 'express';
import cartManager from '../manager/cartManager.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    console.log('Solicitud para crear un nuevo carrito recibida.');

    const result = await cartManager.createCart();

    if (result.success) {
      console.log('Carrito creado exitosamente:', result.cart);
      res.status(201).json(result.cart);
    } else {
      return next(new Error('Error al crear el carrito'));
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:cid', async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const result = await cartManager.getCartById(cartId);

    if (result.success) {
      res.status(200).json(result.cart.products);
    } else {
      return res.status(404).send(result.message);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    console.log('Agregando producto al carrito:', { cartId, productId });

    const result = await cartManager.addProductToCart(cartId, productId);

    if (result.success) {
      console.log('Producto agregado exitosamente:', result.message);
      res.status(200).send(result.message);
    } else {
      return res.status(404).send(result.message);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
