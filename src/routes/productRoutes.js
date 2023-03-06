// imports
import express from "express";
import { createProduct } from "../controllers/productControllers.js";
import { upload } from "../middlewares/fileUploadingMiddleware.js";

// router
const router = express.Router();

router.post("/", upload, createProduct);

export default router;
