// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ rollNo: "admin001", role: "admin" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      rollNo: "admin001",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created:", admin);
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

createAdmin();
