import jwt from 'jsonwebtoken';
import User from '../daos/user.dao.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado, token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado, se requieren permisos de administrador' });
  }
  next();
};
