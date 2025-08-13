class ProductsDatabase {
  constructor() {
    this._data = [];
    this._counter = 0;

    // Hardcoded test data for music products
    this.insert({
      name: 'Midnight Jazz Sessions',
      artist: 'The Blue Note Collective',
      type: 'Album',
      price: 12.99,
      releaseDate: '2024-03-15',
      coverArt: '/images/midnight-jazz.jpg',
    });

    this.insert({
      name: 'Electric Dreams',
      artist: 'Neon Pulse',
      type: 'Single',
      price: 2.99,
      releaseDate: '2024-08-01',
      coverArt: '/images/electric-dreams.jpg',
    });
  }

  all() {
    return Promise.resolve(this._data);
  }

  byId(id) {
    return Promise.resolve(this._data[parseInt(id)]);
  }

  insert(productData) {
    const record = {
      id: this._counter,
      name: productData.name,
      artist: productData.artist,
      type: productData.type || 'Album',
      price: productData.price || 0,
      releaseDate:
        productData.releaseDate || new Date().toISOString().split('T')[0],
      coverArt: productData.coverArt || '/images/default-cover.jpg',
      createdAt: new Date().toISOString(),
    };

    this._counter += 1;
    this._data.push(record);

    return Promise.resolve(record);
  }
}

export default new ProductsDatabase();
