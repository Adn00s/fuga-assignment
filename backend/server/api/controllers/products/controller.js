import ProductService from '../../services/products.service.js';

const validateProductData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Product name is required');
  }
  
  if (data.name && data.name.length > 255) {
    errors.push('Product name must be less than 255 characters');
  }
  
  if (!data.artist || data.artist.trim().length === 0) {
    errors.push('Artist name is required');
  }
  
  if (data.artist && data.artist.length > 255) {
    errors.push('Artist name must be less than 255 characters');
  }
  
  if (data.price && (isNaN(data.price) || data.price < 0)) {
    errors.push('Price must be a valid positive number');
  }
  
  return errors;
};

export class Controller {
  all(req, res) {
    const { search, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    ProductService.all({ search, limit: +limit, offset }).then((r) => res.json(r));
  }

  byId(req, res) {
    ProductService.byId(req.params.id).then((r) => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  create(req, res) {
    const errors = validateProductData(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: errors });
    }
    
    ProductService.create(req.body)
      .then((r) => res.status(201).location(`/api/v1/products/${r.id}`).json(r))
      .catch((error) => {
        console.error('Product creation error:', error);
        res.status(500).json({ error: 'Failed to create product' });
      });
  }

  async createWithUpload(req, res) {
    try {
      const productData = { ...req.body };

      if (productData.price) {
        productData.price = parseFloat(productData.price);
      }
      
      const errors = validateProductData(productData);
      if (errors.length > 0) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors });
      }

      if (req.file) {
        productData.coverArt = `/uploads/${req.file.filename}`;
      }

      const result = await ProductService.create(productData);
      res.status(201).location(`/api/v1/products/${result.id}`).json(result);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to create product with upload' });
    }
  }
}
export default new Controller();
