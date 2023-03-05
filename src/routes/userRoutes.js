// imports
import express from "express";
import { login_controller } from "../controllers/userControllers.js";

// Router
const router = express.Router();

router.put("/login", login_controller);

export default router;
