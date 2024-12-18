import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';
import { userValidator } from '../middleware/userValidator.js';
import UserDTO from'../dto/user.dto.js';

const router = express.Router();

router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

router.post('/register', userValidator, registerUser);
router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.get('/current', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  const userDTO = new UserDTO(req.session.user);
  res.json(userDTO);
});

export default router;
