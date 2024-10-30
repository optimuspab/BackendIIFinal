import express from 'express';
import bcrypt from 'bcrypt';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth.middleware.js';
import CartManager from '../manager/cartManager.js';
import User from '../daos/user.dao.js';

const router = express.Router();

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
      cart: cartResult.cart._id,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente.', user: savedUser });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('cart');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { first_name, last_name, email, age },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario actualizado exitosamente.', user: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/password', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (req.user._id !== id) {
      return res.status(403).json({ message: 'Acceso denegado.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña antigua incorrecta.' });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    next(error);
  }
});

export default router;
