import User from './models/user.model.js';
import postgresqlDb from '../config/postgresql.js';
import 'dotenv/config';
const dbType = process.env.DB_TYPE || 'mongo';

console.log("first dbType in UserDAO:", process.env.DB_TYPE);

console.log("dbType in UserDAO:", dbType);

export const createUser = async (userData) => {
  if (dbType === 'mongo') {
    return await new User(userData).save();
  } else if (dbType === 'postgresql') {
    try {
      const cartResult = await postgresqlDb.query('INSERT INTO carts DEFAULT VALUES RETURNING id');
      const cartId = cartResult.rows[0].id;

      const { first_name, last_name, email, password, role } = userData;
      const result = await postgresqlDb.query(
        'INSERT INTO users (first_name, last_name, email, password, role, cart_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, password, role, cartId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error al crear usuario en PostgreSQL: " + error.message);
    }
  }
};

export const getUserByEmail = async (email) => {
  if (dbType === 'mongo') {
    return await User.findOne({ email });
  } else if (dbType === 'postgresql') {
    const result = await postgresqlDb.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }
};

export const getUserById = async (id) => {
  if (dbType === 'mongo') {
    return await User.findById(id).populate("cart");
  } else if (dbType === 'postgresql') {
    const result = await postgresqlDb.query(
      `SELECT users.*, carts.id AS cart_id
       FROM users
       LEFT JOIN carts ON users.cart_id = carts.id
       WHERE users.id = $1`,
      [id]
    );
    return result.rows[0];
  }
};

export const paginateUsers = async (query, options) => {
  if (dbType === 'mongo') {
    return await User.paginate(query, options);
  } else if (dbType === 'postgresql') {
    const { limit, offset } = options;
    const result = await postgresqlDb.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
    const total = await postgresqlDb.query('SELECT COUNT(*) FROM users');
    return {
      docs: result.rows,
      totalDocs: parseInt(total.rows[0].count, 10),
      limit,
      offset,
    };
  }
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  paginateUsers,
};
