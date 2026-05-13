const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Scholarship = require('../models/Scholarship');
const Lead = require('../models/Lead');

router.get('/', async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const scholarshipCount = await Scholarship.countDocuments();
    const leadCount = await Lead.countDocuments({ unread: true });
    
    // Mock values for things we don't have models for yet
    res.json({
      totalStudents: studentCount,
      activeApplications: Math.floor(studentCount * 0.4), // 40% active for demo
      openScholarships: scholarshipCount,
      newLeads: leadCount,
      pendingDocuments: 12,
      totalRevenue: "4.2L"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
