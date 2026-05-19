/**
 * fix-country-images.js
 * Run once: node server/fix-country-images.js
 * Patches Spain, Canada, Singapore with working image URLs.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Country = require('./models/Country');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/rizqara';

const fixes = [
  {
    name: 'Canada',
    image: 'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Spain',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80'
  }
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  for (const fix of fixes) {
    const result = await Country.findOneAndUpdate(
      { name: fix.name },
      { $set: { image: fix.image } },
      { new: true }
    );
    if (result) {
      console.log(`✅ ${fix.name} image updated`);
    } else {
      console.log(`⚠️  ${fix.name} not found in DB`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => { console.error(err); process.exit(1); });
