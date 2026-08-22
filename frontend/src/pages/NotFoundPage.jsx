import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
      <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px' }}>
        <MapPinOff size={80} color="var(--primary)" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
        <h1 style={{ marginBottom: '1rem', fontSize: '3rem' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
