TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, artist, type, price, release_date, cover_art) VALUES 

('Folklore', 'Taylor Swift', 'Album', 12.99, '2020-07-24', NULL),
('After Hours', 'The Weeknd', 'Album', 13.99, '2020-03-20', NULL),
('Future Nostalgia', 'Dua Lipa', 'Album', 11.99, '2020-03-27', NULL),
('Chromatica', 'Lady Gaga', 'Album', 14.99, '2020-05-29', NULL),
('Positions', 'Ariana Grande', 'Album', 12.49, '2020-10-30', NULL),

('The New Abnormal', 'The Strokes', 'Album', 15.99, '2020-04-10', NULL),
('Shore', 'Fleet Foxes', 'Album', 13.49, '2020-09-22', NULL),
('Gigaton', 'Pearl Jam', 'Album', 14.99, '2020-03-27', NULL),
('Power Up', 'AC/DC', 'Album', 16.99, '2020-11-13', NULL),

('King''s Disease', 'Nas', 'Album', 13.99, '2020-08-21', NULL),
('My Turn', 'Lil Baby', 'Album', 12.99, '2020-02-28', NULL),
('Please Excuse Me for Being Antisocial', 'Roddy Ricch', 'Album', 13.49, '2019-12-06', NULL),

('Watermelon Sugar', 'Harry Styles', 'Single', 1.99, '2020-05-18', NULL),
('Blinding Lights', 'The Weeknd', 'Single', 1.99, '2019-11-29', NULL),
('Levitating', 'Dua Lipa', 'Single', 1.99, '2020-03-27', NULL),
('Adore You', 'Harry Styles', 'Single', 1.99, '2019-12-06', NULL),

('Blue World', 'Mac Miller', 'Album', 14.99, '2020-01-17', NULL),
('Djesse Vol. 3', 'Jacob Collier', 'Album', 15.49, '2020-08-14', NULL),
('Time Out Deluxe', 'Dave Brubeck Quartet', 'Album', 13.99, '2020-06-15', NULL),

('Kick I', 'Arca', 'Album', 12.99, '2020-06-26', NULL),
('KiCk i', 'Arca', 'EP', 8.99, '2020-06-26', NULL),
('Nurture', 'Porter Robinson', 'Album', 13.99, '2021-04-23', NULL),

('Punisher', 'Phoebe Bridgers', 'Album', 13.99, '2020-06-18', NULL),
('Song Machine, Season One', 'Gorillaz', 'Album', 14.99, '2020-10-23', NULL),
('Set My Heart on Fire Immediately', 'Perfume Genius', 'Album', 12.99, '2020-05-15', NULL),

('The Good Times', 'Kacey Musgraves', 'Album', 13.49, '2021-09-10', NULL),
('Starting Over', 'Chris Stapleton', 'Album', 14.99, '2020-11-13', NULL),
('What You See Is What You Get', 'Luke Combs', 'Album', 13.99, '2019-11-08', NULL),

('Good 4 U', 'Olivia Rodrigo', 'Single', 1.99, '2021-05-14', NULL),
('Stay', 'The Kid LAROI & Justin Bieber', 'Single', 1.99, '2021-07-09', NULL),
('Industry Baby', 'Lil Nas X ft. Jack Harlow', 'Single', 1.99, '2021-07-23', NULL),
('Heat Waves', 'Glass Animals', 'Single', 1.99, '2020-06-29', NULL),
('Shivers', 'Ed Sheeran', 'Single', 1.99, '2021-09-10', NULL),
('Bad Habits', 'Ed Sheeran', 'Single', 1.99, '2021-06-25', NULL)

ON CONFLICT DO NOTHING;
