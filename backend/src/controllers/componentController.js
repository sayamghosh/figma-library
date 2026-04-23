const { asyncHandler } = require("../utils/asyncHandler");
const { Component } = require("../models/Component");

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const listComponents = asyncHandler(async (req, res) => {
  const { q = "", tag = "", page = 1, limit = 20, includeData = "false" } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const shouldIncludeData = String(includeData).toLowerCase() === "true";

  const query = {};
  if (q) {
    const safeSearch = escapeRegex(q);
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { tags: { $regex: safeSearch, $options: "i" } },
    ];
  }
  if (tag) {
    query.tags = { $regex: `^${escapeRegex(tag)}$`, $options: "i" };
  }

  const select = shouldIncludeData ? "" : "-figmaDataBase64";

  const [items, total] = await Promise.all([
    Component.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .select(select)
      .populate({ path: "createdBy", select: "name email" })
      .lean(),
    Component.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page: pageNumber,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    },
  });
});

const listMyComponents = asyncHandler(async (req, res) => {
  const { q = "", tag = "", page = 1, limit = 20 } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const query = { createdBy: req.user.userId };
  if (q) {
    const safeSearch = escapeRegex(q);
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { tags: { $regex: safeSearch, $options: "i" } },
    ];
  }
  if (tag) {
    query.tags = { $regex: `^${escapeRegex(tag)}$`, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Component.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .select("-figmaDataBase64")
      .lean(),
    Component.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page: pageNumber,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    },
  });
});

const createComponent = asyncHandler(async (req, res) => {
  const { name, description = "", tags = [], previewImageUrl, figmaDataBase64, designType, pricingType } = req.body;

  if (!name || !previewImageUrl || !figmaDataBase64) {
    res.status(400);
    throw new Error("name, previewImageUrl, and figmaDataBase64 are required");
  }

  const component = await Component.create({
    name,
    description,
    tags: Array.isArray(tags) ? tags : [],
    previewImageUrl,
    figmaDataBase64,
    designType,
    pricingType,
    createdBy: req.user.userId,
  });

  res.status(201).json({
    success: true,
    data: component,
  });
});

const getComponent = asyncHandler(async (req, res) => {
  const component = await Component.findById(req.params.id)
    .populate("createdBy", "name email")
    .lean();
  if (!component) {
    res.status(404);
    throw new Error("Component not found");
  }

  res.json({ success: true, data: component });
});

const updateComponent = asyncHandler(async (req, res) => {
  const component = await Component.findById(req.params.id);
  if (!component) {
    res.status(404);
    throw new Error("Component not found");
  }

  if (component.createdBy.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("You can only edit your own components");
  }

  const updates = {
    name: req.body.name ?? component.name,
    description: req.body.description ?? component.description,
    tags: Array.isArray(req.body.tags) ? req.body.tags : component.tags,
    previewImageUrl: req.body.previewImageUrl ?? component.previewImageUrl,
    figmaDataBase64: req.body.figmaDataBase64 ?? component.figmaDataBase64,
    designType: req.body.designType ?? component.designType,
    pricingType: req.body.pricingType ?? component.pricingType,
  };

  const updated = await Component.findByIdAndUpdate(req.params.id, updates, { new: true });

  res.json({ success: true, data: updated });
});

const deleteComponent = asyncHandler(async (req, res) => {
  const component = await Component.findById(req.params.id);
  if (!component) {
    res.status(404);
    throw new Error("Component not found");
  }

  if (component.createdBy.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("You can only delete your own components");
  }

  await component.deleteOne();

  res.json({
    success: true,
    message: "Component deleted",
  });
});

module.exports = {
  listComponents,
  listMyComponents,
  createComponent,
  getComponent,
  updateComponent,
  deleteComponent,
};
