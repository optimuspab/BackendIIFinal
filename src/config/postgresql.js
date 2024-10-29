import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'backend',
  password: process.env.PG_PASSWORD || 'password',
  port: process.env.PG_PORT || 5432,
});

const query = (text, params) => pool.query(text, params);

export default {
  query,
};