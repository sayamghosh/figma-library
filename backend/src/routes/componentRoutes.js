const express = require("express");
const {
  listComponents,
  listMyComponents,
  createComponent,
  getComponent,
  updateComponent,
  deleteComponent,
} = require("../controllers/componentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", listComponents);
router.get("/my", protect, listMyComponents);
router.get("/top-creators", require("../controllers/componentController").getTopCreators);
router.get("/:id", getComponent);
router.post("/", protect, createComponent);
router.patch("/:id", protect, updateComponent);
router.delete("/:id", protect, deleteComponent);

module.exports = router;
