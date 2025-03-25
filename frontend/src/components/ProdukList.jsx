import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Toast from './Toast';
import Modal from './Modal';

const ProdukList = forwardRef((props, ref) => {
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editNama, setEditNama] = useState("");
    const [editHarga, setEditHarga] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });
    const [modal, setModal] = useState({
        isOpen: false,
        type: null,
        data: null
    });

    const refreshData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/produk');
            console.log('Data berhasil dimuat:', response.data);
            setProduk(response.data);
        } catch (error) {
            console.error('Error detail:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Gagal memuat data produk';
            if (error.code === 'ERR_NETWORK') {
                errorMessage = 'Tidak dapat terhubung ke server. Pastikan server backend berjalan.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Endpoint tidak ditemukan';
            }
            
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        refreshData
    }));

    useEffect(() => {
        refreshData();
    }, []);

    const handleProdukAdded = (newProduk) => {
        setProduk(prevProduk => [...prevProduk, newProduk]);
    };

    const handleDelete = (id) => {
        setModal({
            isOpen: true,
            type: 'delete',
            data: { id }
        });
    };

    const handleUpdate = (id, nama, harga) => {
        setModal({
            isOpen: true,
            type: 'edit',
            data: { id, nama, harga }
        });
    };

    const confirmDelete = () => {
        const { id } = modal.data;
        axios.delete(`http://localhost:5000/produk/${id}`)
            .then(() => {
                setProduk(produk.filter((p) => p.id !== id));
                showToast('Produk berhasil dihapus', 'success');
                setModal({ isOpen: false, type: null, data: null });
            })
            .catch(err => {
                console.error(err);
                showToast('Gagal menghapus produk', 'error');
            });
    };

    const startEdit = () => {
        const { id, nama, harga } = modal.data;
        setEditId(id);
        setEditNama(nama);
        setEditHarga(harga.toString());
        setIsEditing(true);
        setModal({ isOpen: false, type: null, data: null });
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditNama('');
        setEditHarga('');
        setIsEditing(false);
    };

    const saveEdit = () => {
        if (!editNama || !editHarga) {
            showToast('Nama dan Harga wajib diisi', 'error');
            return;
        }

        const hargaNum = parseFloat(editHarga);
        if (isNaN(hargaNum) || hargaNum <= 0) {
            showToast('Harga harus berupa angka positif', 'error');
            return;
        }

        axios.put(`http://localhost:5000/produk/${editId}`, { 
            nama: editNama, 
            harga: hargaNum 
        })
            .then(response => {
                console.log('Response edit produk:', response.data);
                // Update state produk dengan data yang diperbarui
                setProduk(produk.map(p => p.id === editId ? response.data : p));
                // Reset form edit
                setEditId(null);
                setEditNama("");
                setEditHarga("");
                setIsEditing(false);
                showToast('Produk berhasil diperbarui', 'success');
            })
            .catch(err => {
                console.error('Error edit produk:', err);
                showToast(err.response?.data?.message || 'Gagal memperbarui produk', 'error');
            });
    };

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

    const formatHarga = (harga) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(harga);
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: null, data: null });
        setEditId(null);
        setEditNama("");
        setEditHarga("");
    };

    return (
        <>
            <Toast 
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                onConfirm={modal.type === 'delete' ? confirmDelete : startEdit}
                title={modal.type === 'delete' ? 'Konfirmasi Hapus' : 'Konfirmasi Edit'}
                message={
                    modal.type === 'delete' 
                        ? 'Apakah Anda yakin ingin menghapus produk ini?' 
                        : 'Apakah Anda yakin ingin mengedit produk ini?'
                }
                confirmText={modal.type === 'delete' ? 'Hapus' : 'Edit'}
                type={modal.type}
            />

            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">
                        <i className="bi bi-box-seam me-2"></i>
                        Daftar Produk
                    </h5>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Memuat data produk...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger m-4" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                    ) : produk.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3 text-muted">Belum ada produk yang ditambahkan</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{width: '5%'}}>No</th>
                                        <th style={{width: '40%'}}>Nama Produk</th>
                                        <th style={{width: '25%'}}>Harga</th>
                                        <th style={{width: '30%'}} className="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produk.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>
                                                {editId === item.id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editNama}
                                                        onChange={(e) => setEditNama(e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="fw-medium">{item.nama}</span>
                                                )}
                                            </td>
                                            <td>
                                                {editId === item.id ? (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={editHarga}
                                                        onChange={(e) => setEditHarga(e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="fw-semibold text-primary">{formatHarga(item.harga)}</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    {editId === item.id ? (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                onClick={saveEdit}
                                                            >
                                                                <i className="bi bi-check-lg"></i>
                                                                <span className="d-none d-md-inline ms-1">Simpan</span>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={cancelEdit}
                                                            >
                                                                <i className="bi bi-x-lg"></i>
                                                                <span className="d-none d-md-inline ms-1">Batal</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleUpdate(item.id, item.nama, item.harga)}
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                                <span className="d-none d-md-inline ms-1">Edit</span>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <i className="bi bi-trash3"></i>
                                                                <span className="d-none d-md-inline ms-1">Hapus</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});

export default ProdukList;
