import express from "express";
import auth from "../middleware/auth.js";
import Result from "../models/Result.js";

const router = express.Router();

/**
 * STUDENT → SUBMIT TEST
 */
router.post("/submit", auth(["student"]), async (req, res) => {
  try {
    const { correct, wrong, notAttempted, total } = req.body;

    if (
      correct === undefined ||
      wrong === undefined ||
      notAttempted === undefined ||
      total === undefined
    ) {
      return res.status(400).json({ message: "Missing result data" });
    }

    const result = new Result({
      student: req.user._id,
      correct,
      wrong,
      notAttempted,
      total,
      score: correct,
    });

    await result.save();

    res.status(201).json({
      message: "Test submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
