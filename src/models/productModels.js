// imports
import mongoose from "mongoose";

// products models
const productSchema = new mongoose.Schema({
  img: { type: String, required: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
  quantity: { type: Number, required: true },
  min_order: { type: Number, required: true },
  max_order: { type: Number, required: true },
  description: { type: String, required: true },
});

// products models
const productModel = mongoose.model("Products", productSchema);

export default productModel;
