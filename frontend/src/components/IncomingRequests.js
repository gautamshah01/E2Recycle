import React, { useState, useEffect } from 'react';

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [uniqueCode, setUniqueCode] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [blocked, setBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState('');

  useEffect(() => {
    loadRequests();
  }, [activeTab]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;

      if (!userId) {
        throw new Error('User not found');
      }

      let url = `http://localhost:5000/api/recycling-requests/recycler/${userId}`;
      if (activeTab !== 'all') {
        url += `?status=${activeTab}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setBlocked(data.blocked || false);
      setBlockMessage(data.message || '');
    } catch (error) {
      console.error('Error loading requests:', error);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, status, message = '', finalPrice = null) => {
    try {
      setProcessing(requestId);
      
      const response = await fetch(`http://localhost:5000/api/recycling-requests/${requestId}/respond`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          message: message || (status === 'accepted' ? 'Request accepted' : 'Request rejected'),
          finalPrice
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${status} request`);
      }

      // Reload requests
      await loadRequests();
      alert(`Request ${status} successfully!`);
    } catch (error) {
      console.error(`Error ${status}ing request:`, error);
      alert(`Failed to ${status} request: ` + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      if (!uniqueCode.trim()) {
        alert('Please enter the unique code');
        return;
      }

      setProcessing(selectedRequest._id);
      
      const response = await fetch(`http://localhost:5000/api/recycling-requests/${selectedRequest._id}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueCode: uniqueCode.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete order');
      }

      const result = await response.json();

      // Close modal and reload
      setShowCompleteModal(false);
      setSelectedRequest(null);
      setUniqueCode('');
      await loadRequests();
      
      // Show commission message if required
      if (result.commissionRequired && result.commissionAmount > 0) {
        alert(`Order completed successfully! 
        
IMPORTANT: You need to pay ₹${result.commissionAmount} commission (8%) to admin.
Please go to 'Commission Payments' section to complete the payment.

You will not receive new appointment requests until the commission is paid.`);
      } else {
        alert('Order completed successfully!');
        // Refresh the requests list
        loadRequests();
      }
    } catch (error) {
      console.error('Error completing order:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid unique code')) {
        errorMessage = '❌ Invalid secret code! Please ask the customer for the correct secret code. The code is case-sensitive.';
      } else if (error.message.includes('must be accepted')) {
        errorMessage = '⚠️ This request needs to be accepted first. Please refresh the page and try again.';
      } else if (error.message.includes('already completed')) {
        errorMessage = '✅ This order has already been completed. Please refresh the page.';
      }
      
      alert('Failed to complete order: ' + errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const openCompleteModal = (request) => {
    // Ensure request is in accepted status
    if (request.status !== 'accepted') {
      if (request.status === 'completed') {
        alert('This order has already been completed. Please refresh the page.');
      } else {
        alert(`Cannot complete order. Request status is: ${request.status}. Please refresh the page.`);
      }
      return;
    }
    
    // Check if final price is set
    if (!request.recyclerResponse?.finalPrice) {
      alert('Final price not set. Please accept the request with a price first.');
      return;
    }
    
    setSelectedRequest(request);
    setShowCompleteModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
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

  const formatAppointmentDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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
      {/* Tabs */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {['pending', 'accepted', 'rejected', 'completed', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={loadRequests}
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

      {blocked && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <div>
              <h4 className="font-semibold mb-1">Account Restricted</h4>
              <p className="mb-2">{blockMessage}</p>
              <p className="text-sm">Contact admin: <a href="mailto:e2recycle@gmail.com" className="underline">e2recycle@gmail.com</a></p>
            </div>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl text-gray-400">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {blocked ? 'No New Appointments Available' : 'No Pending Requests'}
          </h3>
          <p className="text-gray-500">
            {blocked 
              ? 'You cannot receive new appointments due to pending commission payments.' 
              : "You don't have any pending recycling requests at the moment."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Product:</span>
                      <p className="text-gray-600">{request.productName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-600">{request.productType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Quantity:</span>
                      <p className="text-gray-600">{request.quantity}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Condition:</span>
                      <p className="text-gray-600">{request.condition}</p>
                    </div>
                    {request.estimatedPrice && (
                      <div>
                        <span className="font-medium text-gray-700">Expected Price:</span>
                        <p className="text-gray-600">₹{request.estimatedPrice}</p>
                      </div>
                    )}
                    {request.description && (
                      <div>
                        <span className="font-medium text-gray-700">Description:</span>
                        <p className="text-gray-600">{request.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{request.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{request.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <p className="text-gray-600">{request.address}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Requested Date:</span>
                      <p className="text-gray-600">{formatAppointmentDate(request.preferredDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time Slot:</span>
                      <p className="text-gray-600">{request.timeSlot}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted:</span>
                      <p className="text-gray-600">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Status & Actions</h3>
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    {request.status === 'pending' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Final Price (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter final price"
                            id={`price-${request._id}`}
                          />
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => {
                              const priceInput = document.getElementById(`price-${request._id}`);
                              const finalPrice = priceInput ? parseFloat(priceInput.value) : null;
                              handleRespond(request._id, 'accepted', 'Request accepted', finalPrice);
                            }}
                            disabled={processing === request._id}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processing === request._id ? (
                              <>
                                <div className="animate-spin h-4 w-4 mr-2 border border-white border-t-transparent rounded-full"></div>
                                Processing...
                              </>
                            ) : (
                              'Accept Request'
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleRespond(request._id, 'rejected', 'Request rejected')}
                            disabled={processing === request._id}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processing === request._id ? (
                              <>
                                <div className="animate-spin h-4 w-4 mr-2 border border-white border-t-transparent rounded-full"></div>
                                Processing...
                              </>
                            ) : (
                              'Reject Request'
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    {request.status === 'accepted' && request.recyclerResponse?.finalPrice && (
                      <div className="space-y-2">
                        <p className="text-sm text-green-600">✓ Request accepted</p>
                        <p className="text-sm text-gray-600">
                          Final Price: ₹{request.recyclerResponse.finalPrice}
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
                          <p className="text-xs text-yellow-800">
                            📍 Visit customer location and ask for their secret code to complete this order
                          </p>
                        </div>
                        <button
                          onClick={() => openCompleteModal(request)}
                          disabled={processing === request._id}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Complete Order
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && !request.recyclerResponse?.finalPrice && (
                      <div className="space-y-2">
                        <p className="text-sm text-yellow-600">⏳ Waiting for your response...</p>
                        <p className="text-xs text-gray-500">Please accept or reject this request first</p>
                      </div>
                    )}

                    {request.status === 'rejected' && (
                      <p className="text-sm text-red-600">✗ Request rejected</p>
                    )}

                    {request.status === 'completed' && (
                      <div className="space-y-2">
                        <p className="text-sm text-blue-600">✓ Order completed</p>
                        {request.completedAt && (
                          <p className="text-xs text-gray-500">
                            Completed on: {formatDate(request.completedAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Order Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Complete Order</h3>
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setSelectedRequest(null);
                    setUniqueCode('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    🚨 <strong>Important:</strong> You must visit the customer's location and physically collect the items. 
                    Ask the customer for their unique secret code to complete this order:
                  </p>
                  <input
                    type="text"
                    value={uniqueCode}
                    onChange={(e) => setUniqueCode(e.target.value)}
                    placeholder="Ask customer for their secret code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-red-600">
                      ⚠️ The secret code is only known to the customer. You must ask them personally.
                    </p>
                    <p className="text-xs text-blue-600">
                      💡 Code format: E2R-XXXXXXXX (case sensitive)
                    </p>
                  </div>
                </div>
                
                {selectedRequest && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Customer:</span> {selectedRequest.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Product:</span> {selectedRequest.productName}
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowCompleteModal(false);
                      setSelectedRequest(null);
                      setUniqueCode('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={!uniqueCode.trim() || processing}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingRequests;