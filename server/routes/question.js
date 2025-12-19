import express from "express";
import Question from "../models/Question.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Admin creates question
router.post("/", auth(["admin"]), async (req, res) => {
  const question = await Question.create(req.body);
  res.json(question);
});

// Student fetches questions
router.get("/", auth(["student", "admin"]), async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});
export default router;