// imports
import mongoose from "mongoose";

// order schema
const orderSchema = mongoose.Schema({
  productID: { type: String, required: [true, "product id required"] },
  amount: { type: Number, required: [true, "amount required"] },
  paymentID: { type: String, required: false, default: false },
  isPaid: { type: Boolean, required: false, default: false },
  isReady: { type: Boolean, required: false, default: false },
  isDelivered: { type: Boolean, required: false, default: false },
});

// orderModel
const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
