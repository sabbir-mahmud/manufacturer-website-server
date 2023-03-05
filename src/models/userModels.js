// imports
import mongoose from "mongoose";

// User Models Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  is_staff: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
});

// UserModel
const userModel = mongoose.model("users", userSchema);
export default userModel;
