// imports
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./configs/connectDB.js";

dotenv.config();

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to Database
connectDB();

// routes
// root route
app.get("/", async (req, res) => {
  res.send("server running");
});

// users auth routes

// listening server to port
const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
