const express = require("express");
const crypto = require("crypto");
const Donation = require("../models/Donation");
const { protectAdmin } = require("../middleware/adminAuth");

const router = express.Router();

function generateReceiptId() {
  return "UMG-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

// POST /api/donate  (public - donation form)
// Note: This logs the donation intent and generates a receipt ID.
// It does not process real payments — plug in a gateway (Razorpay/Stripe) here for production use.
router.post("/", async (req, res) => {
  try {
    const { fullName, email, amount, campaign, cycle } = req.body;
    if (!fullName || !amount) {
      return res.status(400).json({ success: false, message: "Full name and amount are required" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
    }

    const receiptId = generateReceiptId();
    const donation = await Donation.create({
      fullName,
      email,
      amount,
      campaign,
      cycle,
      receiptId,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Donation recorded! A payment gateway can be connected to complete processing.",
      receiptId: donation.receiptId,
      donation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not record donation", error: err.message });
  }
});

// GET /api/donate  (admin only - list all donations)
router.get("/", protectAdmin, async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 });
  const total = donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({ success: true, count: donations.length, totalAmount: total, donations });
});

module.exports = router;
