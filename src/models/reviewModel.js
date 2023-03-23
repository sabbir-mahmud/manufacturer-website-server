// imports
import mongoose from "mongoose";

// review schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: [true, "name required!"] },
  img: { type: String, required: [true, "name required!"] },
  bio: { type: String, required: [true, "name required!"] },
  location: { type: String, required: [true, "name required!"] },
  starts: { type: String, required: [true, "name required!"] },
  review: { type: String, required: [true, "name required!"] },
});

// review models
const reviewModel = mongoose.model("reviews", reviewSchema);
export default reviewModel;
