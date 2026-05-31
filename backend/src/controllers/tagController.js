const { asyncHandler } = require("../utils/asyncHandler");
const { Tag } = require("../models/Tag");
const { Component } = require("../models/Component");

async function syncComponentTagOrders() {
  const components = await Component.find({});
  const tags = await Tag.find({});
  const tagOrderMap = {};
  tags.forEach(t => { tagOrderMap[t.name] = t.order; });
  
  const compUpdates = components.map(c => {
    let minOrder = 999999;
    if (c.tags && c.tags.length > 0) {
      c.tags.forEach(tName => {
        if (tagOrderMap[tName] && tagOrderMap[tName] < minOrder) {
          minOrder = tagOrderMap[tName];
        }
      });
    }
    return {
      updateOne: {
        filter: { _id: c._id },
        update: { $set: { tagOrder: minOrder } }
      }
    };
  });
  if (compUpdates.length > 0) {
    await Component.bulkWrite(compUpdates);
  }
}

// ─── GET /api/tags ─────────────────────────────────────────────────────────────
const getTags = asyncHandler(async (req, res) => {
  const tagCount = await Tag.countDocuments();
  if (tagCount === 0) {
    const query = { $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }] };
    const distinctTags = await Component.distinct("tags", query);
    const formattedTags = distinctTags
      .map(t => t ? t.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "")
      .filter(t => t.length > 0);
    const uniqueTags = Array.from(new Set(formattedTags)).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    
    if (uniqueTags.length > 0) {
      await Tag.insertMany(uniqueTags.map((name, i) => ({ name, order: i + 1 })));
      await syncComponentTagOrders();
    }
  }

  const tags = await Tag.find({}).sort({ order: 1, createdAt: 1 });
  res.json({
    success: true,
    data: tags,
  });
});

// ─── POST /api/tags ────────────────────────────────────────────────────────────
const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Tag name is required");
  }

  // Get current highest order to append at the end
  const lastTag = await Tag.findOne({}).sort({ order: -1 });
  const newOrder = lastTag ? lastTag.order + 1 : 1;

  const tag = await Tag.create({ name, order: newOrder });
  await syncComponentTagOrders();

  res.status(201).json({
    success: true,
    data: tag,
  });
});

// ─── PUT /api/tags/:id ─────────────────────────────────────────────────────────
const updateTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    res.status(404);
    throw new Error("Tag not found");
  }

  if (name) {
    tag.name = name;
  }

  await tag.save();
  await syncComponentTagOrders();

  res.json({
    success: true,
    data: tag,
  });
});

// ─── DELETE /api/tags/:id ──────────────────────────────────────────────────────
const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    res.status(404);
    throw new Error("Tag not found");
  }

  await tag.deleteOne();
  await syncComponentTagOrders();

  res.json({
    success: true,
    message: "Tag deleted successfully",
  });
});

// ─── PUT /api/tags/reorder ─────────────────────────────────────────────────────
const reorderTags = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    res.status(400);
    throw new Error("orderedIds must be an array of tag IDs");
  }

  // Update order in bulk
  const updates = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index + 1 } },
    },
  }));

  if (updates.length > 0) {
    await Tag.bulkWrite(updates);
    await syncComponentTagOrders();
  }

  const tags = await Tag.find({}).sort({ order: 1 });

  res.json({
    success: true,
    data: tags,
  });
});

module.exports = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  reorderTags,
};
