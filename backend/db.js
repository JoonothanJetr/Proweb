const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  // Konfigurasi connection pooling
  max: 20, // maksimum 20 clients dalam pool
  idleTimeoutMillis: 30000, // timeout koneksi idle setelah 30 detik
  connectionTimeoutMillis: 2000, // timeout koneksi setelah 2 detik
  maxUses: 7500, // recycle koneksi setelah 7500 query
});

// Event listener untuk error pada pool
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Fungsi untuk mengecek koneksi database
const checkDatabaseConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('Database connection successful');
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);
    return false;
  } finally {
    if (client) client.release();
  }
};

// Fungsi untuk query dengan retry mechanism
const queryWithRetry = async (text, params, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(text, params);
        return result;
      } finally {
        client.release();
      }
    } catch (err) {
      lastError = err;
      console.error(`Query attempt ${i + 1} failed:`, err.message);
      if (i < maxRetries - 1) await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  
  throw lastError;
};

module.exports = {
  pool,
  checkDatabaseConnection,
  queryWithRetry
};