import React, { useState } from 'react';
import axios from 'axios';
import Toast from './Toast';

function TambahProduk({ onProdukAdded }) {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type) => {
    setToast({
      show: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      show: false
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi
    if (!nama || !harga) {
      showToast('Nama dan Harga wajib diisi', 'error');
      return;
    }

    axios.post('http://localhost:3001/produk', { nama, harga })
      .then((res) => {
        console.log('Produk berhasil ditambah:', res.data);
        setNama('');
        setHarga('');
        showToast('Produk berhasil ditambahkan', 'success');
        // Panggil callback onProdukAdded dengan data produk baru
        if (onProdukAdded) {
          onProdukAdded(res.data);
        }
      })
      .catch((err) => {
        console.error('Error menambah produk:', err);
        showToast('Gagal menambahkan produk', 'error');
      });
  };

  return (
    <div className="form-container">
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="nama" className="form-label">Nama Produk</label>
          <input
            id="nama"
            type="text"
            className="form-control"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama produk"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="harga" className="form-label">Harga</label>
          <input
            id="harga"
            type="number"
            className="form-control"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            placeholder="Masukkan harga produk"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Produk
        </button>
      </form>
    </div>
  );
}

export default TambahProduk;