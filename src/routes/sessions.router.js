import express from 'express';
import { generateToken } from '../utils/jwt.utils.js';
import { registerUser } from '../controllers/user.controller.js';
import { getUserByEmail } from '../daos/user.dao.js';
import { createHash, isValidPassword } from '../utils/utils.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import CartManager from '../manager/cartManager.js';  
import UserDTO from '../dto/user.dto.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user || !isValidPassword(password, user)) {
      return res.status(401).send('Credenciales inválidas');
    }

    if (!user.cart) {
      const cartResult = await CartManager.createCart();
      if (cartResult.success) {
        user.cart = cartResult.cart._id;
        await user.save();
      } else {
        return res.status(500).send('Error al crear el carrito');
      }
    }

    const token = generateToken(user);
    res.cookie('jwt', token, { httpOnly: true }).send('Inicio de sesión exitoso');
  } catch (error) {
    next(error);
  }
});

router.get('/current', authMiddleware, (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.send(userDTO);
});

export default router;
