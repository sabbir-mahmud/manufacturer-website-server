// imports
import productModel from "../models/productModels.js";

// get all products
const getProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// get product
const getProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    return res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// create new product
const createProduct = async (req, res) => {
  try {
    const product = new productModel({
      img: req.body.filename,
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
    const { filename, name, quantity, price, min_order, max_order } = req.body;
    const img = req.file.image;
    console.log(img);
    // if (!filename || !name || !quantity || !price || !min_order || !max_order) {
    //   return res
    //     .status(400)
    //     .send("Non fields error!, please send a valid data");
    // }
    if (product) {
      product.img = filename;
      product.name = name;
      product.quantity = quantity;
      product.price = price;
      product.min_order = min_order;
      product.max_order = max_order;
      await product.save();
      console.log(product);

      return res.status(200).json(product);
    } else {
      res.status(400).send("Product not found!");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// delete products
const deleteProducts = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    const result = await product.deleteOne();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export {
  createProduct,
  deleteProducts,
  getProducts,
  getProduct,
  updateProduct,
};
