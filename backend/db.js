const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'controle_estudos',
  password: '123456',
  port: 5432,
});

module.exports = pool;