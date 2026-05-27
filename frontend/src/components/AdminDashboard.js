import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import RecyclerRequests from './RecyclerRequests';
import AdminTransactions from './AdminTransactions';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sidebarItems = [
    { label: 'Overview', onClick: () => setActiveSection('overview') },
    { label: 'Recycler Requests', onClick: () => setActiveSection('requests') },
    { label: 'Manage Users', onClick: () => setActiveSection('users') },
    { label: 'Device Registry', onClick: () => setActiveSection('devices') },
    { label: 'Commission Tracking', onClick: () => setActiveSection('commission') },
    { label: 'Transactions', onClick: () => setActiveSection('transactions') },
    { label: 'Analytics & Reports', onClick: () => setActiveSection('analytics') },
    { label: 'Gamification', onClick: () => setActiveSection('gamification') },
    { label: 'Regulatory Alerts', onClick: () => setActiveSection('alerts') },
    { label: 'System Settings', onClick: () => setActiveSection('settings') },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-red-600">0</p>
                    <p className="text-xs text-gray-500">No data available</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-red-600">Users</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Devices</p>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-xs text-gray-500">No data available</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-blue-600">Devices</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Commission Earned</p>
                    <p className="text-2xl font-bold text-green-600">₹0</p>
                    <p className="text-xs text-gray-500">No data available</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-green-600">Money</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Recyclers</p>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                    <p className="text-xs text-gray-500">No data available</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-orange-600">Recycle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">No users registered yet</p>
                  <p className="text-sm text-gray-400 mt-2">User distribution will appear here once users start registering</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activities</p>
                  <p className="text-sm text-gray-400 mt-2">Platform activities will appear here</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">User Management</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">All Roles</option>
                    <option value="individual">Individual</option>
                    <option value="organization">Organization</option>
                    <option value="government">Government</option>
                    <option value="recycler">Recycler</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Registered</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        No users found. Users will appear here once they register.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'commission':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Commission Tracking</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">₹0</div>
                  <p className="text-sm text-gray-600">Total Commission Earned</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹0</div>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">0%</div>
                  <p className="text-sm text-gray-600">Average Commission Rate</p>
                </div>
              </div>

              <h4 className="font-medium mb-3">Commission by Recycler</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Recycler</th>
                      <th className="p-3 text-left">Total Processed</th>
                      <th className="p-3 text-left">Commission Rate</th>
                      <th className="p-3 text-left">Our Earnings</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No commission data available. Data will appear once recyclers start processing devices.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Analytics & Reports</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Growth</h4>
                  <div className="text-center py-4">
                    <p className="text-gray-500">No growth data available</p>
                    <p className="text-sm text-gray-400 mt-2">Growth metrics will appear once platform gets active</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Device Categories</h4>
                  <div className="text-center py-4">
                    <p className="text-gray-500">No device data available</p>
                    <p className="text-sm text-gray-400 mt-2">Device statistics will appear once devices are registered</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h5 className="font-medium">Monthly Report</h5>
                  <p className="text-xs text-gray-600">Generate comprehensive monthly analytics</p>
                </button>
                <button className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <h5 className="font-medium">Growth Report</h5>
                  <p className="text-xs text-gray-600">User and device growth trends</p>
                </button>
                <button className="p-4 border border-red-300 rounded-lg hover:bg-red-50 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <h5 className="font-medium">Revenue Report</h5>
                  <p className="text-xs text-gray-600">Commission and earnings breakdown</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'gamification':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Gamification Controls</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Points System</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Device Registration</p>
                        <p className="text-xs text-gray-500">Points per device registered</p>
                      </div>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Successful Recycling</p>
                        <p className="text-xs text-gray-500">Points per completed recycling</p>
                      </div>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-16 px-2 py-1 border rounded text-sm text-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Rewards Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Amazon Voucher ₹100</span>
                      <span className="text-xs text-gray-600">500 points</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Plant a Tree</span>
                      <span className="text-xs text-gray-600">200 points</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">
                    Add New Reward
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Leaderboard</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left">Rank</th>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Points</th>
                        <th className="p-3 text-left">Devices Recycled</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-gray-500">
                          No leaderboard data available. Rankings will appear once users start earning points.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'requests':
        return <RecyclerRequests />;

      case 'transactions':
        return <AdminTransactions />;

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <h3 className="text-lg font-semibold mb-2">{activeSection.replace('-', ' ').toUpperCase()}</h3>
            <p className="text-gray-600">This section is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      userRole="admin"
      sidebarItems={sidebarItems}
      dashboardTitle="Admin Dashboard"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;