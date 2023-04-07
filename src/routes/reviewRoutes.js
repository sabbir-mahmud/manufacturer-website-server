// imports
import express from "express";
import { createReview, getReviews } from "../controllers/reviewControllers.js";
import verifyUser from "../middlewares/checkUser.js";

// router
const router = express.Router();

router.get("/", getReviews);
router.post("/", verifyUser, createReview);

export default router;
