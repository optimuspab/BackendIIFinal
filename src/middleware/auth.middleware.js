import jwt from 'jsonwebtoken';
import User from '../daos/user.dao.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send('Acceso denegado: no hay token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send('Usuario no encontrado');
    
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('Token inválido');
  }
};
