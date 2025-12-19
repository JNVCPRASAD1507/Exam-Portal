import express from"express";
import Result from"../models/Result.js";
import auth from"../middleware/auth.js";

const router = express.Router();

// Student submits exam result
router.post("/submit", auth(["student"]), async (req, res) => {
  try {
    const { score, total, correct, incorrect, notAttempted } = req.body;

    const result = await Result.create({
      studentRollNo: req.user.id,
      score,
      total,
      correct,
      incorrect,
      notAttempted,
    });

    res.json({ message: "Result saved", result });
  } catch (error) {
    res.status(500).json({ message: "Error saving result" });
  }
});

export default router;