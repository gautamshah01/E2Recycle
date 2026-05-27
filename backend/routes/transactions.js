const express = require('express');
const Transaction = require('../models/Transaction');
const RecyclingRequest = require('../models/RecyclingRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Get recycler's pending commission payments
router.get('/recycler/pending', auth, async (req, res) => {
  try {
    const recyclerId = req.user.id;

    const pendingTransactions = await Transaction.find({
      recyclerId,
      status: { $in: ['pending', 'paid'] }
    })
    .populate('recyclingRequestId', 'productName productType quantity uniqueCode')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions: pendingTransactions
    });
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions',
      error: error.message
    });
  }
});

// Get admin bank details for payment
router.get('/admin/bank-details', auth, async (req, res) => {
  try {
    const bankDetails = {
      bankName: process.env.ADMIN_BANK_NAME,
      accountNumber: process.env.ADMIN_ACCOUNT_NUMBER,
      ifscCode: process.env.ADMIN_IFSC_CODE,
      accountHolder: process.env.ADMIN_ACCOUNT_HOLDER,
      upiId: process.env.ADMIN_UPI_ID,
      contactEmail: process.env.ADMIN_CONTACT_EMAIL
    };

    res.json({
      success: true,
      bankDetails
    });
  } catch (error) {
    console.error('Error fetching bank details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bank details',
      error: error.message
    });
  }
});

// Submit commission payment (by recycler)
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentReference } = req.body;
    const recyclerId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: id,
      recyclerId,
      status: 'pending'
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or already processed'
      });
    }

    // Update transaction status to paid
    transaction.status = 'paid';
    transaction.paymentMethod = paymentMethod;
    transaction.paymentReference = paymentReference;
    transaction.paymentDate = new Date();

    await transaction.save();

    res.json({
      success: true,
      message: 'Payment submitted successfully. Waiting for admin confirmation.',
      transaction
    });
  } catch (error) {
    console.error('Error submitting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting payment',
      error: error.message
    });
  }
});

// Get all transactions for admin
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { status } = req.query;
    
    // For now, allow any authenticated user to view transactions (in production, add admin check)
    console.log('Admin transaction request from user:', req.user.id);
    
    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const transactions = await Transaction.find(filter)
      .populate('recyclerId', 'companyName email phone')
      .populate('recyclingRequestId', 'productName productType quantity uniqueCode')
      .sort({ createdAt: -1 });

    console.log(`Found ${transactions.length} transactions`);

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions',
      error: error.message
    });
  }
});

// Confirm commission payment (by admin)
router.put('/:id/confirm', auth, async (req, res) => {
  try {
    console.log('Admin confirm request received:');
    console.log('Transaction ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Admin user:', req.user);
    
    const { id } = req.params;
    const { confirmed, adminNotes } = req.body;
    const adminId = req.user.id;

    const transaction = await Transaction.findOne({
      _id: id,
      status: 'paid'
    });

    console.log('Transaction found:', transaction);

    if (!transaction) {
      console.log('Transaction not found or not in paid status');
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or not ready for confirmation'
      });
    }

    if (confirmed) {
      transaction.status = 'confirmed';
      // Handle admin ID - if it's "admin" string, store it as is, otherwise as ObjectId
      if (adminId === 'admin') {
        transaction.confirmedBy = 'admin';
      } else {
        transaction.confirmedBy = adminId;
      }
      transaction.confirmedAt = new Date();
    } else {
      transaction.status = 'disputed';
    }
    
    if (adminNotes) {
      transaction.adminNotes = adminNotes;
    }

    await transaction.save();
    console.log('Transaction updated successfully');

    res.json({
      success: true,
      message: confirmed ? 'Payment confirmed successfully' : 'Payment marked as disputed',
      transaction
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming payment',
      error: error.message
    });
  }
});

// Check if recycler can receive new appointments
router.get('/recycler/can-receive-appointments', auth, async (req, res) => {
  try {
    const recyclerId = req.user.id;

    // Check for pending commission payments
    const pendingPayments = await Transaction.countDocuments({
      recyclerId,
      status: { $in: ['pending', 'paid'] }
    });

    res.json({
      success: true,
      canReceiveAppointments: pendingPayments === 0,
      pendingPayments,
      message: pendingPayments > 0 
        ? 'You have pending commission payments. Please complete payments to receive new appointments.'
        : 'You can receive new appointments.'
    });
  } catch (error) {
    console.error('Error checking appointment eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking eligibility',
      error: error.message
    });
  }
});

module.exports = router;