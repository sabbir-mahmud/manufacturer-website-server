// imports
import express from "express";
import {
  createProduct,
  deleteProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productControllers.js";
import verifyAdmin from "../middlewares/checkAdmin.js";
import { uploadProductImage } from "../middlewares/fileUploadingMiddleware.js";

// router
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post(
  "/",
  verifyAdmin,
  uploadProductImage.single("image"),
  createProduct
);
router.put(
  "/:id",
  verifyAdmin,
  uploadProductImage.single("image"),
  updateProduct
);
router.delete("/:id", verifyAdmin, deleteProducts);

export default router;
