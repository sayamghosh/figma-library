require("dotenv").config();
const { connectDatabase } = require("../config/database");
const { Plan } = require("../models/Plan");

const seedPlans = async () => {
  await connectDatabase();

  const plans = [
    {
      name: "pro_starter",
      displayName: "Pro Starter",
      description: "Access 100 premium components",
      price: 9900,
      durationDays: 180,
      componentLimit: 100,
      features: ["100 Components", "180 Days Access", "Email Support"],
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "pro_ultimate",
      displayName: "Pro Ultimate",
      description: "Access 250 premium components",
      price: 19900,
      durationDays: 180,
      componentLimit: 250,
      features: [
        "250 Components",
        "180 Days Access",
        "Priority Support",
        "New Components Included",
      ],
      sortOrder: 2,
      isActive: true,
    },
  ];

  for (const planData of plans) {
    const existingPlan = await Plan.findOne({ name: planData.name });
    if (!existingPlan) {
      await Plan.create(planData);
      console.log(`Created plan: ${planData.displayName}`);
    } else {
      console.log(`Plan already exists: ${planData.displayName}`);
    }
  }

  console.log("Seed completed!");
  process.exit(0);
};

seedPlans().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});