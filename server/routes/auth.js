
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { rollNo, password, role } = req.body;

    const user = await User.findOne({ rollNo, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ rollNo: user.rollNo, role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= TEST ================= */
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

export default router;
