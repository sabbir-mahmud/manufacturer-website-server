// imports
import productModel from "../models/productModels.js";

// create new product
const createProduct = async (req, res) => {
  try {
    const product = new productModel({
      img: req.file.filename,
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      min_order: req.body.min_order,
      max_order: req.body.max_order,
    });
    await product.validate();
    await product.save();
    return res.status(201).send(product);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// update products
const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (product) {
      product.img = req.file.filename;
      product.name = req.body.name;
      product.quantity = req.body.quantity;
      product.price = req.body.price;
      product.min_order = req.body.min_order;
      product.max_order = req.body.max_order;
      await product.save();

      return res.status(200).json(product);
    } else {
      res.status(400).send("Product not found!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export { createProduct, updateProduct };
