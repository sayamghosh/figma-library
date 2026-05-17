const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  checkAccess,
  webhook,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/check-access", protect, checkAccess);
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

module.exports = router;