import userService from '../services/user.services.js';
import { createResponse, isValidPassword, createHash } from '../utils/utils.js';
import { generateToken } from '../utils/jwt.utils.js';
import { sendPasswordResetEmail } from '../services/email.service.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado. Inténtalo con otro.' });
      } else {
        return res.render('register', { error: 'El correo electrónico ya está registrado. Inténtalo con otro.' });
      }
    }

    const hashedPassword = createHash(password);
    const user = await userService.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      cartId: user.cart ? user.cart.toString() : null,
    };

    if (req.headers['content-type'] === 'application/json') {
      return res.json({ message: 'Registro exitoso', user: req.session.user });
    } else {
      return res.redirect('/products');
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user || !user.password) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      } else {
        return res.render('login', { error: 'Credenciales inválidas. Inténtalo de nuevo.' });
      }
    }

    const validPassword = isValidPassword(password, user.password);
    if (!validPassword) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      } else {
        return res.render('login', { error: 'Credenciales inválidas. Inténtalo de nuevo.' });
      }
    }

    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      cartId: user.cart ? user.cart.toString() : null,
    };

    const token = generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });

    if (req.headers['content-type'] === 'application/json') {
      return res.json({ message: 'Inicio de sesión exitoso', user: req.session.user });
    } else {
      return res.redirect('/products');
    }
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);

  if (!user) {
    if (req.headers['content-type'] === 'application/json') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      return res.render('request-password-reset', { error: 'Usuario no encontrado' });
    }
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
  console.log(resetLink);

  try {
    await sendPasswordResetEmail(email, resetLink);
    if (req.headers['content-type'] === 'application/json') {
      return res.json({ message: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico.' });
    } else {
      res.render('request-password-reset', { success: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico.' });
    }
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error);
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ error: 'No se pudo enviar el correo de restablecimiento.' });
    } else {
      res.render('request-password-reset', { error: 'No se pudo enviar el correo de restablecimiento.' });
    }
  }
};

export const verifyResetLink = async (req, res) => {
  const { token } = req.params;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.render('reset-password', { token });
  } catch (error) {
    res.render('link-expired');
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.getUserById(decoded.userId);

    if (isValidPassword(newPassword, user.password)) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior.' });
      } else {
        return res.render('reset-password', { error: 'La nueva contraseña no puede ser igual a la anterior.', token });
      }
    }

    user.password = createHash(newPassword);
    await user.save();

    if (req.headers['content-type'] === 'application/json') {
      return res.json({ message: 'Contraseña restablecida con éxito' });
    } else {
      res.render('reset-success');
    }
  } catch (error) {
    if (req.headers['content-type'] === 'application/json') {
      return res.status(400).json({ error: 'El enlace de restablecimiento ha expirado o es inválido.' });
    } else {
      res.render('link-expired');
    }
  }
};
