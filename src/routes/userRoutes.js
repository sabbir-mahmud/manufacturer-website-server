// imports
import express from "express";
import {
  createProfile,
  getProfile,
} from "../controllers/profileControllers.js";
import {
  deleteUser,
  getUsers,
  login_controller,
  makeAdmin,
  userDetails,
} from "../controllers/userControllers.js";
import { uploadUserImage } from "../middlewares/fileUploadingMiddleware.js";

// Router
const router = express.Router();

router.get("/admin", userDetails);
router.get("/make-admin/:email", makeAdmin);
router.get("/all-users", getUsers);
router.get("/:user", getProfile);
router.delete("/user/:id", deleteUser);
router.put("/profile", uploadUserImage.single("avatar"), createProfile);
router.put("/login", login_controller);

export default router;
