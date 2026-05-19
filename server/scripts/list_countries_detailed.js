const mongoose = require('mongoose');
require('dotenv').config({ path: '/Users/mdsunny/Downloads/Rizqara Global Education/server/.env' });
const Country = require('../models/Country');

const listCountries = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', mongoose.connection.name);
    
    const countries = await Country.find({});
    for (const c of countries) {
      console.log(`- ID: ${c._id}, Name: "${c.name}", Slug: "${c.slug}", Image: "${c.image}"`);
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listCountries();
