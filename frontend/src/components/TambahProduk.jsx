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

    // Validasi nama
    if (nama.length < 3 || nama.length > 100) {
      showToast('Nama produk harus antara 3-100 karakter', 'error');
      return;
    }

    // Validasi harga
    const hargaNum = parseFloat(harga);
    if (isNaN(hargaNum) || hargaNum <= 0) {
      showToast('Harga harus berupa angka positif', 'error');
      return;
    }

    axios.post('http://localhost:5000/produk', { 
      nama: nama.trim(),
      harga: hargaNum
    })
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
        const errorMessage = err.response?.data?.message || 'Gagal menambahkan produk';
        showToast(errorMessage, 'error');
      });
  };

  return (
    <div className="tambah-produk-wrapper">
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <div className="card">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
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
            <div className="form-group mb-3">
              <label htmlFor="harga" className="form-label">Harga Produk</label>
              <input
                id="harga"
                type="number"
                className="form-control"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="Masukkan harga produk"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              <i className="bi bi-plus-circle me-2"></i>
              Tambah Produk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TambahProduk;