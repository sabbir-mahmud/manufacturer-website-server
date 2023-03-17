// imports
import express from "express";
import {
  createProduct,
  deleteProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productControllers.js";

// router
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProducts);

export default router;
