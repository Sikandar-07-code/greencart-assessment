import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '20px',
      marginBottom: '20px',
      minWidth: '250px'
    }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>{title}</h3>
      {children}
    </div>
  );
};

export default Card;
