import { useState } from 'react';
import './ProductForm.css';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    coverArt: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.artist) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('artist', formData.artist);
      if (formData.coverArt) {
        data.append('coverArt', formData.coverArt);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        alert('Product created!');
        setFormData({ name: '', artist: '', coverArt: null });
        const fileInput = document.getElementById('coverArt');
        if (fileInput) fileInput.value = '';
      } else {
        alert('Error creating product');
      }
    } catch (error) {
      console.log('Failed to create product:', error);
      alert('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
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
          <input
            type="file"
            id="coverArt"
            name="coverArt"
            onChange={handleInputChange}
            accept="image/*"
          />
          {formData.coverArt && (
            <p className="file-info">Selected: {formData.coverArt.name}</p>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
