import { User } from '../utils/mongoose-utils.js';
import { qrCodeUtils } from '../utils/index.js';

export const loginUser = async (request, reply) => {
  const { email } = request.body;
  const user = await User({ email });

  user.logged = true;

  await user.save();
  reply.send({ ok: true, message: 'user logged', id: user._id });
};

export const signupUser = async (request, reply) => {
  const { body } = request;
  const user = new User({
    name: body.name,
    email: body.email,
    password: body.password,
    logged: false
  });

  await user.save();
  reply.send({ ok: true, message: 'user created' });
};

export const userIsLogged = async (request, reply) => {
  const user = await User.findById(request.params.id);
  reply.send(user.logged);
};

export const getUser = async (request, reply) => {
  const user = await User.findById(request.params.id);
  reply.send(user);
};

export const getUserCart = async (request, reply) => {
  const user = await User.findById(request.params.id);
  reply.send(user.cart);
};

export const addProductToCart = async (request, reply) => {
  const product = request.body;
  const user = await User.findById(request.params.id);

  user.cart.push({
    ...product,
    total: product.quantity * product.price
  });

  await user.save();
  reply.send({ ok: true, message: 'added to cart' });
};

export const removeProductFromCart = async (request, reply) => {
  const productIndex = request.body.index;
  const user = await User.findById(request.params.id);

  user.cart.splice(productIndex, 1);
  await user.save();

  reply.send({ ok: true, message: 'remove from cart' });
};

export const checkoutUserCart = async (request, reply) => {
  const producstListIndex = req.body.productsListIndex;
  const user = await User.findById(request.params.id);

  const filteredCart = user.cart.filter(
    (ele, i) => !producstListIndex.includes(i)
  );

  const checkoutProducts = [];
  producstListIndex.forEach((i) => checkoutProducts.push(user.cart[i]));

  const paymentId = new mongoose.Types.ObjectId();

  const newPayment = {
    paymentId,
    status: 'pendente',
    info: { payerId: user._id, payerName: user.name },
    infoAditional: `Compra na 'Lojinha do Kenis' no valor de ${req.body.total}`,
    total: req.body.total,
    products: checkoutProducts
  };

  const paymentApiRoute = `${req.protocol}://${req.hostname} + '/payments`;
  const { status, data } = await axios.post(paymentApiRoute, {
    userId: user._id,
    paymentId
  });

  if (status != 200)
    return reply.send({ ok: false, message: 'error while creating payment' });

  const paymentLink = data;
  const qrCode = qrCodeUtils.getPaymentQRcode(paymentLink);

  newPayment.url = paymentLink;
  newPayment.qrCode = await qrCode;

  user.cart = filteredCart;
  user.payments.push(newPayment);

  await user.save();
  reply.send({ ok: true, message: 'paymente added' });
};
