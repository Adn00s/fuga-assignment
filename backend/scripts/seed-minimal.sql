-- Minimal data for testing clean states
-- Use this for unit tests or when you need a clean environment

-- Clear existing data
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Insert just the basics for testing
INSERT INTO products (name, artist, type, price, release_date, cover_art) VALUES 
('Test Album', 'Test Artist', 'Album', 9.99, '2024-01-01', NULL),
('Test Single', 'Another Artist', 'Single', 1.99, '2024-01-02', NULL)
ON CONFLICT DO NOTHING;
