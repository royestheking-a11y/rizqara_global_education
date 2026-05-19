const mongoose = require('mongoose');

const manualApplicationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  applications: [
    {
      scholarship: { 
        type: String, 
        required: true 
      },
      country: { 
        type: String, 
        required: true 
      },
      notes: { 
        type: String 
      },
      status: {
        type: String,
        enum: ["Pending", "Processing", "Submitted", "Completed", "Rejected"],
        default: "Pending"
      },
      payment: {
        amount: { 
          type: Number, 
          default: 0 
        },
        method: { 
          type: String, 
          enum: ['BKash', 'Nagad', 'Rocket', 'Bank Transfer', 'WhatsApp Manual', 'Cash'],
          default: 'WhatsApp Manual' 
        },
        status: {
          type: String,
          enum: ["Unpaid", "Pending", "Completed"],
          default: "Unpaid"
        },
        date: { 
          type: Date, 
          default: Date.now 
        }
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ManualApplication', manualApplicationSchema);
