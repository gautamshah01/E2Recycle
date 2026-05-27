import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ApprovedRecyclers from './ApprovedRecyclers';
import AcceptedRequests from './AcceptedRequests';

const GovOrgDashboard = ({ userRole }) => {
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

  const isGovernment = userRole === 'government';

  return (
    <DashboardLayout
      userRole={isGovernment ? 'government' : 'organization'}
      sidebarItems={sidebarItems}
      dashboardTitle={isGovernment ? 'Government Dashboard' : 'Organization Dashboard'}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default GovOrgDashboard;