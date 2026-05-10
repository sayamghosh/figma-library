const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Component = require('./src/models/Component').Component;

  const query = { status: "approved" };
  query.$and = [
    { $or: [{ designType: "UI Design" }, { designType: { $exists: false } }, { designType: null }] },
  ];

  console.log("Query:", JSON.stringify(query, null, 2));

  const items = await Component.find(query);
  console.log("Count with UI Design logic:", items.length);

  const all = await Component.find({ status: 'approved' });
  console.log("Count all approved:", all.length);

  mongoose.disconnect();
});
