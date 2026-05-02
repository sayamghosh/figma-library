const { asyncHandler } = require("../utils/asyncHandler");
const { Component } = require("../models/Component");
const {
  cacheGet,
  cacheSet,
  cacheInvalidate,
  bumpListVersion,
  getListVersion,
  listKey,
  componentKey,
  myListKey,
  TTL_LIST,
  TTL_SINGLE,
  TTL_MY,
} = require("../utils/cache");

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── GET /api/components ──────────────────────────────────────────────────────
const listComponents = asyncHandler(async (req, res) => {
  const { q = "", tag = "", page = 1, limit = 20, includeData = "false" } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const shouldIncludeData = String(includeData).toLowerCase() === "true";

  // ── Cache read ──────────────────────────────────────────────────────────────
  const version = await getListVersion();
  const cacheKey = await listKey(version, q, tag, pageNumber, perPage, shouldIncludeData);
  const cached = await cacheGet(cacheKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    return res.json(cached);
  }

  // ── MongoDB query ───────────────────────────────────────────────────────────
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

  const responseBody = {
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
  };

  // ── Cache write ─────────────────────────────────────────────────────────────
  await cacheSet(cacheKey, responseBody, TTL_LIST);
  res.set("X-Cache", "MISS");
  res.json(responseBody);
});

// ─── GET /api/components/my ───────────────────────────────────────────────────
const listMyComponents = asyncHandler(async (req, res) => {
  const { q = "", tag = "", page = 1, limit = 20 } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 20, 1), 100);

  // ── Cache read ──────────────────────────────────────────────────────────────
  const version = await getListVersion();
  const cacheKey = await myListKey(version, req.user.userId, q, tag, pageNumber, perPage);
  const cached = await cacheGet(cacheKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    return res.json(cached);
  }

  // ── MongoDB query ───────────────────────────────────────────────────────────
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

  const responseBody = {
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
  };

  // ── Cache write ─────────────────────────────────────────────────────────────
  await cacheSet(cacheKey, responseBody, TTL_MY);
  res.set("X-Cache", "MISS");
  res.json(responseBody);
});

// ─── POST /api/components ─────────────────────────────────────────────────────
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

  // Invalidate all list caches (bump version)
  await bumpListVersion();

  res.status(201).json({
    success: true,
    data: component,
  });
});

// ─── GET /api/components/:id ──────────────────────────────────────────────────
const getComponent = asyncHandler(async (req, res) => {
  const cacheKey = componentKey(req.params.id);

  // ── Cache read ──────────────────────────────────────────────────────────────
  const cached = await cacheGet(cacheKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    return res.json(cached);
  }

  // ── MongoDB query ───────────────────────────────────────────────────────────
  const component = await Component.findById(req.params.id)
    .populate("createdBy", "name email")
    .lean();

  if (!component) {
    res.status(404);
    throw new Error("Component not found");
  }

  const responseBody = { success: true, data: component };

  // ── Cache write ─────────────────────────────────────────────────────────────
  await cacheSet(cacheKey, responseBody, TTL_SINGLE);
  res.set("X-Cache", "MISS");
  res.json(responseBody);
});

// ─── PATCH /api/components/:id ────────────────────────────────────────────────
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

  // Invalidate this component's cache + all list caches
  await Promise.all([
    cacheInvalidate(componentKey(req.params.id)),
    bumpListVersion(),
  ]);

  res.json({ success: true, data: updated });
});

// ─── DELETE /api/components/:id ───────────────────────────────────────────────
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

  // Invalidate this component's cache + all list caches
  await Promise.all([
    cacheInvalidate(componentKey(req.params.id)),
    bumpListVersion(),
  ]);

  res.json({
    success: true,
    message: "Component deleted",
  });
});

// ─── GET /api/components/top-creators ─────────────────────────────────────────
const getTopCreators = asyncHandler(async (req, res) => {
  // Use aggregation to find the top 2 creators based on component count
  const topCreators = await Component.aggregate([
    {
      $group: {
        _id: "$createdBy",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 2,
    },
    {
      $lookup: {
        from: "users", // The users collection name in MongoDB
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: "$user._id",
        name: "$user.name",
        profilePicture: "$user.profilePicture",
        componentCount: "$count",
      },
    },
  ]);

  res.json({
    success: true,
    data: topCreators,
  });
});

module.exports = {
  listComponents,
  listMyComponents,
  createComponent,
  getComponent,
  updateComponent,
  deleteComponent,
  getTopCreators,
};
