import { mongooseUtils } from '../utils/index.js';
import { Product } from '../utils/mongoose-utils.js';

export const productsExists = async (request, reply) => {
  const products = await Product.countDocuments();
  if (!products) return reply.send({ ok: true, message: 'no products' });
};

export const productExists = async (request, reply) => {
  const id = request.params.id;
  const product = await Product.findById(id);

  if (!product) return reply.send({ ok: true, message: 'product dont exists' });
};

export const productNameAlreadyUsed = async (request, reply) => {
  const productName = request.body.name;
  const product = await Product.findOne({ name: productName });

  if (product)
    return reply.send({ ok: true, message: 'product already exists' });
};
