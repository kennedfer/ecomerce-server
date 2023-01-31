import Fastify from "fastify";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { User, Product, idToObjectId } from "./mongoose_utils.js";
dotenv.config();

const fastify = Fastify({ logger: true });
const MONGO_URI = process.env["MONGO_URI"];

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST"],
});

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
fastify.post("/user/login", (req, res) => {
  const bodyUser = req.body;

  User.findOne({ email: bodyUser.email }, (err, dbUser) => {
    if (err) return res.send({ msg: err });
    if (dbUser === null) return res.send({ msg: "user no encontruaido!" });

    if (bodyUser.password !== dbUser.password) {
      res.code(200);
      return res.send({ wrong: true });
    }

    dbUser.logged = true;
    dbUser.save((err) => {
      if (err) return res.send(err);
      return res.send({
        id: dbUser._id,
        msg: "Logged with succes",
      });
    });
  });
});

fastify.post("/user/signup", (req, res) => {
  const bodyUser = req.body;
  User.findOne({ email: bodyUser.email }, (err, dbUser) => {
    if (err) return res.send({ msg: err });
    if (dbUser !== null) {
      return res.send({
        emailUsed: true,
      });
    }
  });

  const dbUser = new User({
    email: bodyUser.email,
    password: bodyUser.password,
    name: bodyUser.name,
    logged: false,
    cart: [],
  });

  dbUser.save((err) => {
    if (err) res.send(err);

    res.code(200);
    res.send({ msg: "user created" });
  });
});

fastify.get("/user/:id/logged", (req, res) => {
  const id = idToObjectId(req.params.id);
  User.findById(id, (err, dbUser) => {
    if (err) return res.send(err);
    if (dbUser === null) return res.send("dont has user");

    res.send({ logged: dbUser.logged });
  });
});

fastify.get("/user/:id", (req, res) => {
  const id = idToObjectId(req.params.id);
  User.findById(id, (err, dbUser) => {
    if (err) return res.send(err);
    if (dbUser === null) return res.send("dont has user");
    if (!dbUser.logged) return res.send("not logged");

    res.send(dbUser);
  });
});

fastify.get("/product/:id", (req, res) => {
  const id = idToObjectId(req.params.id);
  Product.findById(id, (err, product) => {
    if (err) return res.send(err);
    if (product === null) return res.send("product donts existst");

    res.send(product);
  });
});

fastify.get("/products", (req, res) => {
  console.log("calica");

  Product.find({}, (err, allProducts) => {
    if (err) return res.send(err);
    if (allProducts === null) return res.send("No products");

    res.send(allProducts);
  });
});

fastify.post("/user/:id/cart/add", (req, res) => {
  const product = req.body;
  const id = idToObjectId(req.params.id);
  User.findById(id, (err, dbUser) => {
    if (err) return res.send(err);
    if (dbUser === null) return res.send("dont has user");
    if (!dbUser.logged) return res.send("not logged");

    dbUser.cart.push({
      ...product,
      total: product.quantity * product.price,
    });

    dbUser.save((err) => {
      if (err) return res.send(err);

      res.code(200);
      res.send("added to cart");
    });
  });
});

fastify.post("/user/:id/cart/remove", (req, res) => {
  // const product = req.body;
  const productIndex = req.body.index;
  const id = idToObjectId(req.params.id);
  User.findById(id, (err, dbUser) => {
    if (err) return res.send(err);
    if (dbUser === null) return res.send("dont has user");
    if (!dbUser.logged) return res.send("not logged");

    dbUser.cart.splice(productIndex, 1);
    dbUser.save((err) => {
      if (err) return res.send(err);

      res.code(200);
      res.send("removed from cart");
    });
  });
});

fastify.post("/user/:id/cart/checkout", (req, res) => {
  // const product = req.body;
  const productsIndex = req.body.productsList;
  const id = idToObjectId(req.params.id);
  User.findById(id, (err, dbUser) => {
    if (err) return res.send(err);
    if (dbUser === null) return res.send("dont has user");
    if (!dbUser.logged) return res.send("not logged");

    const newCart = dbUser.cart.filter(
      (ele) => !productsIndex.includes(ele.id)
    );
    dbUser.cart = newCart;

    console.log(newCart);
    console.log(productsIndex);

    dbUser.save((err) => {
      if (err) return res.send(err);

      res.code(200);
      res.send("removeds from cart");
    });
  });
});

fastify.post("/products/new", (req, res) => {
  const bodyProduct = req.body;
  Product.findOne({ name: bodyProduct.name }, (err, dbProduct) => {
    if (err) return res.send({ msg: err });
    if (dbProduct !== null) {
      res.code(422);
      return res.send({
        msg: "product already exists",
      });
    }
  });

  const dbProduct = new Product({
    description: bodyProduct.description,
    name: bodyProduct.name,
    price: bodyProduct.price,
  });

  dbProduct.save((err) => {
    if (err) return res.send(err);

    res.code(200);
    res.send("Product added");
  });
});

fastify.listen({ port: process.env.PORT || 3000 });