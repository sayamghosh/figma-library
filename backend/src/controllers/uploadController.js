const { asyncHandler } = require("../utils/asyncHandler");
const { cloudinary } = require("../config/cloudinary");

const createImageUploadSignature = asyncHandler(async (req, res) => {
  const folder = process.env.CLOUDINARY_FOLDER || "figma-components";
  const timestamp = Math.round(Date.now() / 1000);
  const publicIdPrefix = req.user?.userId ? `${req.user.userId}_` : "anon_";
  const public_id = `${publicIdPrefix}${Date.now()}`;

  const paramsToSign = {
    folder,
    timestamp,
    public_id,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    success: true,
    data: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      timestamp,
      public_id,
      signature,
    },
  });
});

module.exports = { createImageUploadSignature };
