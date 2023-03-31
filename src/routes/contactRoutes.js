// imports
import { Router } from "express";
import { createContact } from "../controllers/contactControllers.js";

const router = Router();

router.post("/", createContact);

export default router;
