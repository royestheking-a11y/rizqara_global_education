const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/.env' });
const User = require('./models/User');

async function addStudent() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const salt = await bcrypt.genSalt(10);
        const studentPassword = await bcrypt.hash('student123', salt);
        await User.findOneAndUpdate(
            { email: 'student@rizqara.com' },
            { 
                name: 'Student Demo',
                password: studentPassword,
                role: 'student',
                educationLevel: 'HSC',
                gpa: '5.00',
                targetCountry: 'Japan',
                ieltsStatus: 'Not Yet'
            },
            { upsert: true, new: true }
        );
        console.log('Student user updated/created: student@rizqara.com / student123');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

addStudent();
