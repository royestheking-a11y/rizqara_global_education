const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  country: { type: String },
  educationLevel: { type: String },
  gpa: { type: String },
  targetDegree: { type: String },
  targetCountry: { type: String },
  targetSubject: { type: String },
  ieltsStatus: { type: String },
  budget: { type: String },
  passportStatus: { type: String },
  preferredIntake: { type: String },
  profileCompletion: { type: Number, default: 0 },
  profileImage: { type: String },
  savedScholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }],
  documents: {
    type: Map,
    of: String,
    default: {}
  },
  payments: [{
    id: String,
    date: String,
    type: String,
    amount: String,
    status: String,
    method: String
  }],
  notifications: [{
    id: String,
    title: String,
    message: String,
    date: String,
    type: String,
    isRead: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
