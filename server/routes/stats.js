const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Scholarship = require('../models/Scholarship');
const Lead = require('../models/Lead');
const Application = require('../models/Application');
const Payment = require('../models/Payment');

router.get('/', async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const scholarshipCount = await Scholarship.countDocuments();
    const leadCount = await Lead.countDocuments({ unread: true });
    
    // Real applications count
    const totalApplications = await Application.countDocuments();
    
    // Pending Documents calculation
    const pendingDocsCount = await Application.countDocuments({
      status: { $in: ["Document Checking", "Missing Documents"] }
    });

    // Total Revenue calculation
    const acceptedPayments = await Payment.find({ status: 'accepted' });
    const totalRevenueSum = acceptedPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    // Format to currency-like string if needed, else raw number
    const formattedRevenue = totalRevenueSum > 0 ? `৳ ${totalRevenueSum.toLocaleString()}` : "৳ 0";

    // For analytics page
    const totalLeads = await Lead.countDocuments();

    // Top Countries from Leads
    const topCountriesAgg = await Lead.aggregate([
      { $match: { targetCountry: { $exists: true, $ne: "" } } },
      { $group: { _id: "$targetCountry", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const topCountries = topCountriesAgg.map(c => ({
      country: c._id,
      percent: Math.round((c.count / (totalLeads || 1)) * 100) || 1,
      count: c.count
    }));

    res.json({
      totalStudents: studentCount,
      activeApplications: totalApplications,
      openScholarships: scholarshipCount,
      newLeads: leadCount,
      pendingDocuments: pendingDocsCount,
      totalRevenue: formattedRevenue,
      
      // Untracked metrics set to 0 instead of fake data
      pageViews: 0, 
      profileChecks: totalLeads,
      whatsappClicks: 0, 
      applicationsStarted: totalApplications,
      topCountries: topCountries
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
