import express from 'express';
import { requestPasswordReset, verifyResetLink, resetPassword } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/request-password-reset', requestPasswordReset);
router.get('/reset-password/:token', verifyResetLink);
router.post('/reset-password/:token', resetPassword);

export default router;

