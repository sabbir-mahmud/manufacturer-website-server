// imports
import express from "express";
import {
  createProduct,
  updateProduct,
} from "../controllers/productControllers.js";

// router
const router = express.Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);

export default router;
