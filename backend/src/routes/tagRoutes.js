const express = require("express");
const {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  reorderTags,
} = require("../controllers/tagController");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

// Public route to get tags (ordered)
router.get("/", getTags);

// Admin only routes
router.use(protect);
router.use(restrictTo("admin"));

router.post("/", createTag);
router.put("/reorder", reorderTags);
router.route("/:id").put(updateTag).delete(deleteTag);

module.exports = router;
