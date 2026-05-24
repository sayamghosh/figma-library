const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    company: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["submitted", "emailed", "failed"],
      default: "submitted",
    },
    mailError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({ userId: 1, createdAt: -1 });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

module.exports = { ContactMessage };
