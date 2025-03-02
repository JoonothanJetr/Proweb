import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProdukList() {
    const [produk, setProduk] = useState([]);
    const [editId, setEditId] = useState(null); // Tambahkan state editId
    const [editNama, setEditNama] = useState(""); // Tambahkan state editNama
    const [editHarga, setEditHarga] = useState(""); // Tambahkan state editHarga
  
    useEffect(() => {
      axios.get('http://localhost:3001/produk')
        .then((response) => setProduk(response.data))
        .catch((error) => console.error(error));
    }, []);
  
    const handleDelete = (id) => {
      axios.delete(`http://localhost:3001/produk/${id}`)
        .then(() => {
          setProduk(produk.filter((p) => p.id !== id));
        })
        .catch(err => console.error(err));
    };

    const handleUpdate = (id, nama, harga) => {
        setEditId(id);
        setEditNama(nama);
        setEditHarga(harga);
    };

    const handleSave = (id) => {
        axios.put(`http://localhost:3001/produk/${id}`, { nama: editNama, harga: editHarga })
            .then(response => {
                setProduk(produk.map(p => p.id === id ? response.data : p));
                setEditId(null);
                setEditNama("");
                setEditHarga("");
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Daftar Produk</h2>
            <ul>
                {produk.map((item) => (
                    <li key={item.id}>
                        {editId === item.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editNama} 
                                    onChange={(e) => setEditNama(e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    value={editHarga} 
                                    onChange={(e) => setEditHarga(e.target.value)}
                                />
                                <button onClick={() => handleSave(item.id)}>Save</button>
                                <button onClick={() => setEditId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {item.nama} - Rp{item.harga}
                                <button onClick={() => handleUpdate(item.id, item.nama, item.harga)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProdukList;
