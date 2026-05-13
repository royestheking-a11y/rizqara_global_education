const mongoose = require('mongoose');
require('dotenv').config();

const searchBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const blogs = await db.collection('blogposts').find({ 
      $or: [
        { title: /Visa/i },
        { category: /Visa/i },
        { title: /Interview/i }
      ]
    }).toArray();
    console.log(JSON.stringify(blogs, null, 2));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

searchBlogs();
