import React, { useState, useEffect } from 'react';

const AcceptedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAcceptedRequests();
  }, []);

  const loadAcceptedRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/recycling-requests/accepted-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accepted requests');
      }

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error loading accepted requests:', error);
      setError('Failed to load accepted requests');
    } finally {
      setLoading(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Accepted Appointments</h2>
        <button
          onClick={loadAcceptedRequests}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl text-gray-400">📅</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Accepted Appointments</h3>
          <p className="text-gray-500">You don't have any accepted recycling appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Header with status */}
              <div className="bg-green-50 border-b border-green-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Accepted
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Recycler will reach soon within 24 hours
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Booking Code: <span className="font-mono font-bold text-green-700">{request.uniqueCode}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
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
                      {request.recyclerResponse?.finalPrice && (
                        <div>
                          <span className="font-medium text-gray-700">Final Price:</span>
                          <p className="text-green-600 font-semibold">₹{request.recyclerResponse.finalPrice}</p>
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

                  {/* Recycler Details */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recycler Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Company:</span>
                        <p className="text-gray-600">{request.recyclerName}</p>
                      </div>
                      {request.recyclerId?.email && (
                        <div>
                          <span className="font-medium text-gray-700">Email:</span>
                          <p className="text-gray-600">{request.recyclerId.email}</p>
                        </div>
                      )}
                      {request.recyclerId?.phone && (
                        <div>
                          <span className="font-medium text-gray-700">Phone:</span>
                          <p className="text-gray-600">{request.recyclerId.phone}</p>
                        </div>
                      )}
                      {request.recyclerId?.address && (
                        <div>
                          <span className="font-medium text-gray-700">Address:</span>
                          <p className="text-gray-600">{request.recyclerId.address}</p>
                        </div>
                      )}
                      {request.recyclerResponse?.message && (
                        <div>
                          <span className="font-medium text-gray-700">Message:</span>
                          <p className="text-gray-600">{request.recyclerResponse.message}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Details</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Scheduled Date:</span>
                        <p className="text-gray-600">{formatAppointmentDate(request.preferredDate)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Time Slot:</span>
                        <p className="text-gray-600">{request.timeSlot}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Your Address:</span>
                        <p className="text-gray-600">{request.address}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Contact Phone:</span>
                        <p className="text-gray-600">{request.phoneNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Accepted On:</span>
                        <p className="text-gray-600">{formatDate(request.recyclerResponse?.respondedAt || request.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Important Instructions</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Keep your booking code <span className="font-mono font-bold">{request.uniqueCode}</span> ready</li>
                          <li>The recycler will visit your location within 24 hours</li>
                          <li>Ensure the product is ready for pickup</li>
                          <li>The recycler will ask for your booking code to confirm the transaction</li>
                          <li>Payment will be processed after product verification</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedRequests;