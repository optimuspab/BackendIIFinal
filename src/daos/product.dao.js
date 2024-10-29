import Product from './models/product.model.js';
import postgresqlDb from '../config/postgresql.js';

const dbType = process.env.DB_TYPE || 'mongo';

class ProductDAO {
  async findAll() {
    if (dbType === 'mongo') {
      return await Product.find();
    } else if (dbType === 'postgresql') {
      const result = await postgresqlDb.query('SELECT * FROM products');
      return result.rows;
    }
  }

  async findById(id) {
    if (dbType === 'mongo') {
      return await Product.findById(id);
    } else if (dbType === 'postgresql') {
      const result = await postgresqlDb.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );
      return result.rows[0];
    }
  }

  async create(data) {
    if (dbType === 'mongo') {
      return await Product.create(data);
    } else if (dbType === 'postgresql') {
      const { name, description, price, category, stock, images } = data;
      const result = await postgresqlDb.query(
        'INSERT INTO products (name, description, price, category, stock, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, description, price, category, stock, JSON.stringify(images)]
      );
      return result.rows[0];
    }
  }

  async update(id, data) {
    if (dbType === 'mongo') {
      const { name, description, price, category, stock, images } = data;
      const result = await postgresqlDb.query(
        'UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5, images = $6 WHERE id = $7 RETURNING *',
        [name, description, price, category, stock, JSON.stringify(images), id]
      );
      return result.rows[0];
    } else if (dbType === 'postgresql') {
      const { name, description, price, category, stock, images } = data;
      const result = await postgresqlDb.query(
        'UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5, images = $6 WHERE id = $7 RETURNING *',
        [name, description, price, category, stock, JSON.stringify(images), id]
      );
      return result.rows[0];
    }
  }

  async delete(id) {
    if (dbType === 'mongo') {
      return await Product.findByIdAndDelete(id);
    } else if (dbType === 'postgresql') {
      const result = await postgresqlDb.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    }
  }
}

export default ProductDAO;