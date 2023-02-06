// import Fastify from 'fastify';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from '@fastify/cors';
// import { User, Product, idToObjectId } from './utils/mongoose-utils.js';
// import axios from 'axios';
// import getPaymentQRcode from './utils/qrcode-utils.js';
// dotenv.config();

// const fastify = Fastify({ logger: true });
// const MONGO_URI = process.env['MONGO_URI'];

// fastify.register(cors, {
//   origin: '*',
//   methods: ['GET', 'PUT', 'POST']
// });

// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// fastify.post('/user/login', (req, res) => {
//   const bodyUser = req.body;

//   User.findOne({ email: bodyUser.email }, (err, dbUser) => {
//     if (err) return res.send({ msg: err });
//     if (!dbUser) return res.send({ msg: 'user no encontruaido!' });

//     if (bodyUser.password !== dbUser.password) {
//       res.code(200);
//       return res.send({ wrong: true });
//     }

//     dbUser.logged = true;
//     dbUser.save((err) => {
//       if (err) return res.send(err);
//       return res.send({
//         id: dbUser._id,
//         msg: 'Logged with succes'
//       });
//     });
//   });
// });

// fastify.post('/user/signup', (req, res) => {
//   const bodyUser = req.body;
//   User.findOne({ email: bodyUser.email }, (err, dbUser) => {
//     if (err) return res.send({ msg: err });
//     if (dbUser !== null) {
//       return res.send({
//         emailUsed: true
//       });
//     }
//   });

//   const dbUser = new User({
//     email: bodyUser.email,
//     password: bodyUser.password,
//     name: bodyUser.name,
//     logged: false,
//     cart: []
//   });

//   dbUser.save((err) => {
//     if (err) res.send(err);

//     res.code(200);
//     res.send({ msg: 'user created' });
//   });
// });

// fastify.get('/user/:id/logged', (req, res) => {
//   const id = idToObjectId(req.params.id);
//   User.findById(id, (err, dbUser) => {
//     if (err) return res.send(err);
//     if (!dbUser) return res.send('dont has user');

//     res.send({ logged: dbUser.logged });
//   });
// });

// fastify.get('/user/:id', (req, res) => {
//   const id = idToObjectId(req.params.id);
//   User.findById(id, (err, dbUser) => {
//     if (err) return res.send(err);
//     if (!dbUser) return res.send('dont has user');
//     if (!dbUser.logged) return res.send('not logged');

//     res.send(dbUser);
//   });
// });

// fastify.get('/product/:id', (req, res) => {
//   const id = idToObjectId(req.params.id);
//   Product.findById(id, (err, product) => {
//     if (err) return res.send(err);
//     if (!product) return res.send('product donts existst');

//     res.send(product);
//   });
// });

// fastify.get('/products', (req, res) => {
//   //! LOG TEST RENDERON
//   console.log('calica port');

//   Product.find({}, (err, allProducts) => {
//     if (err) return res.send(err);
//     if (!allProducts) return res.send('No products');

//     res.send(allProducts);
//   });
// });

// fastify.post('/user/:id/cart/add', (req, res) => {
//   const product = req.body;
//   const id = idToObjectId(req.params.id);
//   User.findById(id, (err, dbUser) => {
//     if (err) return res.send(err);
//     if (!dbUser) return res.send('dont has user');
//     if (!dbUser.logged) return res.send('not logged');

//     dbUser.cart.push({
//       ...product,
//       total: product.quantity * product.price
//     });

//     dbUser.save((err) => {
//       if (err) return res.send(err);

//       res.code(200);
//       res.send('added to cart');
//     });
//   });
// });

// fastify.post('/user/:id/cart/remove', (req, res) => {
//   // const product = req.body;
//   const productIndex = req.body.index;
//   const id = idToObjectId(req.params.id);
//   User.findById(id, (err, dbUser) => {
//     if (err) return res.send(err);
//     if (dbUser === null) return res.send('dont has user');
//     if (!dbUser.logged) return res.send('not logged');

//     dbUser.cart.splice(productIndex, 1);
//     dbUser.save((err) => {
//       if (err) return res.send(err);

//       res.code(200);
//       res.send('removed from cart');
//     });
//   });
// });

