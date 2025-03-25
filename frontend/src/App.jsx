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
          <div className="nav-brand">Ocean Store</div>
          <div className="nav-menu">
            <div className="nav-links">
              <a href="#home" className="active">Beranda</a>
              <a href="#produk">Produk</a>
              <a href="#tentang">Tentang</a>
              <a href="#kontak">Kontak</a>
            </div>
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
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-4 mb-4">
              <section className="tambah-produk-section">
                <h2 className="section-title">Tambah Produk</h2>
                <TambahProduk onProdukAdded={handleProdukAdded} />
              </section>
            </div>
            <div className="col-12 col-lg-8">
              <section className="produk-list-section">
                <ProdukList ref={produkListRef} />
              </section>
            </div>
          </div>
        </div>
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