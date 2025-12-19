import express from "express";
import User from "../models/User.js";
import Result from "../models/Result.js";
import auth from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Admin only — get all students
router.get("/students", auth(["admin"]), async (req, res) => {
  const students = await User.find({ role: "student" }).select("rollNo");
  res.json(students);
});

// Admin only — get all results
router.get("/results", auth(["admin"]), async (req, res) => {
  const results = await Result.find();
  res.json(results);
});

// Admin only — create student
router.post("/create-student", auth(["admin"]), async (req, res) => {
  try {
    const { rollNo, password } = req.body;

    const existing = await User.findOne({ rollNo });
    if (existing) {
      return res.status(400).json({ message: "Roll number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({
      rollNo,
      password: hashedPassword,
      role: "student",
    });

    res.json({ message: "Student created", rollNo: student.rollNo });
  } catch (error) {
    res.status(500).json({ message: "Error creating student" });
  }
});

export default router; // <-- export the router directly
