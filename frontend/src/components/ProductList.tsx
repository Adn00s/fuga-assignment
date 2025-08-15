import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, deleteProduct, type Product } from '../store/slices/productsSlice';
import SearchFilters from './SearchFilters';
import EditProductForm from './EditProductForm';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading, error, searchQuery, selectedArtist, sortBy } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

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

  // Event handlers for edit and delete
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleSaveEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteClick = (productId: number) => {
    setShowDeleteConfirm(productId);
  };

  const handleConfirmDelete = async (productId: number) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

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
                {isAuthenticated && (
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                      title="Edit product"
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(product.id)}
                      title="Delete product"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={handleCancelEdit}
          onSuccess={handleSaveEdit}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="overlay">
          <div className="delete-confirm-dialog">
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button
                className="cancel-btn"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => handleConfirmDelete(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
