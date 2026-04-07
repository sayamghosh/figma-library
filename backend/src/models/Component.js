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
