import React, { useState, useRef } from 'react';
import TambahProduk from './components/TambahProduk';
import ProdukList from './components/ProdukList';

function App() {
  const produkListRef = useRef();

  const handleProdukAdded = (newProduk) => {
    if (produkListRef.current) {
      produkListRef.current.refreshData();
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <h1 className="nav-title">Ocean Store</h1>
          <div className="nav-links">
            <a href="#home">Beranda</a>
            <a href="#products">Produk</a>
            <a href="#about">Tentang</a>
            <a href="#contact">Kontak</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Selamat Datang di Ocean Store</h1>
          <p>Temukan produk berkualitas dengan harga terbaik</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <section className="tambah-produk-section">
          <h2>Tambah Produk Baru</h2>
          <div className="card">
            <TambahProduk onProdukAdded={handleProdukAdded} />
          </div>
        </section>

        <section className="produk-list-section">
          <h2>Daftar Produk</h2>
          <div className="product-grid">
            <ProdukList ref={produkListRef} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Ocean Store</h3>
            <p>Toko online terpercaya dengan produk berkualitas</p>
          </div>
          <div className="footer-section">
            <h3>Kontak</h3>
            <p>Email: info@oceanstore.com</p>
            <p>Telp: (021) 1234-5678</p>
          </div>
          <div className="footer-section">
            <h3>Ikuti Kami</h3>
            <div className="social-links">
              <a href="#facebook">Facebook</a>
              <a href="#instagram">Instagram</a>
              <a href="#twitter">Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Ocean Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;