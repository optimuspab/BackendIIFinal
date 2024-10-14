import User from "../daos/user.dao.js";
import { createHash } from "../utils/utils.js";

class UserService {
  async createUser(userData) {
    try {
      userData.password = createHash(userData.password);
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      throw new Error("Error al crear usuario: " + error.message);
    }
  }

  async getById(id) {
    return await User.findById(id).populate("cart");
  }
}

export default UserService;
