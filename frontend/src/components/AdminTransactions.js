import React, { useState, useEffect } from 'react';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('paid');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [activeTab]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/transactions/admin/all?status=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (transactionId, confirmed, adminNotes = '') => {
    try {
      setProcessing(transactionId);
      
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmed,
          adminNotes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction');
      }

      alert(confirmed ? 'Payment confirmed successfully!' : 'Payment marked as disputed.');
      loadTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction: ' + error.message);
    } finally {
      setProcessing(null);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalCommission = () => {
    return transactions
      .filter(t => t.status === 'confirmed')
      .reduce((total, t) => total + t.commissionAmount, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Commission Transactions</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
            Total Earned: ₹{calculateTotalCommission().toFixed(2)}
          </div>
          <button
            onClick={loadTransactions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {['pending', 'paid', 'confirmed', 'disputed', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
          <p className="text-gray-500">No transactions found for the selected status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Commission Transaction
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created on {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {/* Recycler Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Recycler</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Company:</span> {transaction.recyclerId?.companyName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {transaction.recyclerId?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {transaction.recyclerId?.phone}
                  </p>
                </div>

                {/* Product Details */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Product</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Product:</span> {transaction.productDetails?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {transaction.productDetails?.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {transaction.productDetails?.quantity}
                  </p>
                  {transaction.recyclingRequestId?.uniqueCode && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Code:</span> {transaction.recyclingRequestId.uniqueCode}
                    </p>
                  )}
                </div>

                {/* Payment Details */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Order Amount:</span> ₹{transaction.orderAmount}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Commission:</span> {transaction.commissionRate}%
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    <span className="font-medium">Amount:</span> ₹{transaction.commissionAmount}
                  </p>
                  {transaction.paymentMethod && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Method:</span> {transaction.paymentMethod.replace('_', ' ').toUpperCase()}
                    </p>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  {transaction.paymentDate && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Paid:</span> {formatDate(transaction.paymentDate)}
                    </p>
                  )}
                  {transaction.paymentReference && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reference:</span> {transaction.paymentReference}
                    </p>
                  )}
                  {transaction.confirmedAt && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Confirmed:</span> {formatDate(transaction.confirmedAt)}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Due:</span> {formatDate(transaction.dueDate)}
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              {transaction.adminNotes && (
                <div className="mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Admin Notes:</span> {transaction.adminNotes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {transaction.status === 'paid' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleConfirmPayment(transaction._id, true)}
                    disabled={processing === transaction._id}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {processing === transaction._id ? 'Processing...' : 'Confirm Payment'}
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('Enter reason for dispute (optional):');
                      if (notes !== null) {
                        handleConfirmPayment(transaction._id, false, notes);
                      }
                    }}
                    disabled={processing === transaction._id}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Mark as Disputed
                  </button>
                </div>
              )}

              {transaction.status === 'confirmed' && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 text-center">
                    <span className="font-medium">✓ Payment Confirmed</span>
                    {transaction.confirmedAt && (
                      <span className="block text-sm mt-1">
                        Confirmed on {formatDate(transaction.confirmedAt)}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {transaction.status === 'disputed' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-800 text-center">
                    <span className="font-medium">⚠ Payment Disputed</span>
                    <span className="block text-sm mt-1">
                      Recycler contact: {transaction.recyclerId?.email}
                    </span>
                  </p>
                </div>
              )}

              {transaction.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-800 text-center">
                    <span className="font-medium">⏳ Waiting for Recycler Payment</span>
                    <span className="block text-sm mt-1">
                      Recycler has not submitted payment yet
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;