import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import { userValidator } from '../middleware/userValidator.js';

const router = express.Router();

router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

router.post('/register', userValidator, registerUser);
router.post('/login', loginUser);

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/login');
  });
});

export default router;
