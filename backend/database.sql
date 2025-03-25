-- Drop table if exists
DROP TABLE IF EXISTS produk;

-- Buat tabel produk
CREATE TABLE produk (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    harga DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger untuk mengupdate updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_produk_updated_at
    BEFORE UPDATE ON produk
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 