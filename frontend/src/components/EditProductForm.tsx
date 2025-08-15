import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateProduct } from '../store/slices/productsSlice';
import type { Product } from '../store/slices/productsSlice';
import './ProductForm.css';

interface EditProductFormProps {
  product: Product;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditProductForm = ({ product, onCancel, onSuccess }: EditProductFormProps) => {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    name: product.name,
    artist: product.artist,
    coverArt: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.artist) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(updateProduct({
        id: product.id,
        name: formData.name,
        artist: formData.artist,
        coverArt: formData.coverArt || undefined
      })).unwrap();
      
      onSuccess();
    } catch (error) {
      console.log('update failed:', error);
      alert('Failed to update product');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      coverArt: file
    }));
  };

  return (
    <div className="edit-form-overlay">
      <form className="product-form edit-form" onSubmit={handleSubmit}>
        <h2>Edit Product</h2>
        
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="coverArt">Cover Art</label>
          <input
            type="file"
            id="coverArt"
            name="coverArt"
            accept="image/*"
            onChange={handleFileChange}
          />
          {product.cover_art && (
            <p className="current-image">Current: {product.cover_art}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
