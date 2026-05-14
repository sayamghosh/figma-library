const express = require("express");
const router = express.Router();
const {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/planController");
const { protect } = require("../middleware/auth");

router.get("/", getAllPlans);
router.get("/:id", getPlanById);

router.post("/", protect, createPlan);
router.put("/:id", protect, updatePlan);
router.delete("/:id", protect, deletePlan);

module.exports = router;