// imports
import express from "express";
import {
    createOrder,
    createPayment,
    deleteOrder,
    getAdminOrders,
    getOrder,
    getOrders,
    shippedOrder,
    updateOrder,
} from "../controllers/orderController.js";
import verifyAdmin from "../middlewares/checkAdmin.js";
import verifyUser from "../middlewares/checkUser.js";

// router
const router = express.Router();

// routes
router.get("/", getOrders);
router.get("/admin", verifyUser, verifyAdmin, getAdminOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.post("/payment", createPayment);
router.patch("/:id", updateOrder);
router.patch("/shipped/:id", verifyUser, verifyAdmin, shippedOrder);
router.delete("/:id", deleteOrder);

export default router;
