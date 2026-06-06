const { Subscription } = require("../models/Subscription");
const { Transaction } = require("../models/Transaction");
const { Plan } = require("../models/Plan");
const { User } = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { autoActivateNextQueued } = require("./paymentController");

const getCurrentSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  await autoActivateNextQueued(userId);

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

  await autoActivateNextQueued(userId);

  res.status(200).json({
    success: true,
    message: "Subscription cancelled successfully",
  });
});

const activateQueuedSubscription = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const subscription = await Subscription.findById(id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  if (subscription.userId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to activate this subscription",
    });
  }

  if (subscription.status !== "queued") {
    return res.status(400).json({
      success: false,
      message: "Only queued subscriptions can be activated",
    });
  }

  const currentActive = await Subscription.findOne({
    userId,
    status: "active",
    endDate: { $gt: new Date() },
  }).populate("planId");

  if (currentActive) {
    const activePlan = currentActive.planId;
    if (activePlan && activePlan.isPremiumPlus) {
      return res.status(403).json({
        success: false,
        message: "Cannot activate another plan while Premium+ is your active plan",
      });
    }

    currentActive.status = "cancelled";
    await currentActive.save();
  }

  const plan = await Plan.findById(subscription.planId);
  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Associated plan not found",
    });
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

  subscription.status = "active";
  subscription.startDate = startDate;
  subscription.endDate = endDate;
  subscription.componentCountUsed = 0;
  await subscription.save();

  await User.findByIdAndUpdate(userId, {
    activeSubscription: subscription._id,
    isProUser: true,
  });

  res.status(200).json({
    success: true,
    message: "Subscription activated successfully",
    data: {
      subscription,
    },
  });
});

const useComponent = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  await autoActivateNextQueued(userId);

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

    await autoActivateNextQueued(userId);

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
  activateQueuedSubscription,
  useComponent,
};
