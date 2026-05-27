import React, { useState, useEffect } from 'react';
import RecyclingRequestForm from './RecyclingRequestForm';

const ApprovedRecyclers = () => {
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRecycler, setSelectedRecycler] = useState(null);

  useEffect(() => {
    loadApprovedRecyclers();
  }, []);

  const loadApprovedRecyclers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/recyclers/approved', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch approved recyclers');
      }

      const data = await response.json();
      setRecyclers(data.recyclers || []);
    } catch (error) {
      console.error('Error loading approved recyclers:', error);
      setError('Failed to load approved recyclers');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (recycler) => {
    setSelectedRecycler(recycler);
    setShowRequestForm(true);
  };

  const handleCloseForm = () => {
    setShowRequestForm(false);
    setSelectedRecycler(null);
  };

  const handleRequestSubmitted = () => {
    setShowRequestForm(false);
    setSelectedRecycler(null);
    // You could show a success message here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showRequestForm) {
    return (
      <RecyclingRequestForm
        recycler={selectedRecycler}
        onClose={handleCloseForm}
        onSubmitted={handleRequestSubmitted}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Approved Recyclers</h2>
        <button
          onClick={loadApprovedRecyclers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {recyclers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl text-gray-400">♻️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Recyclers</h3>
          <p className="text-gray-500">No recyclers have been approved yet. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recyclers.map((recycler) => (
            <div key={recycler._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {recycler.companyName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Contact: {recycler.contactPerson}
                  </p>
                  <p className="text-sm text-gray-600">
                    Position: {recycler.designation}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium">
                      {recycler.companyName?.charAt(0) || 'R'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <p className="text-sm text-gray-600">{recycler.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Phone:</span>
                  <p className="text-sm text-gray-600">{recycler.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">License:</span>
                  <p className="text-sm text-gray-600">{recycler.licenseNumber}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Address:</span>
                  <p className="text-sm text-gray-600">{recycler.address}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Specialization:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recycler.specialization?.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  )) || <span className="text-sm text-gray-500">Not specified</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">Experience:</span>
                  <p className="text-gray-600">{recycler.yearsInBusiness} years</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Capacity:</span>
                  <p className="text-gray-600 capitalize">{recycler.processingCapacity}</p>
                </div>
              </div>

              {recycler.certifications && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Certifications:</span>
                  <p className="text-sm text-gray-600">{recycler.certifications}</p>
                </div>
              )}

              <button
                onClick={() => handleBookAppointment(recycler)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedRecyclers;