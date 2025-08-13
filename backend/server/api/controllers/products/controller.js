import ProductService from '../../services/products.service.js';

export class Controller {
  all(req, res) {
    ProductService.all().then((r) => res.json(r));
  }

  byId(req, res) {
    ProductService.byId(req.params.id).then((r) => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  create(req, res) {
    ProductService.create(req.body).then((r) =>
      res.status(201).location(`/api/v1/products/${r.id}`).json(r)
    );
  }

  async createWithUpload(req, res) {
    try {
      const productData = { ...req.body };
      
      if (productData.price) {
        productData.price = parseFloat(productData.price);
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
