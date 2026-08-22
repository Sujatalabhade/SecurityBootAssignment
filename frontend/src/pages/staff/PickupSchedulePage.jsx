import React, { useState, useEffect } from 'react';
import { getPickupOrders, updateOrderStatus } from '../../api/staff';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PickupSchedulePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getPickupOrders();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch pickups');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (id) => {
    try {
      await updateOrderStatus(id, { status: 'DELIVERED' });
      toast.success('Marked as picked up!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Pickup Schedule</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {orders.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            No pickups scheduled or ready.
          </div>
        ) : (
          orders.map(o => (
            <div key={o.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Order #{o.id}</h3>
                <OrderStatusBadge status={o.status} />
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>User: {o.userName}</p>
              {o.scheduledTime && (
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Time: {new Date(o.scheduledTime).toLocaleString('en-IN')}
                </p>
              )}
              <div style={{ background: 'var(--surface2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                {o.items?.map(i => (
                  <div key={i.id} style={{ fontSize: '0.9rem' }}>{i.quantity}x {i.product?.name}</div>
                ))}
              </div>
              {o.status === 'READY_FOR_PICKUP' && (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleDeliver(o.id)}>
                  Mark Picked Up
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PickupSchedulePage;
