const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  countryFlag: { type: String },
  university: { type: String },
  degree: [{ type: String }],
  fundingType: { type: String, enum: ['Fully Funded', 'Partially Funded', 'Self-Funded'] },
  scholarshipType: { type: String, enum: ['Government', 'University', 'Private', 'Exchange'] },
  ieltsRequired: { type: Boolean, default: false },
  moiAccepted: { type: Boolean, default: false },
  deadline: { type: String },
  intake: { type: String },
  applicationFee: { type: String },
  tuitionFee: { type: String },
  livingCost: { type: String },
  status: { type: String, enum: ['Open', 'Closing Soon', 'Upcoming', 'Closed'] },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Competitive', 'Highly Competitive'] },
  description: { type: String },
  benefits: [{ type: String }],
  eligibility: [{ type: String }],
  requiredDocuments: [{ type: String }],
  applicationSteps: [{ type: String }],
  subjects: [{ type: String }],
  officialLink: { type: String },
  image: { type: String },
  matchScore: { type: Number },
  tags: [{ type: String }],
  stipend: { type: String },
  accommodation: { type: Boolean, default: false },
  healthInsurance: { type: Boolean, default: false },
  airTicket: { type: Boolean, default: false },
  language: { type: String },
  isVerified: { type: Boolean, default: false },
  rizqaraNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
