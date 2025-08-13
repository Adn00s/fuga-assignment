-- Initialize Fuga Music Database
-- This script runs when PostgreSQL container starts

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Album',
    price DECIMAL(10,2) DEFAULT 0.00,
    release_date DATE,
    cover_art VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO products (name, artist, type, price, release_date, cover_art) VALUES 
('Midnight Jazz Sessions', 'The Blue Note Collective', 'Album', 12.99, '2024-03-15', '/images/midnight-jazz.jpg'),
('Electric Dreams', 'Neon Pulse', 'Single', 2.99, '2024-08-01', '/images/electric-dreams.jpg')
ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_artist ON products(artist);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Grant permissions (if needed)
GRANT ALL PRIVILEGES ON TABLE products TO fuga_user;
GRANT USAGE, SELECT ON SEQUENCE products_id_seq TO fuga_user;
