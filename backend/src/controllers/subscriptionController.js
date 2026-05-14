const { Subscription } = require("../models/Subscription");
const { Transaction } = require("../models/Transaction");
const { User } = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

const getCurrentSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).populate({
    path: "activeSubscription",
    populate: {
      path: "planId",
    },
  });

  if (!user || !user.activeSubscription) {
    return res.status(200).json({
      success: true,
      data: null,
    });
  }

  const subscription = user.activeSubscription;
  const remainingComponents = subscription.maxComponents - subscription.componentCountUsed;

  res.status(200).json({
    success: true,
    data: {
      plan: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      maxComponents: subscription.maxComponents,
      componentCountUsed: subscription.componentCountUsed,
      remainingComponents,
    },
  });
});

const getSubscriptionHistory = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const subscriptions = await Subscription.find({ userId })
    .populate("planId")
    .populate("transactions")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: subscriptions,
  });
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);

  if (!user || !user.activeSubscription) {
    return res.status(404).json({
      success: false,
      message: "No active subscription found",
    });
  }

  const subscription = await Subscription.findById(user.activeSubscription);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  subscription.status = "cancelled";
  await subscription.save();

  user.isProUser = false;
  user.activeSubscription = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Subscription cancelled successfully",
  });
});

const useComponent = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);

  if (!user || !user.activeSubscription) {
    return res.status(403).json({
      success: false,
      message: "No active subscription",
    });
  }

  const subscription = await Subscription.findById(user.activeSubscription);

  if (!subscription || subscription.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Subscription not active",
    });
  }

  if (new Date(subscription.endDate) < new Date()) {
    subscription.status = "expired";
    await subscription.save();

    user.isProUser = false;
    user.activeSubscription = null;
    await user.save();

    return res.status(403).json({
      success: false,
      message: "Subscription expired",
    });
  }

  if (subscription.componentCountUsed >= subscription.maxComponents) {
    return res.status(403).json({
      success: false,
      message: "COMPONENT_LIMIT_REACHED",
    });
  }

  subscription.componentCountUsed += 1;
  await subscription.save();

  res.status(200).json({
    success: true,
    message: "Component access granted",
    data: {
      remainingComponents: subscription.maxComponents - subscription.componentCountUsed,
    },
  });
});

module.exports = {
  getCurrentSubscription,
  getSubscriptionHistory,
  cancelSubscription,
  useComponent,
};