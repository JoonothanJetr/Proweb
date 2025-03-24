const express = require('express');
const cors = require('cors');
const { pool, checkDatabaseConnection, queryWithRetry } = require('./db');
const { validateProduk } = require('./middleware/validation');
const { errorLogger, errorHandler, notFoundHandler } = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test koneksi database saat startup
(async () => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Tidak dapat terhubung ke database. Aplikasi akan dihentikan.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error saat mengecek koneksi database:', err);
    process.exit(1);
  }
})();

app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API Proweb' });
});

app.post('/data', (req, res) => {
  const { nama } = req.body;
  res.send(`Data diterima: ${nama}`);
});

// CREATE - Tambah produk baru
app.post('/produk', validateProduk, async (req, res, next) => {
  const { nama, harga } = req.body;
  try {
    const result = await queryWithRetry(
      'INSERT INTO produk (nama, harga) VALUES ($1, $2) RETURNING *',
      [nama, harga]
    );

    res.status(201).json({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// READ - Ambil semua produk
app.get('/produk', async (req, res, next) => {
  try {
    const result = await queryWithRetry(
      'SELECT * FROM produk ORDER BY created_at DESC'
    );

    res.json({
      status: 'success',
      message: 'Data produk berhasil diambil',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE - Update produk
app.put('/produk/:id', validateProduk, async (req, res, next) => {
  const { id } = req.params;
  const { nama, harga } = req.body;
  
  try {
    const result = await queryWithRetry(
      'UPDATE produk SET nama = $1, harga = $2 WHERE id = $3 RETURNING *',
      [nama, harga, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      status: 'success',
      message: 'Produk berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// DELETE - Hapus produk
app.delete('/produk/:id', async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const result = await queryWithRetry(
      'DELETE FROM produk WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      status: 'success',
      message: 'Produk berhasil dihapus',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);
app.use(notFoundHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});