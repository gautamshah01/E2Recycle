import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ApprovedRecyclers from './ApprovedRecyclers';
import AcceptedRequests from './AcceptedRequests';

const IndividualDashboard = () => {
  const [activeSection, setActiveSection] = useState('recyclers');

  const sidebarItems = [
    { label: 'Recyclers', onClick: () => setActiveSection('recyclers') },
    { label: 'Accepted Requests', onClick: () => setActiveSection('accepted-requests') },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'recyclers':
        return <ApprovedRecyclers />;
      case 'accepted-requests':
        return <AcceptedRequests />;
      default:
        return <ApprovedRecyclers />;
    }
  };

  return (
    <DashboardLayout
      userRole="individual"
      sidebarItems={sidebarItems}
      dashboardTitle="Individual Dashboard"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default IndividualDashboard;