export const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado: no tienes permisos de administrador');
    }
    next();
  };
  