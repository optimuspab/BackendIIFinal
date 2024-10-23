import ProductDAO from '../daos/product.dao.js';

const productDAO = new ProductDAO();

export const getAllProducts = async () => {
  return await productDAO.findAll();
};

export const getProductById = async (id) => {
  return await productDAO.findById(id);
};
