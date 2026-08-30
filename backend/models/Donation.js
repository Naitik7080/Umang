const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    amount: { type: Number, required: true, min: 1 },
    campaign: {
      type: String,
      enum: [
        "Green Village Plantation Drive",
        "School Kits for First-Gen Learners",
        "Mobile Health Camps",
        "Wherever needed most",
      ],
      default: "Wherever needed most",
    },
    cycle: { type: String, enum: ["one-time", "monthly"], default: "one-time" },
    receiptId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
