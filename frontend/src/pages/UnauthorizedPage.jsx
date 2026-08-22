import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
      <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px' }}>
        <ShieldAlert size={80} color="var(--error)" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
        <h1 style={{ marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          You do not have the required permissions to view this page.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
