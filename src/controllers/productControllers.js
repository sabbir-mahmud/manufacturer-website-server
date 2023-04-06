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
      img: `http://localhost:5000/images/products/${req.file.filename}`,
      brand: req.body.brand,
      name: req.body.name,
      model: req.body.model,
      price: req.body.price,
      weight: req.body.weight,
      quantity: req.body.quantity,
      min_order: req.body.min_order,
      max_order: req.body.max_order,
      description: req.body.description,
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
    const {
      brand,
      name,
      model,
      quantity,
      price,
      weight,
      min_order,
      max_order,
      description,
    } = req.body;
    if (product) {
      product.img = `http://localhost:5000/images/products/${req.file.filename}`;
      product.brand = brand;
      product.name = name;
      product.model = model;
      product.quantity = quantity;
      product.price = price;
      product.weight = weight;
      product.min_order = min_order;
      product.max_order = max_order;
      product.description = description;
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
