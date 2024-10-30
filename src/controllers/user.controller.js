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
      return res.render('register', { 
        error: 'El correo electrónico ya está registrado. Inténtalo con otro.' 
      });
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
      cartId: user.cart.toString(),
    };

    res.redirect('/products');
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    const errorMessages = [];
    
    if (error.errors) {
      for (let field in error.errors) {
        errorMessages.push({
          field,
          message: error.errors[field].message,
        });
      }
    } else {
      errorMessages.push({ field: 'general', message: 'Ocurrió un problema al registrar el usuario. Inténtalo más tarde.' });
    }

    return res.render('register', { errors: errorMessages });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user || !user.password) {
      return res.render('login', { error: 'Credenciales inválidas. Inténtalo de nuevo.' });
    }

    if (!isValidPassword(password, user.password)) {
      return res.render('login', { error: 'Credenciales inválidas. Inténtalo de nuevo.' });
    }

    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      cartId: user.cart.toString(),
    };

    const token = generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/products');
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.render('login', { error: 'Ocurrió un problema al iniciar sesión. Inténtalo de nuevo.' });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);

  if (!user) {
    return res.render('request-password-reset', { error: 'Usuario no encontrado' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
console.log(resetLink)
  try {
    await sendPasswordResetEmail(email, resetLink);
    res.render('request-password-reset', { success: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico.' });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.render('request-password-reset', { error: 'No se pudo enviar el correo de restablecimiento.' });
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
      return res.render('reset-password', { error: 'La nueva contraseña no puede ser igual a la anterior.', token });
    }

    user.password = createHash(newPassword);
    await user.save();
    res.render('reset-success');
  } catch (error) {
    res.render('link-expired');
  }
};

