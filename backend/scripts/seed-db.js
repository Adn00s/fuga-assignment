#!/usr/bin/env node
import dotenv from 'dotenv';
import db from '../server/common/db.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import l from '../server/common/logger.js';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const seedDatabase = async (seedType = 'default') => {
  try {
    l.info('Starting database seeding...');

    // Determine which seed file to use
    let seedFile;
    switch (seedType) {
      case 'extensive':
        seedFile = 'seed-extensive.sql';
        break;
      case 'minimal':
        seedFile = 'seed-minimal.sql';
        break;
      default:
        seedFile = 'init-db.sql';
        break;
    }

    const seedPath = join(__dirname, seedFile);
    const seedSQL = readFileSync(seedPath, 'utf8');

    l.info(`Using seed file: ${seedFile}`);

    // Execute the seed SQL
    await db.query(seedSQL);

    // Get count to verify
    const result = await db.query('SELECT COUNT(*) FROM products');
    const count = result.rows[0].count;

    l.info(`Database seeded with ${count} products using ${seedType} dataset`);
  } catch (error) {
    l.error('Database seeding failed:', error);
    process.exit(1);
  } finally {
    await db.pool.end();
    l.info('Database connection closed');
  }
};

// Get seed type from command line argument
const seedType = process.argv[2] || 'default';

seedDatabase(seedType);
