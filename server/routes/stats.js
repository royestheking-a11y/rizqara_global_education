const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Scholarship = require('../models/Scholarship');
const Lead = require('../models/Lead');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const Analytics = require('../models/Analytics');
const ManualApplication = require('../models/ManualApplication');

// Increment Page Views
router.post('/view', async (req, res) => {
  try {
    const updated = await Analytics.findOneAndUpdate(
      { metric: 'pageViews' },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );
    res.json({ success: true, value: updated.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment WhatsApp Clicks
router.post('/whatsapp-click', async (req, res) => {
  try {
    const updated = await Analytics.findOneAndUpdate(
      { metric: 'whatsappClicks' },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );
    res.json({ success: true, value: updated.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const scholarshipCount = await Scholarship.countDocuments();
    const leadCount = await Lead.countDocuments({ unread: true });
    
    // Real applications count
    const normalAppsCount = await Application.countDocuments();
    
    // Manual applications count and payment calculations
    const manualRecords = await ManualApplication.find({});
    let totalManualApps = 0;
    let manualRevenue = 0;
    let manualRevenueBDT = 0;
    
    manualRecords.forEach(student => {
      if (student.applications && Array.isArray(student.applications)) {
        student.applications.forEach(app => {
          totalManualApps++;
          if (app.payment && app.payment.status === 'Completed') {
            const currency = app.payment.currency || 'USD';
            if (currency === 'BDT') {
              manualRevenueBDT += (app.payment.amount || 0);
            } else {
              manualRevenue += (app.payment.amount || 0);
            }
          }
        });
      }
    });

    const totalApplications = normalAppsCount + totalManualApps;
    
    // Pending Documents calculation
    const pendingDocsCount = await Application.countDocuments({
      status: { $in: ["Document Checking", "Missing Documents"] }
    });

    // Total Revenue calculation
    const acceptedPayments = await Payment.find({ status: 'accepted' });
    let normalRevenue = 0;
    let normalRevenueBDT = 0;
    
    acceptedPayments.forEach(p => {
      const currency = p.currency || 'USD';
      if (currency === 'BDT') {
        normalRevenueBDT += (p.amount || 0);
      } else {
        normalRevenue += (p.amount || 0);
      }
    });
    
    const totalRevenueSum = normalRevenue + manualRevenue;
    const totalRevenueSumBDT = normalRevenueBDT + manualRevenueBDT;
    let formattedRevenue = "";
    if (totalRevenueSum > 0 && totalRevenueSumBDT > 0) {
      formattedRevenue = `$${totalRevenueSum.toLocaleString()} / ৳${totalRevenueSumBDT.toLocaleString()}`;
    } else if (totalRevenueSumBDT > 0) {
      formattedRevenue = `৳${totalRevenueSumBDT.toLocaleString()}`;
    } else {
      formattedRevenue = `$${totalRevenueSum.toLocaleString()}`;
    }

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

    // Fetch dynamic analytics page views and WhatsApp clicks
    const pageViewsDoc = await Analytics.findOne({ metric: 'pageViews' });
    const whatsappClicksDoc = await Analytics.findOne({ metric: 'whatsappClicks' });
    const pageViews = pageViewsDoc ? pageViewsDoc.value : 0;
    const whatsappClicks = whatsappClicksDoc ? whatsappClicksDoc.value : 0;

    res.json({
      totalStudents: studentCount,
      activeApplications: totalApplications,
      openScholarships: scholarshipCount,
      newLeads: leadCount,
      pendingDocuments: pendingDocsCount,
      totalRevenue: formattedRevenue,
      
      manualApplicationsCount: totalManualApps,
      manualRevenue: manualRevenue,
      manualRevenueBDT: manualRevenueBDT,
      normalApplicationsCount: normalAppsCount,
      normalRevenue: normalRevenue,
      normalRevenueBDT: normalRevenueBDT,

      pageViews: pageViews, 
      profileChecks: totalLeads,
      whatsappClicks: whatsappClicks, 
      applicationsStarted: totalApplications,
      topCountries: topCountries
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
