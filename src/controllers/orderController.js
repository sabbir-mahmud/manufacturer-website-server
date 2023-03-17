// imports

import orderModel from "../models/orderModels.js";

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

export { createOrder };
