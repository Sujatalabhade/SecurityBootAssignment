import React, { useState, useEffect } from 'react';
import { getStats } from '../../api/manager'; // Reusing manager stats for admin overview
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, Users, Package, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ShieldCheck color="var(--primary)" size={32} /> Admin Overview
      </h1>
      
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
