import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productsSlice';
import SearchFilters from './SearchFilters';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading, error, searchQuery, selectedArtist, sortBy } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedArtist) {
      filtered = filtered.filter(product => product.artist === selectedArtist);
    }

    if (sortBy === 'alphabetical') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return filtered;
  }, [products, searchQuery, selectedArtist, sortBy]);

  const handleRetry = () => {
    dispatch(fetchProducts());
  };

  if (isLoading) {
    return (
      <div className="product-list-container">
        <h2>Products</h2>
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <h2>Products</h2>
        <div className="error">
          {error}
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2>Products ({products.length})</h2>
      
      <SearchFilters />
      
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          {products.length === 0 ? (
            <p>No products yet. Create your first product above!</p>
          ) : (
            <p>No products match your search criteria.</p>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.cover_art ? (
                <img 
                  src={product.cover_art} 
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    
                    const placeholder = document.createElement('div');
                    placeholder.className = 'product-image-placeholder';
                    placeholder.innerHTML = '<span>No Image</span>';
                    e.currentTarget.parentNode?.insertBefore(placeholder, e.currentTarget);
                  }}
                />
              ) : (
                <div className="product-image-placeholder">
                  <span>No Image</span>
                </div>
              )}
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-artist">{product.artist}</p>
                <p className="product-date">
                  Added: {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
