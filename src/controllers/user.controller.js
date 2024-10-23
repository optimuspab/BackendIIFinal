import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '../daos/user.dao.js';
import { createResponse } from '../utils/utils.js';
import { createPasswordResetToken } from "../services/user.services.js";
import { sendPasswordResetEmail } from "../services/email.service.js";

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const registerUser = async (req, res, next) => {
  const { first_name, last_name, email, age, password } = req.body;
  const hashedPassword = hashPassword(password);

  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: hashedPassword
  };

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return createResponse(req, res, 400, null, 'El usuario ya está registrado');
    }

    await createUser(newUser);
    return createResponse(req, res, 201, { message: 'Usuario registrado exitosamente' });
  } catch (error) {
    return next(error);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const resetToken = createPasswordResetToken(user.id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).send('Password reset link sent');
  } catch (error) {
    res.status(500).send('Error generating password reset link');
  }
};
