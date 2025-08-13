import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ManagementMenu = () => {
  const location = useLocation();

  const tabs = [
    { path: '/management/drivers', label: 'Drivers' },
    { path: '/management/routes', label: 'Routes' },
    { path: '/management/orders', label: 'Orders' },
  ];

  return (
    <nav style={{ marginBottom: 20 }}>
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          style={{
            marginRight: 15,
            padding: '10px 15px',
            textDecoration: 'none',
            borderBottom: location.pathname === tab.path ? '3px solid #2196F3' : 'none',
            color: location.pathname === tab.path ? '#2196F3' : '#333',
            fontWeight: location.pathname === tab.path ? 'bold' : 'normal',
          }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
};

export default ManagementMenu;
