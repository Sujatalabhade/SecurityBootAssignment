import React, { useState, useEffect } from 'react';
import { getStats } from '../../api/manager';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart2, DollarSign, ShoppingBag, Users, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      
      {/* Role Branding Header */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--accent)' }}>
        <div>
          <span className="badge badge-warning" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 700, padding: '0.3rem 0.6rem', color: '#fff', background: 'var(--warning)' }}>
            📊 Manager Panel
          </span>
          <h1 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '2rem', fontWeight: 800 }}>Manager Reports & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monitor store-wide revenue, order performance, and low inventory metrics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface2)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <User size={20} color="var(--accent)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Store Manager'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(108, 99, 255, 0.1)', borderRadius: '12px' }}>
              <DollarSign size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Total Revenue</div>
              <h2 style={{ fontSize: '1.5rem' }}>₹{Number(stats.totalRevenue || 0).toFixed(2)}</h2>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(0, 212, 170, 0.1)', borderRadius: '12px' }}>
              <ShoppingBag size={24} color="var(--accent)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Total Orders</div>
              <h2 style={{ fontSize: '1.5rem' }}>{stats.totalOrders ?? 0}</h2>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }}>
              <Users size={24} color="var(--success)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Pending Orders</div>
              <h2 style={{ fontSize: '1.5rem' }}>{stats.pendingOrders ?? 0}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>
          <BarChart2 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Overview
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>
          Total number of products currently low on stock: <span className="badge badge-warning">{stats.lowStockCount ?? 0}</span>
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
