import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../daos/user.dao.js';
import CartManager from '../manager/cartManager.js'; 

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    const cartResult = await CartManager.createCart();
    if (!cartResult.success) {
      return next(new Error('Error al crear el carrito'));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: cartResult.cart._id 
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente.', user: savedUser });
  } catch (error) {
    next(error);
  }
});

export default router;
