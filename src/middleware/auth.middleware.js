import jwt from 'jsonwebtoken';
import { getUserById } from '../daos/user.dao.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers['authorization']?.split(' ')[1];
  console.log("Token recibido en authMiddleware:", token);
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado, token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);

    const user = await getUserById(decoded.id); 
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en verificación del token:", error.message);
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado, se requieren permisos de administrador' });
  }
  next();
};

export const userOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Acceso denegado, solo usuarios puede agregar productos al carrito' });
  }
  next();
};