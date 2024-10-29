import dotenv from 'dotenv';
dotenv.config();
import Cart from './models/cart.model.js';
import postgresqlDb from '../config/postgresql.js';

const dbType = process.env.DB_TYPE || 'mongo';

export const createCart = async (cartData) => {
  if (dbType === 'mongo') {
    const cart = new Cart(cartData);
    return await cart.save();
  } else if (dbType === 'postgresql') {
    try {
      const result = await postgresqlDb.query(
        'INSERT INTO carts DEFAULT VALUES RETURNING *'
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Error al crear carrito en PostgreSQL: ' + error.message);
    }
  }
};

export const getCartById = async (cartId) => {
  if (dbType === 'mongo') {
    return await Cart.findById(cartId).populate('products.product');
  } else if (dbType === 'postgresql') {
    try {

      const result = await postgresqlDb.query(
        `SELECT c.id AS cart_id, ci.product_id, ci.quantity, p.name, p.price
         FROM carts c
         LEFT JOIN cart_items ci ON c.id = ci.cart_id
         LEFT JOIN products p ON ci.product_id = p.id
         WHERE c.id = $1`,
        [cartId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const products = result.rows.map(row => ({
        product: {
          id: row.product_id,
          name: row.name,
          price: row.price,
        },
        quantity: row.quantity,
      }));

      return {
        id: result.rows[0].cart_id,
        products,
      };
    } catch (error) {
      throw new Error('Error al obtener carrito en PostgreSQL: ' + error.message);
    }
  }
};

export const updateCart = async (cartId, updateData) => {
  if (dbType === 'mongo') {
    return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
  } else if (dbType === 'postgresql') {
    try {

      await postgresqlDb.query(
        'DELETE FROM cart_items WHERE cart_id = $1',
        [cartId]
      );

      const { products } = updateData;
      if (products && products.length > 0) {
        const insertPromises = products.map(({ product, quantity }) =>
          postgresqlDb.query(
            'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
            [cartId, product.id, quantity]
          )
        );
        await Promise.all(insertPromises);
      }

      return await getCartById(cartId);
    } catch (error) {
      throw new Error('Error al actualizar carrito en PostgreSQL: ' + error.message);
    }
  }
};

export const deleteCart = async (cartId) => {
  if (dbType === 'mongo') {
    return await Cart.findByIdAndDelete(cartId);
  } else if (dbType === 'postgresql') {
    try {

      await postgresqlDb.query(
        'DELETE FROM cart_items WHERE cart_id = $1',
        [cartId]
      );

      const result = await postgresqlDb.query(
        'DELETE FROM carts WHERE id = $1 RETURNING *',
        [cartId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error('Error al eliminar carrito en PostgreSQL: ' + error.message);
    }
  }
};

export default {
  createCart,
  getCartById,
  updateCart,
  deleteCart,
};
