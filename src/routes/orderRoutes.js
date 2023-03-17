// imports
import express from "express";
import { createOrder } from "../controllers/orderController.js";

// router
const router = express.Router();

// routes
router.post("/", createOrder);

export default router;
