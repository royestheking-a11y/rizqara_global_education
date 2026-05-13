const mongoose = require('mongoose');
require('dotenv').config();

const checkServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const services = await db.collection('services').find({}).toArray();
    console.log(JSON.stringify(services, null, 2));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkServices();
