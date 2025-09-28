// imports
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path, { join } from "path";

import connectDB from "./configs/connectDB.js";
import { productImage, userProfile } from "./controllers/imgControllers.js";
import contactRouter from "./routes/contactRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import userRouter from "./routes/userRoutes.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
// url.parse(process.argv[1]).pathname.slice(1)
dotenv.config();

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "public")));
app.use(express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));

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
app.use("/api/order/", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/contact", contactRouter);

// images route
app.get("/images/products/:imageName", productImage);
app.get("/images/profiles/:imageName", userProfile);

// listening server to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
