const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USD', 'BDT'],
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['Stripe', 'PayPal', 'Wise', 'Card Payment', 'Bank Transfer', 'BKash', 'Nagad', 'Rocket'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  purpose: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
