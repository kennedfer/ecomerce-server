import mongoose from "mongoose";

export const idToObjectId = (id) =>{
    return mongoose.Types.ObjectId(id);
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    logged: Boolean,
    cart: [],
});

const productSchema = new mongoose.Schema({
    description: String,
    name: String,
    price: Number,
    pic:String,
});

export const User = new mongoose.model("users", userSchema);
export const Product = new mongoose.model("products", productSchema);