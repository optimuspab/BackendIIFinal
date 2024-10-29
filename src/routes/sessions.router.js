import express from 'express';
import { generateToken } from '../utils/jwt.utils.js';
import { registerUser } from '../controllers/user.controller.js';
import { getUserByEmail } from '../daos/user.dao.js';
import { createHash, isValidPassword } from '../utils/utils.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import CartManager from '../manager/cartManager.js';
import UserDTO from '../dto/user.dto.js';
import { userValidator } from '../middleware/userValidator.js';

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/register', userValidator, registerUser);

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

    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      cartId: user.cart.toString()
    };
    
    const token = generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });
    return res.redirect('/products');   
  } catch (error) {
    next(error);
  }
});


router.get('/current', authMiddleware, (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.send(userDTO);
});

router.get('/profile', authMiddleware, async (req, res, next) => {
  try {

      const userId = req.session.user._id;
      const user = await getUserById(userId);

      const userProfile = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          cartId: user.cart.toString()
      };

      res.render('profile', { user: userProfile });
  } catch (error) {
      next(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/login');
  });
});


export default router;
