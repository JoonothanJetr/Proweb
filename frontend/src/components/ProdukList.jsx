import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Toast from './Toast';
import Modal from './Modal';

const ProdukList = forwardRef((props, ref) => {
    const [produk, setProduk] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editNama, setEditNama] = useState("");
    const [editHarga, setEditHarga] = useState("");
    const [originalData, setOriginalData] = useState(null);
    const [isDataChanged, setIsDataChanged] = useState(false);
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

    const refreshData = () => {
        axios.get('http://localhost:3001/produk')
            .then((response) => setProduk(response.data))
            .catch((error) => {
                console.error(error);
                showToast('Gagal memuat data produk', 'error');
            });
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
        axios.delete(`http://localhost:3001/produk/${id}`)
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

    const confirmEdit = () => {
        const id = editId;
        if (!editNama || !editHarga) {
            showToast('Nama dan Harga wajib diisi', 'error');
            return;
        }

        axios.put(`http://localhost:3001/produk/${id}`, { 
            nama: editNama, 
            harga: parseFloat(editHarga) 
        })
            .then(response => {
                setProduk(produk.map(p => p.id === id ? response.data : p));
                setEditId(null);
                setEditNama("");
                setEditHarga("");
                showToast('Produk berhasil diperbarui', 'success');
            })
            .catch(err => {
                console.error(err);
                showToast('Gagal memperbarui produk', 'error');
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

    const startEdit = () => {
        const { id, nama, harga } = modal.data;
        setEditId(id);
        setEditNama(nama);
        setEditHarga(harga.toString());
        setOriginalData({ nama, harga: harga.toString() });
        setIsDataChanged(false);
        setModal({ isOpen: false, type: null, data: null });
    };

    const handleInputChange = (field, value) => {
        if (field === 'nama') {
            setEditNama(value);
        } else if (field === 'harga') {
            setEditHarga(value);
        }

        // Cek apakah data berubah dari data asli
        const isChanged = field === 'nama' 
            ? value !== originalData.nama || editHarga !== originalData.harga
            : editNama !== originalData.nama || value !== originalData.harga;
        
        setIsDataChanged(isChanged);
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

            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white py-3">
                                <h5 className="card-title mb-0 d-flex align-items-center">
                                    <i className="bi bi-box-seam me-2"></i>
                                    Daftar Produk
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr className="bg-light border-top">
                                                <th className="px-4 py-3 text-center" style={{width: "8%"}}>No</th>
                                                <th className="px-4 py-3" style={{width: "35%"}}>Nama Produk</th>
                                                <th className="px-4 py-3" style={{width: "25%"}}>Harga</th>
                                                <th className="px-4 py-3 text-center" style={{width: "32%"}}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {produk.map((item, index) => (
                                                <tr key={item.id} className="border-bottom">
                                                    <td className="px-4 py-3 text-center">{index + 1}</td>
                                                    <td className="px-4 py-3">
                                                        {editId === item.id ? (
                                                            <input 
                                                                type="text" 
                                                                className="form-control form-control-sm"
                                                                value={editNama} 
                                                                onChange={(e) => handleInputChange('nama', e.target.value)}
                                                                placeholder="Nama Produk"
                                                            />
                                                        ) : (
                                                            <span className="fw-medium text-dark">{item.nama}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {editId === item.id ? (
                                                            <input 
                                                                type="number" 
                                                                className="form-control form-control-sm"
                                                                value={editHarga} 
                                                                onChange={(e) => handleInputChange('harga', e.target.value)}
                                                                placeholder="Harga Produk"
                                                            />
                                                        ) : (
                                                            <span className="text-success fw-semibold">
                                                                {formatHarga(item.harga)}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="d-flex justify-content-center">
                                                            {editId === item.id ? (
                                                                <div className="action-buttons" style={{width: "400px"}}>
                                                                    <button 
                                                                        className={`btn ${isDataChanged ? 'btn-success' : 'btn-secondary'} btn-sm flex-fill`}
                                                                        onClick={confirmEdit}
                                                                        disabled={!isDataChanged}
                                                                        style={{
                                                                            opacity: isDataChanged ? 1 : 0.6,
                                                                            cursor: isDataChanged ? 'pointer' : 'not-allowed'
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-check-lg me-2"></i>
                                                                        Simpan
                                                                    </button>
                                                                    <div className="action-divider"></div>
                                                                    <button 
                                                                        className="btn btn-secondary btn-sm flex-fill"
                                                                        onClick={closeModal}
                                                                    >
                                                                        <i className="bi bi-x-lg me-2"></i>
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="action-buttons" style={{width: "400px"}}>
                                                                    <button 
                                                                        className="btn btn-primary btn-sm flex-fill"
                                                                        onClick={() => handleUpdate(item.id, item.nama, item.harga)}
                                                                    >
                                                                        <i className="bi bi-pencil me-2"></i>
                                                                        Edit
                                                                    </button>
                                                                    <div className="action-divider"></div>
                                                                    <button 
                                                                        className="btn btn-danger btn-sm flex-fill"
                                                                        onClick={() => handleDelete(item.id)}
                                                                    >
                                                                        <i className="bi bi-trash me-2"></i>
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {produk.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-4 text-muted">
                                                        <i className="bi bi-inbox fs-4 me-2"></i>
                                                        <span className="fs-5">Belum ada produk</span>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ProdukList;
