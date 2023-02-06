import { mongooseUtils } from '../utils/index.js';
import { Product } from '../utils/mongoose-utils.js';

export const getProducts = async (request, reply) => {
  const products = await Product.find();
  reply.send(products);
};

export const getProduct = async (request, reply) => {
  const id = mongooseUtils.idToObjectId(request.params.id);
  const product = await Product.find(id);

  reply.send(product);
};

export const createNewProduct = async (request, reply) => {
  const requestBody = request.body;
  const newProduct = new Product({
    name: requestBody.name,
    description: requestBody.description,
    price: requestBody.price
  });

  await newProduct.save();
};
