const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Related recycling request
  recyclingRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'RecyclingRequest'
  },
  
  // Recycler who needs to pay commission
  recyclerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  
  // Transaction amounts
  orderAmount: {
    type: Number,
    required: true,
    min: 0
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 8, // 8%
    min: 0,
    max: 100
  },
  commissionAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Transaction status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'confirmed', 'disputed'],
    default: 'pending'
  },
  
  // Payment details
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'other']
  },
  paymentReference: {
    type: String,
    trim: true
  },
  paymentDate: {
    type: Date
  },
  
  // Admin confirmation
  confirmedBy: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and string for admin
    ref: 'User'
  },
  confirmedAt: {
    type: Date
  },
  adminNotes: {
    type: String,
    trim: true
  },
  
  // Automatic generation details
  generatedAt: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: function() {
      // Due in 7 days from generation
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  },
  
  // Product details for reference
  productDetails: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

// Calculate commission amount before saving
transactionSchema.pre('save', function(next) {
  if (this.orderAmount && this.commissionRate) {
    this.commissionAmount = (this.orderAmount * this.commissionRate) / 100;
  }
  next();
});

// Index for efficient queries
transactionSchema.index({ recyclerId: 1, status: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);