// imports
import express from "express";
import {
  createProduct,
  deleteProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productControllers.js";
import { uploadProductImage } from "../middlewares/fileUploadingMiddleware.js";

// router
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", uploadProductImage.single("image"), createProduct);
router.put("/:id", uploadProductImage.single("image"), updateProduct);
router.delete("/:id", deleteProducts);

export default router;
