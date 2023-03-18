// imports
import express from "express";
import {
  createOrder,
  createPayment,
  getOrder,
  getOrders,
} from "../controllers/orderController.js";

// router
const router = express.Router();

// routes
router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.post("/payment", createPayment);

export default router;
