import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' }
});

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

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

export default User;
