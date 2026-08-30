const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    subject: {
      type: String,
      enum: ["General Enquiry", "Volunteer Registration", "Donation Support", "Partner with Us"],
      default: "General Enquiry",
    },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
