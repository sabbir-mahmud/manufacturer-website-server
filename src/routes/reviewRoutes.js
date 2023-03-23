// imports
import express from "express";
import { createReview, getReviews } from "../controllers/reviewControllers.js";

// router
const router = express.Router();

router.get("/", getReviews);
router.post("/", createReview);

export default router;
