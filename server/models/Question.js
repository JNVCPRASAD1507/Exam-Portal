// models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Question", questionSchema);
