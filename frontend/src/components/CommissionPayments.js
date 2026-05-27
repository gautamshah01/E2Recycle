import React, { useState, useEffect } from 'react';

const CommissionPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'bank_transfer',
    paymentReference: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPendingTransactions();
    loadBankDetails();
  }, []);

  const loadPendingTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/recycler/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setError('Failed to load commission payments');
    } finally {
      setLoading(false);
    }
  };

  const loadBankDetails = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/admin/bank-details', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bank details');
      }

      const data = await response.json();
      setBankDetails(data.bankDetails);
    } catch (error) {
      console.error('Error loading bank details:', error);
      setError('Failed to load payment details');
    }
  };

  const openPaymentModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentModal(true);
    setPaymentData({
      paymentMethod: 'bank_transfer',
      paymentReference: ''
    });
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedTransaction(null);
    setPaymentData({
      paymentMethod: 'bank_transfer',
      paymentReference: ''
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentData.paymentReference.trim()) {
      alert('Please enter payment reference/transaction ID');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${selectedTransaction._id}/pay`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit payment');
      }

      alert('Payment submitted successfully! Waiting for admin confirmation.');
      closePaymentModal();
      loadPendingTransactions();
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to submit payment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Commission Payments</h2>
        <button
          onClick={loadPendingTransactions}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl text-gray-400">💰</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Payments</h3>
          <p className="text-gray-500">You don't have any pending commission payments at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Commission Payment Required
                  </h3>
                  <p className="text-sm text-gray-500">
                    Order completed on {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Product:</span> {transaction.productDetails?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {transaction.productDetails?.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {transaction.productDetails?.quantity}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order Amount:</span> ₹{transaction.orderAmount}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Commission Rate:</span> {transaction.commissionRate}%
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    <span className="font-medium">Commission Due:</span> ₹{transaction.commissionAmount}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Due Date</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(transaction.dueDate)}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Payment required to receive new appointments
                  </p>
                </div>
              </div>

              {transaction.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => openPaymentModal(transaction)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Send Money to Admin
                  </button>
                </div>
              )}

              {transaction.status === 'paid' && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-800">
                    <strong>Payment Submitted:</strong> Waiting for admin confirmation.
                    {transaction.paymentReference && (
                      <span className="block text-sm mt-1">
                        Reference: {transaction.paymentReference}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {transaction.status === 'disputed' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-800">
                    <strong>Payment Disputed:</strong> Please contact admin at{' '}
                    <a href={`mailto:${bankDetails?.contactEmail}`} className="underline">
                      {bankDetails?.contactEmail}
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedTransaction && bankDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Send Commission Payment</h3>
                <button
                  onClick={closePaymentModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Payment Amount */}
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Amount to Pay</h4>
                  <p className="text-2xl font-bold text-red-700">
                    ₹{selectedTransaction.commissionAmount}
                  </p>
                  <p className="text-sm text-red-600">
                    Commission for order: {selectedTransaction.productDetails?.name}
                  </p>
                </div>

                {/* Bank Details */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Admin Payment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-blue-800">Bank Name:</p>
                      <p className="text-blue-700">{bankDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Account Number:</p>
                      <p className="text-blue-700 font-mono">{bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">IFSC Code:</p>
                      <p className="text-blue-700 font-mono">{bankDetails.ifscCode}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Account Holder:</p>
                      <p className="text-blue-700">{bankDetails.accountHolder}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-blue-800">UPI ID:</p>
                      <p className="text-blue-700 font-mono">{bankDetails.upiId}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentData.paymentMethod}
                      onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI Payment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Reference/Transaction ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentData.paymentReference}
                      onChange={(e) => setPaymentData({...paymentData, paymentReference: e.target.value})}
                      placeholder="Enter transaction ID or reference number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the transaction ID from your bank/UPI app after making the payment
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Please make the payment first and then submit the transaction reference here.
                      For any issues, contact admin at{' '}
                      <a href={`mailto:${bankDetails.contactEmail}`} className="underline">
                        {bankDetails.contactEmail}
                      </a>
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={closePaymentModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionPayments;