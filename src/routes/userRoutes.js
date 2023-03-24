// imports
import express from "express";
import {
  createProfile,
  getProfile,
} from "../controllers/profileControllers.js";
import {
  login_controller,
  userDetails,
} from "../controllers/userControllers.js";

// Router
const router = express.Router();

router.get("/admin", userDetails);
router.get("/:user", getProfile);
router.put("/profile", createProfile);
router.put("/login", login_controller);

export default router;
