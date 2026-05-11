const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const componentSchema = new mongoose.Schema({
  name: String,
  status: String,
  designType: String,
  pricingType: String
});
const Component = mongoose.models.Component || mongoose.model("Component", componentSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const all = await Component.find({});
  console.log(`Total components in DB: ${all.length}`);
  console.log("Samples:", all.slice(0, 3).map(c => ({ name: c.name, status: c.status, designType: c.designType })));

  const query = { status: "approved" };
  query.$and = [
    { $or: [{ designType: "UI Design" }, { designType: { $exists: false } }, { designType: null }] },
  ];
  const uiDesign = await Component.find(query);
  console.log(`UI Design approved components: ${uiDesign.length}`);

  const wireframe = await Component.find({ status: "approved", designType: "Wireframe" });
  console.log(`Wireframe approved components: ${wireframe.length}`);

  process.exit(0);
}
check();
