const express = require("express");
const { createImageUploadSignature } = require("../controllers/uploadController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/signature", protect, createImageUploadSignature);

module.exports = router;
