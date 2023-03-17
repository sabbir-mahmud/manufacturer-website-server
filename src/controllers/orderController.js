// imports
import Stripe from "stripe";
import orderModel from "../models/orderModels.js";
const stripe = new Stripe(
  "pk_test_51L0hxlEZlpATTp01pmVfH39AEz88vRS3gtaq24IKt7ycF15zlpMhZYIslPdUBDv76JJI2LOqh2gs9c5vARhhNRSu00W1WaO6Vd"
);

// create order
const createOrder = async (req, res) => {
  try {
    const { productID, amount, quantity, user, address, phone } = req.body;
    const order = new orderModel({
      productID,
      amount,
      user,
      quantity,
      address,
      phone,
    });
    await order.validate();
    await order.save();
    return res.status(201).send(order);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// payments controllers
// create payment intent

const createPayment = async (req, res) => {
  try {
    const price = req.body.pay;
    if (price < 999999) {
      const amount = price * 100;
      if (amount) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        if (paymentIntent.client_secret) {
          return res
            .status(200)
            .send({ clientSecret: paymentIntent.client_secret });
        } else {
          return res.status(400).send({ clientSecret: "" });
        }
      } else {
        return res.status(400).send({ clientSecret: "" });
      }
    } else {
      return res.status(400).send({ clientSecret: "" });
    }
  } catch (error) {
    console.log(error);
  }
};

// save payment information
const updateOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    order.paymentID = req.body.transactionId;
    order.isPaid = true;
    await order.save();
    res.status(200).send(order);
  } catch (error) {
    console.log(error);
  }
};

export { createOrder, createPayment, updateOrder };
