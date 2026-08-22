import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>
      
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', color: 'white' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>{user?.name}</h2>
            <div className="badge badge-info">{user?.role}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Email</div>
              <div>{user?.email}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              <Phone size={20} />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Phone</div>
              <div>{user?.phone || 'Not provided'}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Address</div>
              <div>{user?.address || 'Not provided'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