// fastify.post('/user/:id/cart/checkout', (req, res) => {
//   /* const product = req.body;
//   const PAYMENT = {
//     paymentId:  MOngooseID,
//     total:Number,
//     products: [Products]
//     cartIndex: [Number]
//   }
//   */

//   const productsIndex = req.body.productsIndex;
//   const userId = idToObjectId(req.params.id);

//   User.findById(userId, async (err, dbUser) => {
//     if (err) return res.send(err);
//     if (dbUser === null) return res.send('dont has user');
//     if (!dbUser.logged) return res.send('not logged');

//     const newCart = dbUser.cart.filter((ele, i) => !productsIndex.includes(i));

//     const checkoutProducts = [];

//     productsIndex.forEach((i) => checkoutProducts.push(dbUser.cart[i]));

//     const paymentId = new mongoose.Types.ObjectId().toHexString();

//     const newPayment = {
//       paymentId,
//       status: 'pendente',
//       info: { payerId: dbUser._id, payerName: dbUser.name },
//       infoAditional: `Compra na 'Lojinha do Kenis' no valor de ${req.body.total}`,
//       total: req.body.total,
//       products: checkoutProducts
//     };

//     const paymentRoute = `${req.protocol}://${req.hostname} + '/payments`;
//     const requestResponse = await axios.post(paymentRoute, {
//       userId: dbUser._id,
//       paymentId
//     });

//     if (requestResponse.status != 200) return res.send('error');

//     const paymentLink = requestResponse.data;
//     newPayment.url = paymentLink;
//     const qrCode = getPaymentQRcode(paymentLink);
//     newPayment.qrCode = await qrCode;
//     console.log(newPayment.qrCode);

//     dbUser.cart = newCart;
//     dbUser.payments.push(newPayment);

//     dbUser.save((err) => {
//       if (err) return res.send(err);

//       res.code(200);
//       console.log('payment added');
//       res.send('removeds from cart');
//     });
//   });
// });

// fastify.post('/payments', (req, res) => {
//   const newPayment = req.body;
//   const paymentLink = `${req.protocol}://${req.hostname}/payments/${newPayment.userId}/${newPayment.paymentId}`;
//   res.send(paymentLink);
// });

// fastify.get('/payments/:userId/:paymentId', (req, res) => {
//   const userId = idToObjectId(req.params.userId);

//   User.findById(userId, async (err, dbUser) => {
//     if (err) return res.send(err);
//     if (dbUser === null) return res.send('dont has user');
//     if (!dbUser.logged) return res.send('not logged');

//     const payment = dbUser.payments.filter(
//       (payment) => payment.paymentId == req.params.paymentId
//     );
//     if (!payment.length) return res.send('payment not found');
//     if (payment.status == 'fullfiled')
//       return ServiceWorker.send('payment already paid');

//     payment.status = 'pago';

//     const paymentIndex = dbUser.payments.indexOf(payment);

//     dbUser.payments.splice(paymentIndex, 1);
//     dbUser.sends.push(payment);

//     dbUser.save((err) => {
//       if (err) return err;

//       res.send('pagamnto realizado');
//     });
//   });
// });

// fastify.get('/payments/check/:userId/:paymentId', (req, res) => {
//   const userId = idToObjectId(req.params.userId);

//   User.findById(userId, async (err, dbUser) => {
//     if (err) return res.send(err);
//     if (dbUser === null) return res.send('dont has user');
//     if (!dbUser.logged) return res.send('not logged');

//     const paymentArray = dbUser.payments.filter(
//       (payment) => payment.paymentId == req.params.paymentId
//     );
//     if (!paymentArray.length) return res.send('pago');
//     const payment = paymentArray[0];

//     res.send(payment.status);
//   });
// });

// fastify.post('/products/new', (req, res) => {
//   const bodyProduct = req.body;
//   Product.findOne({ name: bodyProduct.name }, (err, dbProduct) => {
//     if (err) return res.send({ msg: err });
//     if (dbProduct) {
//       res.code(422);
//       return res.send({
//         msg: 'product already exists'
//       });
//     }
//   });

//   const dbProduct = new Product({
//     description: bodyProduct.description,
//     name: bodyProduct.name,
//     price: bodyProduct.price
//   });

//   dbProduct.save((err) => {
//     if (err) return res.send(err);

//     res.code(200);
// //     res.send('Product added');
// //   });
// // });

// fastify.listen({ port: process.env.PORT || 3000 });
