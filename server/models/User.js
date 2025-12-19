// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], required: true },
});

export default mongoose.model("User", userSchema);
