// imports
import express from "express";
import {
  deleteProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productControllers.js";
import { upload } from "../middlewares/fileUploadingMiddleware.js";

// router
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", upload.single("image")); //createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProducts);

export default router;
