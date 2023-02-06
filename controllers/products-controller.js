import { productsRoutes } from '../routes/index.js';
import { productsHooks } from '../hooks/index.js';

export const productsController = [
  (fastify, options, done) => {
    fastify.get(
      '/products',
      { preHandler: productsHooks.productsExists },
      productsRoutes.getProducts
    );
    done();
  },
  (fastify, options, done) => {
    fastify.get(
      '/product/:id',
      { preHandler: productsHooks.productExists },
      productsRoutes.getProduct
    );
    done();
  },
  (fastify, options, done) => {
    fastify.post(
      '/products/new',
      { preHandler: productsHooks.productNameAlreadyUsed },
      productsRoutes.createNewProduct
    );
    done();
  }
];
