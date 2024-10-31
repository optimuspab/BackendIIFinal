import Product from './models/product.model.js';
import postgresqlDb from '../config/postgresql.js';

const dbType = process.env.DB_TYPE || 'mongo';

class ProductDAO {
    async findAll(filter = {}, options = {}) {
        if (dbType === 'mongo') {
            return await Product.paginate(filter, options);
        } else if (dbType === 'postgresql') {
            const result = await postgresqlDb.query('SELECT * FROM products');
            return result.rows;
        }
    }

    async findById(id) {
        if (dbType === 'mongo') {
            return await Product.findById(id);
        } else if (dbType === 'postgresql') {
            const result = await postgresqlDb.query('SELECT * FROM products WHERE id = $1', [id]);
            return result.rows[0];
        }
    }

    async create(data) {
        if (dbType === 'mongo') {
            return await Product.create(data);
        } else if (dbType === 'postgresql') {
            const { title, description, price, category, stock, thumbnails } = data;
            const result = await postgresqlDb.query(
                'INSERT INTO products (title, description, price, category, stock, thumbnails) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [title, description, price, category, stock, JSON.stringify(thumbnails)]
            );
            return result.rows[0];
        }
    }

    async update(id, data) {
        if (dbType === 'mongo') {
            return await Product.findByIdAndUpdate(id, data, { new: true });
        } else if (dbType === 'postgresql') {
            const { title, description, price, category, stock, thumbnails } = data;
            const result = await postgresqlDb.query(
                'UPDATE products SET title = $1, description = $2, price = $3, category = $4, stock = $5, thumbnails = $6 WHERE id = $7 RETURNING *',
                [title, description, price, category, stock, JSON.stringify(thumbnails), id]
            );
            return result.rows[0];
        }
    }

    async delete(id) {
        if (dbType === 'mongo') {
            return await Product.findByIdAndDelete(id);
        } else if (dbType === 'postgresql') {
            const result = await postgresqlDb.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const products = await productDAO.findAll(filter, options);
            return { success: true, products };
        } catch (error) {
            return { success: false, message: 'Error al obtener productos: ' + error.message };
        }
    }

}

export default ProductDAO;
