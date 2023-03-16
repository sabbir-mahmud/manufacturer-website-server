// imports
import mongoose from "mongoose";

// Cart models
const cartSchema = new mongoose.Schema({
  productID: { type: String, required: [true, "product id required!"] },
  amount: { type: Number, required: [true, "amount required!"] },
  user: { type: String, required: [true, "user required!"] },
});

// cart models
const cartModels = mongoose.model("cart", cartSchema);
export default cartModels;
