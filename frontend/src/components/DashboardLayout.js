import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const DashboardLayout = ({ userRole, children, sidebarItems, dashboardTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [activeItem, setActiveItem] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = ApiService.getCurrentUser();
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    ApiService.logout();
    navigate('/');
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'individual': return 'from-blue-500 to-blue-600';
      case 'organization': return 'from-green-500 to-green-600';
      case 'government': return 'from-purple-500 to-purple-600';
      case 'recycler': return 'from-orange-500 to-orange-600';
      case 'admin': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleColorLight = () => {
    switch (userRole) {
      case 'individual': return 'from-blue-50 to-blue-100';
      case 'organization': return 'from-green-50 to-green-100';
      case 'government': return 'from-purple-50 to-purple-100';
      case 'recycler': return 'from-orange-50 to-orange-100';
      case 'admin': return 'from-red-50 to-red-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'individual': return '👤';
      case 'organization': return '🏢';
      case 'government': return '🏛️';
      case 'recycler': return '♻️';
      case 'admin': return '⚙️';
      default: return '📊';
    }
  };

  const handleMenuClick = (item, index) => {
    setActiveItem(index);
    item.onClick();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* Advanced Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 ease-in-out bg-white shadow-2xl border-r border-gray-200 flex flex-col relative overflow-hidden`}>
        
        {/* Sidebar Header with Gradient */}
        <div className={`bg-gradient-to-r ${getRoleColor()} text-white p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl transform hover:scale-110 transition-transform duration-200">
                  {getRoleIcon()}
                </div>
                {sidebarOpen && (
                  <div className="animate-fadeIn">
                    <h2 className="font-bold text-lg tracking-wide">{dashboardTitle}</h2>
                    <p className="text-sm opacity-90 capitalize font-medium">{userRole} Portal</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 transform hover:scale-110"
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
            <div className="w-full h-full rounded-full border-8 border-white"></div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item, index)}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                activeItem === index 
                  ? `bg-gradient-to-r ${getRoleColor()} text-white shadow-lg` 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100'
              }`}
            >
              <div className="flex items-center p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                  activeItem === index 
                    ? 'bg-white bg-opacity-20' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeItem === index 
                      ? 'bg-white' 
                      : 'bg-gray-400 group-hover:bg-gray-600'
                  }`}></div>
                </div>
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
                
                {/* Active Indicator */}
                {activeItem === index && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                )}
              </div>
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor()} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize font-medium">{user.role}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Enhanced Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {dashboardTitle}
                </h1>
                <div className={`px-3 py-1 bg-gradient-to-r ${getRoleColor()} text-white text-xs font-semibold rounded-full capitalize shadow-sm`}>
                  {user.role}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 relative"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a50.002 50.002 0 0 0-2.8-0.8V9a6 6 0 1 0-12 0v3.7c-.9.3-1.9.5-2.8.8L1 17h5m4 0v1a3 3 0 0 0 6 0v-1m-6 0h6" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">No new notifications</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Welcome */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Welcome back!</p>
                    <p className="text-xs text-gray-500">Have a productive day</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor()} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Enhanced Styling */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;