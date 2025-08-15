import prismaDb from '../../common/prisma.js';

class ProductsPrismaService {
  async all(options = {}) {
    const { search, limit = 20, offset = 0 } = options;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { artist: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const products = await prismaDb.client.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      artist: product.artist,
      type: product.type,
      price: product.price,
      release_date: product.releaseDate,
      cover_art: product.coverArt,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    }));
  }

  async byId(id) {
    const product = await prismaDb.client.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      artist: product.artist,
      type: product.type,
      price: product.price,
      release_date: product.releaseDate,
      cover_art: product.coverArt,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  async create(productData) {
    const product = await prismaDb.client.product.create({
      data: {
        name: productData.name,
        artist: productData.artist,
        type: productData.type || 'Album',
        price: productData.price ? Number(productData.price) : 0,
        releaseDate: productData.releaseDate
          ? new Date(productData.releaseDate)
          : null,
        coverArt: productData.coverArt,
      },
    });

    return {
      id: product.id,
      name: product.name,
      artist: product.artist,
      type: product.type,
      price: product.price,
      release_date: product.releaseDate,
      cover_art: product.coverArt,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  async update(id, productData) {
    try {
      const product = await prismaDb.client.product.update({
        where: { id: Number(id) },
        data: {
          name: productData.name,
          artist: productData.artist,
          type: productData.type,
          price: productData.price ? Number(productData.price) : undefined,
          releaseDate: productData.releaseDate
            ? new Date(productData.releaseDate)
            : undefined,
          coverArt: productData.coverArt,
        },
      });

      return {
        id: product.id,
        name: product.name,
        artist: product.artist,
        type: product.type,
        price: product.price,
        release_date: product.releaseDate,
        cover_art: product.coverArt,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const product = await prismaDb.client.product.delete({
        where: { id: Number(id) },
      });
      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}

export default new ProductsPrismaService();
