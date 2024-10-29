const dbType = process.env.DB_TYPE || 'mongo';
const mongo = require('./mongo');
const postgresql = require('./postgresql');

let db;

if (dbType === 'mongo') {
  db = mongo;
} else if (dbType === 'postgresql') {
  db = postgresql;
} else {
  throw new Error('Tipo de base de datos no soportado');
}

module.exports = db;
