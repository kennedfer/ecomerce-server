import { usersHooks } from '../hooks/index.js';
import { usersRoutes } from '../routes/index.js';

export const usersController = [
  (fastify, options, done) => {
    fastify.post(
      '/user/login',
      { preHandler: [usersHooks.emailNotRegistered, usersHooks.checkPassword] },
      usersRoutes.loginUser
    );
    done();
  },
  (fastify, options, done) => {
    fastify.post(
      '/user/signup',
      { preHandler: usersHooks.emailAlreadyRegistered },
      usersRoutes.signupUser
    );
    done();
  },
  (fastify, options, done) => {
    fastify.get(
      '/user/:id',
      { preHandler: usersHooks.userExists },
      usersRoutes.getUser
    );
    done();
  },
  (fastify, options, done) => {
    fastify.get(
      '/user/:id/logged',
      { preHandler: usersHooks.userExists },
      usersRoutes.userIsLogged
    );
    done();
  },
  (fastify, options, done) => {
    fastify.get(
      '/user/:id/cart',
      { preHandler: usersHooks.userExists },
      usersRoutes.getUserCart
    );
    done();
  },
  (fastify, options, done) => {
    fastify.post(
      '/user/:id/cart/new',
      { preHandler: usersHooks.userExists },
      usersRoutes.addProductToCart
    );
    done();
  },
  (fastify, options, done) => {
    fastify.get(
      '/user/:id/cart/remove',
      { preHandler: usersHooks.userExists },
      usersRoutes.removeProductFromCart
    );
    done();
  }
];
