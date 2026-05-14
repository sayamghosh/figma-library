const crypto = require("crypto");
const { razorpay } = require("../config/razorpay");
const { Plan } = require("../models/Plan");
const { Subscription } = require("../models/Subscription");
const { Transaction } = require("../models/Transaction");
const { User } = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  console.log("[PAYMENT] createOrder - body:", req.body, "user:", req.user);

  if (!razorpay) {
    return res.status(503).json({
      success: false,
      message: "Payment service not configured. Please configure Razorpay API keys.",
    });
  }

  const { planId } = req.body;
  if (!planId) {
    return res.status(400).json({
      success: false,
      message: "Plan ID is required",
    });
  }

  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  let plan;
  try {
    plan = await Plan.findById(planId);
  } catch (err) {
    console.error("[PAYMENT] Plan find error:", err);
    return res.status(400).json({
      success: false,
      message: "Invalid plan ID",
    });
  }
  if (!plan || !plan.isActive) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  const existingSubscription = await Subscription.findOne({
    userId,
    status: "active",
    endDate: { $gt: new Date() },
  });

  if (existingSubscription) {
    return res.status(400).json({
      success: false,
      message: "SUBSCRIPTION_EXISTS",
    });
  }

  const amount = plan.price;

  const order = await razorpay.orders.create({
    amount: amount,
    currency: "INR",
    receipt: `rcpt_${userId.toString().slice(-6)}_${Date.now().toString().slice(-8)}`,
    notes: {
      planId: planId.toString(),
      userId: userId.toString(),
    },
  });

  res.status(200).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: plan._id,
      planName: plan.displayName,
    },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } =
    req.body;
  const userId = req.user.userId;

  const plan = await Plan.findById(planId);
  if (!plan || !plan.isActive) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "INVALID_SIGNATURE",
    });
  }

  const payment = await razorpay.payments.fetch(razorpayPaymentId);

  if (payment.status !== "captured") {
    return res.status(400).json({
      success: false,
      message: "PAYMENT_FAILED",
    });
  }

  const existingTransaction = await Transaction.findOne({
    razorpayPaymentId,
  });

  if (existingTransaction) {
    return res.status(200).json({
      success: true,
      message: "Payment already processed",
      data: existingTransaction,
    });
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const subscription = await Subscription.create({
    userId,
    planId: plan._id,
    razorpayCustomerId: payment.customer_id || null,
    status: "active",
    startDate,
    endDate,
    maxComponents: plan.componentLimit,
    componentCountUsed: 0,
  });

  const transaction = await Transaction.create({
    userId,
    subscriptionId: subscription._id,
    planId: plan._id,
    razorpayPaymentId,
    razorpayOrderId,
    amount: payment.amount,
    currency: payment.currency || "INR",
    status: "captured",
    paymentMethod: payment.method,
    signature: razorpaySignature,
  });

  subscription.transactions.push(transaction._id);
  await subscription.save();

  await User.findByIdAndUpdate(userId, {
    activeSubscription: subscription._id,
    isProUser: true,
  });

  res.status(200).json({
    success: true,
    message: "Payment successful",
    data: {
      subscription,
      transaction,
    },
  });
});

const checkAccess = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).populate("activeSubscription");

  if (!user || !user.isProUser || !user.activeSubscription) {
    return res.status(200).json({
      success: true,
      data: {
        hasAccess: false,
        isProUser: false,
        subscription: null,
      },
    });
  }

  const subscription = user.activeSubscription;

  if (subscription.status !== "active" || new Date(subscription.endDate) < new Date()) {
    await User.findByIdAndUpdate(userId, {
      isProUser: false,
      activeSubscription: null,
    });

    return res.status(200).json({
      success: true,
      data: {
        hasAccess: false,
        isProUser: false,
        subscription: null,
      },
    });
  }

  const remainingComponents = subscription.maxComponents - subscription.componentCountUsed;

  res.status(200).json({
    success: true,
    data: {
      hasAccess: true,
      isProUser: true,
      subscription: {
        status: subscription.status,
        endDate: subscription.endDate,
        maxComponents: subscription.maxComponents,
        componentCountUsed: subscription.componentCountUsed,
        remainingComponents,
      },
    },
  });
});

const webhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook signature",
    });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.captured") {
    const paymentEntity = payload.payment.entity;
    const razorpayPaymentId = paymentEntity.id;

    const existingTransaction = await Transaction.findOne({
      razorpayPaymentId,
    });

    if (existingTransaction) {
      return res.status(200).json({
        success: true,
        message: "Webhook already processed",
      });
    }

    const receipt = paymentEntity.receipt;
    const notes = paymentEntity.notes || {};

    if (notes.planId && notes.userId) {
      const plan = await Plan.findById(notes.planId);
      if (plan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        const subscription = await Subscription.create({
          userId: notes.userId,
          planId: plan._id,
          razorpayCustomerId: paymentEntity.customer_id || null,
          status: "active",
          startDate,
          endDate,
          maxComponents: plan.componentLimit,
          componentCountUsed: 0,
        });

        const transaction = await Transaction.create({
          userId: notes.userId,
          subscriptionId: subscription._id,
          planId: plan._id,
          razorpayPaymentId,
          razorpayOrderId: paymentEntity.order_id,
          amount: paymentEntity.amount,
          currency: paymentEntity.currency || "INR",
          status: "captured",
          paymentMethod: paymentEntity.method,
        });

        subscription.transactions.push(transaction._id);
        await subscription.save();

        await User.findByIdAndUpdate(notes.userId, {
          activeSubscription: subscription._id,
          isProUser: true,
        });
      }
    }
  }

  res.status(200).json({
    success: true,
    message: "Webhook processed",
  });
});

module.exports = {
  createOrder,
  verifyPayment,
  checkAccess,
  webhook,
};