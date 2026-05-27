import React, { useState } from 'react';
import jsPDF from 'jspdf';

const RecyclingRequestForm = ({ recycler, onClose, onSubmitted }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    quantity: '',
    condition: '',
    estimatedPrice: '',
    description: '',
    phoneNumber: '',
    email: '',
    address: '',
    preferredDate: '',
    timeSlot: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uniqueCode, setUniqueCode] = useState('');
  const [requestData, setRequestData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...formData,
        recyclerId: recycler._id,
        recyclerName: recycler.companyName,
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/recycling-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      const result = await response.json();
      setUniqueCode(result.uniqueCode);
      setRequestData(result);
      setSuccess(true);
      
      // Generate PDF automatically
      generatePDF(result);
    } catch (error) {
      console.error('Error submitting request:', error);
      setError(error.message || 'Failed to submit recycling request');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 123, 191);
    doc.text('E2Recycle - Appointment Confirmation', 20, 30);
    
    // Unique Code
    doc.setFontSize(16);
    doc.setTextColor(220, 53, 69);
    doc.text(`Booking Code: ${data.uniqueCode}`, 20, 50);
    
    // Instructions
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Please keep this code safe. It will be required for order confirmation.', 20, 65);
    
    // Appointment Details
    doc.setFontSize(14);
    doc.setTextColor(0, 123, 191);
    doc.text('Appointment Details:', 20, 85);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const details = [
      `Recycler: ${recycler.companyName}`,
      `Product: ${formData.productName} (${formData.productType})`,
      `Quantity: ${formData.quantity}`,
      `Condition: ${formData.condition}`,
      `Estimated Price: $${formData.estimatedPrice || 'TBD'}`,
      `Preferred Date: ${new Date(formData.preferredDate).toLocaleDateString()}`,
      `Time Slot: ${formData.timeSlot}`,
      `Contact: ${formData.phoneNumber}`,
      `Email: ${formData.email}`,
      `Address: ${formData.address}`
    ];
    
    let yPosition = 100;
    details.forEach(detail => {
      doc.text(detail, 20, yPosition);
      yPosition += 10;
    });
    
    // Status
    doc.setFontSize(12);
    doc.setTextColor(255, 193, 7);
    doc.text('Status: Pending Recycler Approval', 20, yPosition + 15);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    doc.text('Generated on: ' + new Date().toLocaleString(), 20, yPosition + 35);
    doc.text('E2Recycle - Making Electronic Waste Management Easy', 20, yPosition + 45);
    
    // Save the PDF
    doc.save(`E2Recycle-Appointment-${data.uniqueCode}.pdf`);
  };

  const productTypes = [
    'Smartphone',
    'Laptop',
    'Desktop Computer',
    'Tablet',
    'Monitor',
    'Printer',
    'Television',
    'Audio Equipment',
    'Camera',
    'Gaming Console',
    'Other Electronics'
  ];

  const conditions = [
    'Excellent - Like new, fully functional',
    'Good - Minor wear, fully functional',
    'Fair - Visible wear, mostly functional',
    'Poor - Significant damage, partially functional',
    'Broken - Not functional, for parts only'
  ];

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {success ? 'Appointment Confirmed!' : `Book Recycling Request - ${recycler.companyName}`}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {success ? (
        <div className="p-6">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Your request is pending approval by the recycler
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Booking Code</h3>
              <div className="text-2xl font-mono font-bold text-blue-700 bg-white p-3 rounded border border-blue-300">
                {uniqueCode}
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Keep this code safe! It will be required at confirmation time.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-600">
                Your appointment PDF has been automatically downloaded.
              </p>
              <button
                onClick={() => generatePDF(requestData)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF Again
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Next Steps:</strong><br/>
                • The recycler will review your request<br/>
                • You'll be notified when they accept or reject<br/>
                • If accepted, they'll visit within 24 hours<br/>
                • Keep your booking code ready for confirmation
              </p>
            </div>
            
            <button
              onClick={() => {
                onSubmitted();
                onClose();
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Product Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                required
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., iPhone 12, Dell Laptop"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type *
              </label>
              <select
                name="productType"
                required
                value={formData.productType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select product type</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                required
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Number of items"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Price (₹)
              </label>
              <input
                type="number"
                name="estimatedPrice"
                min="0"
                value={formData.estimatedPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Expected price"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Condition *
            </label>
            <select
              name="condition"
              required
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Additional details about the product..."
            />
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your contact number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your email address"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Address *
            </label>
            <textarea
              name="address"
              required
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Complete address for pickup"
            />
          </div>
        </div>

        {/* Appointment Details Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                name="preferredDate"
                required
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slot *
              </label>
              <select
                name="timeSlot"
                required
                value={formData.timeSlot}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
        </form>
      )}
    </div>
  );
};

export default RecyclingRequestForm;