import React, { useState, useEffect } from 'react';
import { getStaffOrders, updateOrderStatus } from '../../api/staff';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderQueuePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getStaffOrders();
      setOrders(data.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Order Queue</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
        {['ALL', 'PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].map(f => (
          <button key={f} className={`badge ${filter === f ? 'badge-info' : 'badge-default'}`} onClick={() => setFilter(f)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Time</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Items</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No orders found</td></tr>
            ) : (
              filteredOrders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--surface3)' }}>
                  <td style={{ padding: '1rem' }}>{o.id.slice(0,8)}</td>
                  <td style={{ padding: '1rem' }}>{new Date(o.createdAt).toLocaleTimeString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-default">{o.deliveryType.replace(/_/g, ' ')}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{o.items.length} items</td>
                  <td style={{ padding: '1rem' }}><OrderStatusBadge status={o.status} /></td>
                  <td style={{ padding: '1rem' }}>
                    {o.status === 'PENDING' && <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleStatusUpdate(o.id, 'PREPARING')}>Start Prep</button>}
                    {o.status === 'PREPARING' && (
                      <button className="btn btn-success" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--success)', color: 'white' }} onClick={() => handleStatusUpdate(o.id, o.deliveryType === 'HOME_DELIVERY' ? 'OUT_FOR_DELIVERY' : 'READY_FOR_PICKUP')}>
                        Mark Ready
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderQueuePage;
