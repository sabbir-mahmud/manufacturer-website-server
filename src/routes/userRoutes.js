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
import verifyAdmin from "../middlewares/checkAdmin.js";
import verifyUser from "../middlewares/checkUser.js";
import { uploadUserImage } from "../middlewares/fileUploadingMiddleware.js";

// Router
const router = express.Router();

router.get("/admin", verifyUser, verifyAdmin, userDetails);
router.get("/make-admin/:email", verifyUser, verifyAdmin, makeAdmin);
router.get("/all-users", verifyUser, verifyAdmin, getUsers);
router.get("/:user", verifyUser, getProfile);
router.delete("/user/:id", verifyUser, verifyAdmin, deleteUser);
router.put(
  "/profile",
  verifyUser,
  uploadUserImage.single("avatar"),
  createProfile
);
router.put("/login", login_controller);

export default router;
