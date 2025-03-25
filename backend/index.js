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

// READ - Ambil semua produk
app.get('/produk', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM produk ORDER BY id DESC'
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error saat mengambil produk:', err);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data produk'
    });
  }
});

// CREATE - Tambah produk baru
app.post('/produk', async (req, res) => {
  const { nama, harga } = req.body;
  
  try {
    // Validasi input
    if (!nama || !harga) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama dan harga produk wajib diisi'
      });
    }

    const hargaNum = parseFloat(harga);
    if (isNaN(hargaNum) || hargaNum <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Harga harus berupa angka positif'
      });
    }

    const result = await pool.query(
      'INSERT INTO produk (nama, harga) VALUES ($1, $2) RETURNING *',
      [nama, hargaNum]
    );

    res.status(201).json({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error saat menambah produk:', err);
    res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan produk'
    });
  }
});

// UPDATE - Update produk
app.put('/produk/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, harga } = req.body;
  
  try {
    // Validasi input
    if (!nama || !harga) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama dan harga produk wajib diisi'
      });
    }

    const hargaNum = parseFloat(harga);
    if (isNaN(hargaNum) || hargaNum <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Harga harus berupa angka positif'
      });
    }

    // Jalankan query update
    const result = await pool.query(
      'UPDATE produk SET nama = $1, harga = $2 WHERE id = $3 RETURNING *',
      [nama, hargaNum, id]
    );

    // Cek jika produk tidak ditemukan
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Produk tidak ditemukan'
      });
    }

    // Kirim response sukses
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saat update produk:', err);
    res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui produk'
    });
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