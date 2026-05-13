require('dotenv').config();
const mongoose = require('mongoose');
const Scholarship = require('../models/Scholarship');
const Country = require('../models/Country');
const Service = require('../models/Service');
const BlogPost = require('../models/BlogPost');
const slugify = require('../utils/slugify');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rizqaraglobaleducation_db_user:EyMtkwC4gDpkwYt5@cluster0.z6hz5ve.mongodb.net/rizqara?appName=Cluster0";

async function populateSlugs() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const models = [
      { model: Scholarship, nameField: 'name' },
      { model: Country, nameField: 'name' },
      { model: Service, nameField: 'title' },
      { model: BlogPost, nameField: 'title' }
    ];

    for (const { model, nameField } of models) {
      const items = await model.find({ slug: { $exists: false } });
      console.log(`Found ${items.length} ${model.modelName} items without slug`);
      
      for (const item of items) {
        item.slug = slugify(item[nameField]);
        await item.save();
        console.log(`Updated ${model.modelName}: ${item[nameField]} -> ${item.slug}`);
      }

      // Also check for empty slugs
      const emptyItems = await model.find({ slug: '' });
      console.log(`Found ${emptyItems.length} ${model.modelName} items with empty slug`);
      for (const item of emptyItems) {
        item.slug = slugify(item[nameField]);
        await item.save();
        console.log(`Updated ${model.modelName}: ${item[nameField]} -> ${item.slug}`);
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

populateSlugs();
