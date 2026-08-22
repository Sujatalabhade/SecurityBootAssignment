import React from 'react';

const LoadingSpinner = ({ fullScreen }) => {
  const spinner = <div className="spinner"></div>;

  if (fullScreen) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        {spinner}
      </div>
    );
  }

  return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>{spinner}</div>;
};

export default LoadingSpinner;
