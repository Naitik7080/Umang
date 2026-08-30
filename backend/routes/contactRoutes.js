const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const { protectAdmin } = require("../middleware/adminAuth");

const router = express.Router();

// POST /api/contact  (public - contact form)
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, message: "Full name, email and message are required" });
    }

    const doc = await ContactMessage.create({ fullName, email, phone, subject, message });
    res.status(201).json({ success: true, message: "Thanks! We'll get back to you within one working day.", id: doc._id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not submit message", error: err.message });
  }
});

// GET /api/contact  (admin only - list all messages)
router.get("/", protectAdmin, async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, messages });
});

module.exports = router;
