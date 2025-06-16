import express from "express";
import User from "../models/User.js";

const router = express.Router();


router.post("/user", async (req, res) => {
  const { name, role } = req.body;
  try {
    if (role === "manager") {
      const existingManager = await User.findOne({ role: "manager" });
      if (existingManager) {
        return res.status(403).json({ error: "A manager already exists." });
      }
    }
    let user = await User.findOne({ name, role });
    if (!user) {
      user = await User.create({ name, role });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

export default router;