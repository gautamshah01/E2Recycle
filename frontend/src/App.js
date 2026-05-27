import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import IndividualDashboard from './components/IndividualDashboard';
import GovOrgDashboard from './components/GovOrgDashboard';
import RecyclerDashboard from './components/RecyclerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard/individual" 
            element={
              <ProtectedRoute allowedRoles={['individual']}>
                <IndividualDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/organization" 
            element={
              <ProtectedRoute allowedRoles={['organization']}>
                <GovOrgDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/government" 
            element={
              <ProtectedRoute allowedRoles={['government']}>
                <GovOrgDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/recycler" 
            element={
              <ProtectedRoute allowedRoles={['recycler']}>
                <RecyclerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
