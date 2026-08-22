import React, { useState, useEffect } from 'react';
import { getStaffOrders } from '../../api/staff';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Package, Clock, Truck, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const [stats, setStats] = useState({ pending: 0, preparing: 0, pickup: 0, delivery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const orders = await getStaffOrders();
      setStats({
        pending: orders.filter(o => o.status === 'PENDING').length,
        preparing: orders.filter(o => o.status === 'PREPARING').length,
        pickup: orders.filter(o => o.status === 'READY_FOR_PICKUP').length,
        delivery: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Staff Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pending Orders</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.pending}</h2>
            </div>
            <Clock size={32} color="var(--warning)" />
          </div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Preparing</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.preparing}</h2>
            </div>
            <Package size={32} color="var(--info)" />
          </div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Ready for Pickup</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.pickup}</h2>
            </div>
            <Store size={32} color="var(--success)" />
          </div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Out for Delivery</div>
              <h2 style={{ fontSize: '2rem' }}>{stats.delivery}</h2>
            </div>
            <Truck size={32} color="var(--primary)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
