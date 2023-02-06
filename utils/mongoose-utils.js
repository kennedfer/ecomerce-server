import mongoose from 'mongoose';

export const idToObjectId = (id) => {
  return mongoose.Types.ObjectId(id);
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

export const userExists = async (query) => {
  const exists = await User.exists({ query });
  return exists;
};

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  logged: Boolean,
  adress: String,
  cart: [],
  payments: [],
  sends: []
});

const productSchema = new mongoose.Schema({
  description: String,
  name: String,
  price: Number,
  pic: String
});

export const User = new mongoose.model('users', userSchema);
export const Product = new mongoose.model('products', productSchema);
