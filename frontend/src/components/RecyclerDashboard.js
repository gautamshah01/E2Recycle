import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import IncomingRequests from './IncomingRequests';
import CommissionPayments from './CommissionPayments';

const RecyclerDashboard = () => {
  const [activeSection, setActiveSection] = useState('requests');

  const sidebarItems = [
    { label: 'Incoming Requests', onClick: () => setActiveSection('requests') },
    { label: 'Commission Payments', onClick: () => setActiveSection('payments') },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'requests':
        return <IncomingRequests />;
      case 'payments':
        return <CommissionPayments />;
      default:
        return <IncomingRequests />;
    }
  };

  return (
    <DashboardLayout
      userRole="recycler"
      sidebarItems={sidebarItems}
      dashboardTitle="Recycler Dashboard"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default RecyclerDashboard;