const express = require("express");
const router = express.Router();
const {
  getCurrentSubscription,
  getSubscriptionHistory,
  cancelSubscription,
  useComponent,
} = require("../controllers/subscriptionController");
const { protect } = require("../middleware/auth");

router.get("/current", protect, getCurrentSubscription);
router.get("/history", protect, getSubscriptionHistory);
router.post("/cancel", protect, cancelSubscription);
router.post("/use-component", protect, useComponent);

module.exports = router;