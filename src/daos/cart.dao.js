import Cart from './models/cart.model.js';

export const createCart = async (cartData) => {
  const cart = new Cart(cartData);
  return await cart.save();
};

export const getCartById = async (cartId) => {
  return await Cart.findById(cartId).populate('products.product');
};

export const updateCart = async (cartId, updateData) => {
  return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
};

export const deleteCart = async (cartId) => {
  return await Cart.findByIdAndDelete(cartId);
};

export default {
  createCart,
  getCartById,
  updateCart,
  deleteCart,
};


