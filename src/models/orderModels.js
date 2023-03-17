// imports
import mongoose from "mongoose";

// order schema
const orderSchema = mongoose.Schema({
  productID: { type: String, required: [true, "product id required"] },
  user: { type: String, required: [true, "user required"] },
  address: { type: String, required: [true, "address required"] },
  phone: { type: String, required: [true, "phone required"] },
  amount: { type: Number, required: [true, "amount required"] },
  quantity: { type: Number, required: [true, "quantity required"] },
  paymentID: { type: String, required: false },
  isPaid: { type: Boolean, required: false, default: false },
  isReady: { type: Boolean, required: false, default: false },
  isDelivered: { type: Boolean, required: false, default: false },
});

// orderModel
const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
