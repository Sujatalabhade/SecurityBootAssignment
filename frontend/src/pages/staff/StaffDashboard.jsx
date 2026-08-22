import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStaffOrders } from '../../api/staff';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Package, Clock, Truck, Store, User } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, preparing: 0, pickup: 0, delivery: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getStaffOrders();
      const ordersList = data?.content || [];
      setStats({
        pending: ordersList.filter(o => o.status === 'PENDING').length,
        preparing: ordersList.filter(o => o.status === 'PREPARING').length,
        pickup: ordersList.filter(o => o.status === 'READY_FOR_PICKUP').length,
        delivery: ordersList.filter(o => o.status === 'OUT_FOR_DELIVERY').length
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      
      {/* Role Branding Header */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--primary)' }}>
        <div>
          <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 700, padding: '0.3rem 0.6rem' }}>
            🛠️ Staff Panel
          </span>
          <h1 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '2rem', fontWeight: 800 }}>Staff Operations Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage store orders, daily prep queue, and pending returns</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface2)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          <User size={20} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Store Staff'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Pending Orders Card */}
        <div
          className="card card-hover"
          onClick={() => navigate('/staff/orders?filter=PENDING')}
          style={{ borderLeft: '4px solid var(--warning)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pending Orders</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.pending}</h2>
            </div>
            <Clock size={32} color="var(--warning)" />
          </div>
        </div>

        {/* Preparing Card */}
        <div
          className="card card-hover"
          onClick={() => navigate('/staff/orders?filter=PREPARING')}
          style={{ borderLeft: '4px solid var(--primary)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Preparing</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.preparing}</h2>
            </div>
            <Package size={32} color="var(--primary)" />
          </div>
        </div>

        {/* Ready for Pickup Card */}
        <div
          className="card card-hover"
          onClick={() => navigate('/staff/pickup')}
          style={{ borderLeft: '4px solid var(--success)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Ready for Pickup</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.pickup}</h2>
            </div>
            <Store size={32} color="var(--success)" />
          </div>
        </div>

        {/* Out for Delivery Card */}
        <div
          className="card card-hover"
          onClick={() => navigate('/staff/orders?filter=OUT_FOR_DELIVERY')}
          style={{ borderLeft: '4px solid var(--accent)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Out for Delivery</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.delivery}</h2>
            </div>
            <Truck size={32} color="var(--accent)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
