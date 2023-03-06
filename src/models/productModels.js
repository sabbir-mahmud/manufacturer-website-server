// imports
import mongoose from "mongoose";

// products models
const productSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  min_order: { type: Number, required: true },
  max_order: { type: Number, required: true },
});

// products models
const productModel = mongoose.model("Products", productSchema);

export default productModel;
