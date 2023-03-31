// imports
import mongoose from "mongoose";

// Contact Schema
const contactSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email Required!"] },
  phone: { type: String, required: [true, "Phone Required!"] },
  msg: { type: String, required: [true, "Message Required!"] },
});

// Contact Models
const contactModel = mongoose.model("Contact", contactSchema);
export default contactModel;
