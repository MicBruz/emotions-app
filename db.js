const { Pool } = require('pg');

const pool = new Pool({
  // user: '',
  host: 'localhost',
  database: 'emotions_app_db',
  // password: '',
  port: 5432,
});

module.exports = pool;
