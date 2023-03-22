// imports
import express from "express";
import {
  login_controller,
  userDetails,
} from "../controllers/userControllers.js";

// Router
const router = express.Router();

router.get("/admin", userDetails);
router.put("/login", login_controller);

export default router;
