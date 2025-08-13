import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#2196F3',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '18px',
    }}>
      <div>GreenCart Logistics</div>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#f44336',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Logout
      </button>
    </header>
  );
};

// Example in Header.js or your navigation component
<Link to="/management/routes" style={{ marginLeft: 20 }}>Routes</Link>


export default Header;
