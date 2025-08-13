import db from '../../common/db.js';

class ProductsDatabasePG {
  async all(options = {}) {
    const { search, limit = 20, offset = 0 } = options;
    let query = 'SELECT * FROM products';
    const params = [];

    if (search) {
      query += ' WHERE name ILIKE $1 OR artist ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  async byId(id) {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async insert(productData) {
    const {
      name,
      artist,
      type = 'Album',
      price = 0,
      releaseDate,
      coverArt,
    } = productData;

    const result = await db.query(
      `INSERT INTO products (name, artist, type, price, release_date, cover_art) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, artist, type, price, releaseDate, coverArt]
    );

    return result.rows[0];
  }

  async update(id, productData) {
    const { name, artist, type, price, releaseDate, coverArt } = productData;

    const result = await db.query(
      `UPDATE products 
       SET name = $1, artist = $2, type = $3, price = $4, 
           release_date = $5, cover_art = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name, artist, type, price, releaseDate, coverArt, id]
    );

    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }
}

export default new ProductsDatabasePG();
