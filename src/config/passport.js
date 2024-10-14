import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../daos/user.dao.js';

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const configurePassport = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
    } catch (err) {
      return done(err, false, { message: 'Error al verificar el token' });
    }
  }));
};

export default configurePassport;
