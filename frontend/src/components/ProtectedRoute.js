import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is authenticated
  if (!token || !user.email) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const roleToPath = {
      individual: '/dashboard/individual',
      organization: '/dashboard/organization',
      government: '/dashboard/government',
      recycler: '/dashboard/recycler',
      admin: '/dashboard/admin'
    };

    const userDashboard = roleToPath[user.role];
    if (userDashboard) {
      return <Navigate to={userDashboard} replace />;
    }

    // If role is not recognized, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;