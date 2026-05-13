const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/.env' });
const User = require('./models/User');

async function updateAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@rizqara.com';
    const password = 'rizqara878';
    const name = 'Admin';
    const role = 'admin';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email });
    if (user) {
      user.password = hashedPassword;
      user.name = name;
      user.role = role;
      await user.save();
      console.log(`✅ Updated existing admin user: ${email}`);
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role
      });
      await user.save();
      console.log(`✅ Created new admin user: ${email}`);
    }

    console.log('🎉 Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAdmin();
