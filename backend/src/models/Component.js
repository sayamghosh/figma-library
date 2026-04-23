const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    previewImageUrl: {
      type: String,
      required: true,
    },
    designType: {
      type: String,
      enum: ["Wireframe", "UI Design"],
      default: "UI Design",
    },
    pricingType: {
      type: String,
      enum: ["Free", "Pro"],
      default: "Free",
    },
    figmaDataBase64: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

componentSchema.index({ createdAt: -1 });
componentSchema.index({ tags: 1, createdAt: -1 });
componentSchema.index({ name: 1, createdAt: -1 });

const Component = mongoose.model("Component", componentSchema);

module.exports = { Component };
