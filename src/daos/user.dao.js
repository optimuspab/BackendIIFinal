import User from './models/user.model.js';

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const paginateUsers = async (query, options) => {
  return await User.paginate(query, options);
};

export default {
  createUser,
  getUserByEmail,
  paginateUsers,
};
