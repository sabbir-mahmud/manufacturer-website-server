// imports
import mongoose from "mongoose";

// profile models
const profileSchema = new mongoose.Schema({
  user: { type: String, required: [true, "user required!"] },
  name: { type: String, required: [true, "name required!"] },
  avatar: { type: String, required: [true, "avatar images required!"] },
  bio: { type: String, required: false },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  education: { type: String, required: false },
  linkedin: { type: String, required: false },
  github: { type: String, required: false },
});

// profile model
const profileModel = mongoose.model("profile", profileSchema);
export default profileModel;
