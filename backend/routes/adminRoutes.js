const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ContactMessage = require("../models/ContactMessage");
const Donation = require("../models/Donation");
const { protectAdmin } = require("../middleware/adminAuth");

const router = express.Router();

// POST /api/admin/login  -> uses ADMIN_EMAIL / ADMIN_PASSWORD from env, no DB record needed
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  }

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ success: true, token });
});

// GET /api/admin/stats  -> quick dashboard numbers
router.get("/stats", protectAdmin, async (req, res) => {
  const [userCount, messageCount, donationCount, donations] = await Promise.all([
    User.countDocuments(),
    ContactMessage.countDocuments(),
    Donation.countDocuments(),
    Donation.find(),
  ]);
  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);

  res.json({
    success: true,
    stats: { userCount, messageCount, donationCount, totalRaised },
  });
});

module.exports = router;
