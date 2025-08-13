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

  createWithUpload(req, res) {
    const productData = { ...req.body };
    
    if (productData.price) {
      productData.price = parseFloat(productData.price);
    }
    
    if (req.file) {
      productData.coverArt = `/uploads/${req.file.filename}`;
    }
    
    ProductService.create(productData).then((r) =>
      res.status(201).location(`/api/v1/products/${r.id}`).json(r)
    );
  }
}
export default new Controller();
