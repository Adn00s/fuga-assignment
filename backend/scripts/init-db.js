import '../server/common/env.js';
import db from '../server/common/db.js';
import l from '../server/common/logger.js';

const createProductsTable = `
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
`;

const insertSampleData = `
  INSERT INTO products (name, artist, type, price, release_date, cover_art) VALUES 
  ('Midnight Jazz Sessions', 'The Blue Note Collective', 'Album', 12.99, '2024-03-15', '/images/midnight-jazz.jpg'),
  ('Electric Dreams', 'Neon Pulse', 'Single', 2.99, '2024-08-01', '/images/electric-dreams.jpg')
  ON CONFLICT DO NOTHING;
`;

async function initializeDatabase() {
  try {
    l.info('Initializing database...');

    // Test connection first
    const connectionOk = await db.testConnection();
    if (!connectionOk) {
      l.error(
        'Database connection failed. Please ensure PostgreSQL is running.'
      );
      process.exit(1);
    }

    // Create products table
    await db.query(createProductsTable);
    l.info('Products table created/verified');

    // Insert sample data
    await db.query(insertSampleData);
    l.info('Sample data inserted');

    // Verify data
    const result = await db.query('SELECT COUNT(*) as count FROM products');
    l.info(`Products table has ${result.rows[0].count} records`);

    l.info('Database initialization completed successfully!');
  } catch (error) {
    l.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

initializeDatabase();
