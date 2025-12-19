// models/Result.js
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  studentRollNo: String,
  score: Number,
  total: Number,
  correct: Number,
  incorrect: Number,
  notAttempted: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", resultSchema);
