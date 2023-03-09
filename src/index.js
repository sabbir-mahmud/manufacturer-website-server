// imports
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./configs/connectDB.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// connect to Database
connectDB();

// routes
// root route
app.get("/", async (req, res) => {
  res.send("server running");
});

// users auth routes
app.use("/api/users/", userRouter);
app.use("/api/products/", productRouter);

// listening server to port
const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
