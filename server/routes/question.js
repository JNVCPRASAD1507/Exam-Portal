import express from "express";
import Question from "../models/Question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Admin creates question
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Error creating question" });
  }
});

// Student fetches questions (NO correctAnswer)
router.get("/", auth(["student", "admin"]), async (req, res) => {
  try {
    const questions = await Question.find().select("-correctAnswer");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

export default router;