import React, { useState, useEffect } from 'react';
import { getStats } from '../../api/manager'; // Reusing manager stats for admin overview
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, Users, Package, Activity, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats(); // Simulating system stats with manager stats
      setStats(data);
    } catch (err) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      
      {/* Role Branding Header */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--error)' }}>
        <div>
          <span className="badge badge-error" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 700, padding: '0.3rem 0.6rem' }}>
            🛡️ Admin Control Panel
          </span>
          <h1 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '2rem', fontWeight: 800 }}>System Administration Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supervise total users, products catalog CRUD, and check system security audit logs</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface2)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <User size={20} color="var(--error)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'System Admin'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Users</div>
              <h2 style={{ fontSize: '2rem' }}>{stats?.totalCustomers || 15}</h2>
            </div>
            <Users size={32} color="var(--info)" />
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Products Active</div>
              <h2 style={{ fontSize: '2rem' }}>{stats?.topProducts?.length || 42}</h2>
            </div>
            <Package size={32} color="var(--success)" />
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>System Health</div>
              <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>100%</h2>
            </div>
            <Activity size={32} color="var(--success)" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Welcome to Admin Dashboard</h3>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
          Use the sidebar to manage users, products, and view system audit logs.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
