import { usersHooks } from '../hooks/index.js';
import { paymentRoutes } from '../routes/index.js';

export const paymentsController = [
  (fastify, option, done) => {
    fastify.post('/payments/new', {}, paymentRoutes.createNewPayment);
    done();
  },
  (fastify, option, done) => {
    fastify.get(
      '/payments/:userId/:paymentId',
      { preHandler: usersHooks.userExists },
      paymentRoutes.payUserPayment
    );
    done();
  },
  (fastify, option, done) => {
    fastify.get(
      '/payments/check/:userId/:paymentId',
      { preHandler: usersHooks.userExists },
      paymentRoutes.checkPayment
    );
    done();
  }
];
