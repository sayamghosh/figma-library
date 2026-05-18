const express = require("express");
const {
  listComponents,
  listMyComponents,
  createComponent,
  getComponent,
  getComponentData,
  updateComponent,
  deleteComponent,
} = require("../controllers/componentController");
const { protect, optionalProtect } = require("../middleware/auth");

const router = express.Router();

router.get("/", listComponents);
router.get("/admin", protect, require("../controllers/componentController").listComponentsAdmin);
router.get("/my", protect, listMyComponents);
router.get("/top-creators", require("../controllers/componentController").getTopCreators);
router.get("/:id", getComponent);
router.get("/:id/data", optionalProtect, getComponentData);
router.post("/", protect, createComponent);
router.patch("/:id", protect, updateComponent);
router.patch("/:id/status", protect, require("../controllers/componentController").updateComponentStatus);
router.delete("/:id", protect, deleteComponent);

module.exports = router;
