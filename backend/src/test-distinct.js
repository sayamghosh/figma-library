require('dotenv').config({path: '../.env'});
require('./config/database').connectDatabase().then(async () => {
  const { Component } = require('./models/Component');
  const query = { $or: [{ status: 'approved' }, { status: { $exists: false } }, { status: null }] };
  const tags = await Component.distinct('tags', query);
  console.log('Distinct tags:', tags);
  process.exit(0);
});
