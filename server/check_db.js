const mongoose = require('mongoose');
require('dotenv').config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', mongoose.connection.name);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const Country = mongoose.model('Country', new mongoose.Schema({ name: String }), 'countries');
    const count = await Country.countDocuments();
    console.log('Country count:', count);
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
