const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createContactMessage,
  listMyContactMessages,
} = require("../controllers/contactController");

const router = express.Router();

router.get("/mine", protect, listMyContactMessages);
router.post("/", protect, createContactMessage);

module.exports = router;
