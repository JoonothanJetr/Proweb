const validateProduk = (req, res, next) => {
    const { nama, harga } = req.body;
    const errors = [];

    // Validasi nama produk
    if (!nama) {
        errors.push('Nama produk wajib diisi');
    } else if (nama.length < 3) {
        errors.push('Nama produk minimal 3 karakter');
    } else if (nama.length > 100) {
        errors.push('Nama produk maksimal 100 karakter');
    }

    // Validasi harga
    if (!harga) {
        errors.push('Harga produk wajib diisi');
    } else {
        const hargaNum = Number(harga);
        if (isNaN(hargaNum)) {
            errors.push('Harga harus berupa angka');
        } else if (hargaNum <= 0) {
            errors.push('Harga harus lebih besar dari 0');
        } else if (hargaNum > 1000000000) { // 1 miliar
            errors.push('Harga maksimal 1 miliar');
        }
    }

    // Jika ada error, kirim response error
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Validasi gagal',
            errors: errors
        });
    }

    // Jika tidak ada error, lanjut ke middleware berikutnya
    next();
};

module.exports = {
    validateProduk
}; 