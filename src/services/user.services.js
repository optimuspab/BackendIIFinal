import userDao from '../daos/user.dao.js';
import { createHash } from "../utils/utils.js";

class UserService {
  async createUser(userData) {
    userData.password = createHash(userData.password);
    return await userDao.createUser(userData);
  }

  async getUserById(id) {
    return await userDao.getUserById(id);
  }

  async getUserByEmail(email) {
    return await userDao.getUserByEmail(email);
  }
}

export default new UserService();
