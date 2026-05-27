import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ApprovedRecyclers from './ApprovedRecyclers';

const GovernmentDashboard = () => {
  const [activeSection, setActiveSection] = useState('recyclers');

  const sidebarItems = [
    { label: 'Recyclers', onClick: () => setActiveSection('recyclers') },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'recyclers':
        return <ApprovedRecyclers />;
      default:
        return <ApprovedRecyclers />;
    }
  };

  return (
    <DashboardLayout
      userRole="government"
      sidebarItems={sidebarItems}
      dashboardTitle="Government Dashboard"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default GovernmentDashboard;