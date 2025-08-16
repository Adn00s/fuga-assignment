import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createProduct } from '../store/slices/productsSlice';
import './ProductForm.css';

const ProductForm = () => {
  const dispatch = useAppDispatch();
  const { isCreating } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    coverArt: null as File | null
  });

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to create products.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.artist) {
      return;
    }

    try {
      await dispatch(createProduct({
        name: formData.name,
        artist: formData.artist,
        coverArt: formData.coverArt || undefined
      })).unwrap();
      
      // Reset form on success
      setFormData({ name: '', artist: '', coverArt: null });
      const fileInput = document.getElementById('coverArt') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Form reset error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === 'coverArt' && files) {
      setFormData(prev => ({ ...prev, coverArt: files[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="artist">Artist *</label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            placeholder="Enter artist name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="coverArt">Cover Art</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="coverArt"
              name="coverArt"
              onChange={handleInputChange}
              accept="image/*"
              title="Click to choose an image file"
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <button
              type="button"
              className="file-select-btn"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              Choose File
            </button>
          </div>
          {formData.coverArt && (
            <p className="file-info">Selected: {formData.coverArt.name}</p>
          )}
          {!formData.coverArt && (
            <p className="file-hint">Click "Choose File" to select an image</p>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
