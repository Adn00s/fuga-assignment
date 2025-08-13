import { useState, useEffect } from 'react';
import './ProductList.css';

interface Product {
  id: number;
  name: string;
  artist: string;
  cover_art?: string;
  created_at: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      
      if (response.ok) {
        const data = await response.json();
        console.log('loaded products:', data.length);
        setProducts(data);
        setError(null);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
          <button onClick={fetchProducts} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2>Products ({products.length})</h2>
      
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products yet. Create your first product above!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
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
