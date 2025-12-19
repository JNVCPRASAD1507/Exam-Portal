import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    correct: Number,
    wrong: Number,
    notAttempted: Number,
    total: Number,
    score: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
