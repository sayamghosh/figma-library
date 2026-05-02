const bcrypt = require("bcryptjs");
const { asyncHandler } = require("../utils/asyncHandler");
const { createAccessToken } = require("../utils/token");
const { User } = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  const token = createAccessToken({ userId: user._id.toString(), email: user.email });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = createAccessToken({ userId: user._id.toString(), email: user.email });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    },
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("name email profilePicture createdAt updatedAt");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: user,
  });
});

const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error("No ID token provided");
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const { sub: googleId, email, name, picture } = payload;
  const lowercaseEmail = email.toLowerCase().trim();

  let user = await User.findOne({ email: lowercaseEmail });
  
  if (user) {
    // If user exists but used local auth, we can just link accounts or log them in.
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }
      await user.save();
    }
  } else {
    // Create new Google user
    user = await User.create({
      name: name,
      email: lowercaseEmail,
      googleId: googleId,
      authProvider: "google",
      profilePicture: picture || "",
      // Optional password could be left empty or undefined since it's not required for 'google' auth provider
    });
  }

  const token = createAccessToken({ userId: user._id.toString(), email: user.email });

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    },
  });
});

module.exports = { register, login, me, googleAuth };
