import React, { useState, useEffect } from 'react';
import { getStats } from '../../api/manager';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart2, DollarSign, ShoppingBag, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner fullScreen />;
  if (!stats) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Sales Reports & Analytics</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(108, 99, 255, 0.1)', borderRadius: '12px' }}>
              <DollarSign size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Total Revenue</div>
              <h2 style={{ fontSize: '1.5rem' }}>₹{stats.totalRevenue}</h2>
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
              <h2 style={{ fontSize: '1.5rem' }}>{stats.totalOrders}</h2>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }}>
              <Users size={24} color="var(--success)" />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Total Customers</div>
              <h2 style={{ fontSize: '1.5rem' }}>{stats.totalCustomers || 0}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}><BarChart2 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} /> Top Selling Products</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {stats.topProducts && stats.topProducts.length > 0 ? (
            stats.topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>{i + 1}. {p.productName}</span>
                <span className="badge badge-info">{p.totalSold} units sold</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No sales data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
