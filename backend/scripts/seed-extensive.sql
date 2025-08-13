-- Extensive sample data for testing scenarios
-- Use this for load testing or UI development

-- Clear existing data
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Insert more comprehensive sample data
INSERT INTO products (name, artist, type, price, release_date, cover_art) VALUES 
-- Jazz Collection
('Midnight Jazz Sessions', 'The Blue Note Collective', 'Album', 12.99, '2024-03-15', '/images/midnight-jazz.jpg'),
('Late Night Blues', 'Smoky Joe Henderson', 'Album', 14.99, '2024-02-10', NULL),
('Smooth Sailing', 'The Velvet Trio', 'EP', 8.99, '2024-04-22', NULL),

-- Electronic Music
('Electric Dreams', 'Neon Pulse', 'Single', 2.99, '2024-08-01', '/images/electric-dreams.jpg'),
('Synthetic Waves', 'Digital Prophet', 'Album', 11.99, '2024-05-30', NULL),
('Cyber Jazz Fusion', 'Quantum Beat', 'Album', 13.49, '2024-06-15', NULL),

-- Rock & Alternative
('Urban Echoes', 'Street Symphony', 'Album', 15.99, '2024-01-20', NULL),
('Midnight Rider', 'The Highway Poets', 'Single', 1.99, '2024-07-12', NULL),
('Revolution Sound', 'Electric Rebels', 'EP', 9.99, '2024-03-08', NULL),

-- Classical & Ambient
('Peaceful Mornings', 'Chamber Ensemble', 'Album', 16.99, '2024-04-01', NULL),
('Meditation Vibes', 'Serenity Collective', 'Album', 12.49, '2024-05-15', NULL),

-- Hip-Hop & R&B
('City Nights', 'Urban Flow', 'Album', 13.99, '2024-02-28', NULL),
('Smooth Operator', 'The R&B Kings', 'Single', 2.49, '2024-06-30', NULL),

-- World Music
('African Rhythms', 'Savanna Beats', 'Album', 14.49, '2024-03-25', NULL),
('Latin Fire', 'Salsa Supreme', 'EP', 10.99, '2024-07-08', NULL)
ON CONFLICT DO NOTHING;
