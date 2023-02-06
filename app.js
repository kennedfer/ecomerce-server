import Fastify from 'fastify';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import fastifyCors from '@fastify/cors';

import { paymentsController, productsController } from './controllers/index.js';
import { usersController } from './controllers/index.js';

dotenv.config();

const fastify = Fastify({ logger: true });
const MONGO_URI = process.env['MONGO_URI'];
//! MUDAR ISSO DE LUGAR
const prefix = 'api';

fastify.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST']
});

productsController.forEach((controller) =>
  fastify.register(controller, { prefix })
);
usersController.forEach((controller) =>
  fastify.register(controller, { prefix })
);
paymentsController.forEach((controller) =>
  fastify.register(controller, { prefix })
);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

fastify.listen({ port: process.env.PORT || 3000 });
