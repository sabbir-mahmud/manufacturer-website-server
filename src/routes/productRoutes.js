// imports
import express from "express";
import { createProduct } from "../controllers/productControllers.js";
import { upload } from "../middlewares/fileUploadingMiddleware.js";

// router
const router = express.Router();

router.post("/", upload.single("img"), createProduct);

export default router;
