const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  status: { 
    type: String, 
    enum: ["Profile Received", "Document Checking", "Missing Documents", "SOP/CV Preparing", "Application Form Started", "Submitted", "Waiting for Result", "Interview Stage", "Visa Guidance", "Completed", "Rejected"],
    default: "Profile Received"
  },
  progress: { type: Number, default: 10 },
  advisor: { type: String, default: "Team A" },
  lastUpdate: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
