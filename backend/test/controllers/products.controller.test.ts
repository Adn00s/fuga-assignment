import request from 'supertest';
import express from 'express';
import { Controller } from '../../server/api/controllers/products/controller';
import ProductService from '../../server/api/services/products.prisma.service';

jest.mock('../../server/api/services/products.prisma.service', () => ({
  all: jest.fn(),
  byId: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));


const app = express();
app.use(express.json());

const controller = new Controller();

app.get('/products', (req, res) => controller.all(req, res));
app.get('/products/:id', (req, res) => controller.byId(req, res));
app.post('/products', (req, res) => controller.create(req, res));

describe('Products API Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return all products with default pagination', async () => {
      const mockProducts = [
        { id: 1, name: 'Album 1', artist: 'Artist 1' },
        { id: 2, name: 'Album 2', artist: 'Artist 2' },
      ];

      (ProductService.all as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body).toEqual(mockProducts);
      expect(ProductService.all).toHaveBeenCalledWith({
        search: undefined,
        limit: 20,
        offset: 0,
      });
    });

    it('should handle search and pagination parameters', async () => {
      const mockProducts = [
        { id: 1, name: 'Test Album', artist: 'Test Artist' },
      ];

      (ProductService.all as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/products?search=test&limit=10&page=2')
        .expect(200);

      expect(response.body).toEqual(mockProducts);
      expect(ProductService.all).toHaveBeenCalledWith({
        search: 'test',
        limit: 10,
        offset: 10,       });
    });
  });

  describe('GET /products/:id', () => {
    it('should return product by id when found', async () => {
      const mockProduct = { id: 1, name: 'Test Album', artist: 'Test Artist' };

      (ProductService.byId as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/products/1')
        .expect(200);

      expect(response.body).toEqual(mockProduct);
      expect(ProductService.byId).toHaveBeenCalledWith('1');
    });

    it('should return 404 when product not found', async () => {
      (ProductService.byId as jest.Mock).mockResolvedValue(null);

      await request(app)
        .get('/products/999')
        .expect(404);

      expect(ProductService.byId).toHaveBeenCalledWith('999');
    });
  });

  describe('POST /products', () => {
    it('should return 400 when name is missing', async () => {
      const invalidData = {
        artist: 'New Artist',
        price: 19.99,
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toContain('Product name is required');
      expect(ProductService.insert).not.toHaveBeenCalled();
    });

    it('should return 400 when artist is missing', async () => {
      const invalidData = {
        name: 'New Album',
        price: 19.99,
      };

      const response = await request(app)
        .post('/products')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toContain('Artist name is required');
      expect(ProductService.insert).not.toHaveBeenCalled();
    });
  });
});
