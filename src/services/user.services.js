import jwt from 'jsonwebtoken';
import userDao from '../daos/user.dao.js';
import { createHash } from "../utils/utils.js";
import { sendPasswordResetEmail } from './email.service.js';

class UserService {
  async createUser(userData) {
    try {
      userData.password = createHash(userData.password);
      const newUser = await userDao.createUser(userData);
      return newUser;
    } catch (error) {
      throw new Error("Error al crear usuario: " + error.message);
    }
  }

  async getById(id) {
    return await userDao.findById(id);
  }
}

export const createPasswordResetToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export default UserService;