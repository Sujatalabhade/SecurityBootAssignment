import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStaffOrders, updateOrderStatus } from '../../api/staff';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderQueuePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const filter = searchParams.get('filter') || 'ALL';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getStaffOrders();
      const list = data?.content || [];
      setOrders(list.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (err) {
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, { status, notes: 'Status updated via queue dashboard' });
      toast.success(`Order #${id} is now in ${status.replace(/_/g, ' ')}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const setFilter = (newFilter) => {
    setSearchParams({ filter: newFilter });
  };

  if (loading) return <LoadingSpinner />;

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Order Queue</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage and update order preparation states</p>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['ALL', 'PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'].map(f => (
          <button
            key={f}
            className={`badge ${filter === f ? 'badge-info' : 'badge-default'}`}
            onClick={() => setFilter(f)}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: 'none' }}
          >
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
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
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No {filter !== 'ALL' ? filter.toLowerCase().replace(/_/g, ' ') : ''} orders in queue</td></tr>
            ) : (
              filteredOrders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--surface3)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>#{o.id}</td>
                  <td style={{ padding: '1rem' }}>{new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-default">{(o.deliveryType || '').replace(/_/g, ' ')}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{o.items?.length || 0} items</td>
                  <td style={{ padding: '1rem' }}><OrderStatusBadge status={o.status} /></td>
                  <td style={{ padding: '1rem' }}>
                    {o.status === 'PENDING' && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => handleStatusUpdate(o.id, 'PREPARING')}
                      >
                        Start Prep
                      </button>
                    )}
                    {o.status === 'PREPARING' && (
                      <button className="btn btn-success" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--success)', color: 'white' }} onClick={() => handleStatusUpdate(o.id, o.deliveryType === 'HOME_DELIVERY' ? 'OUT_FOR_DELIVERY' : 'READY_FOR_PICKUP')}>
                        Mark Ready
                      </button>
                    )}
                    {o.status === 'OUT_FOR_DELIVERY' && (
                      <button className="btn btn-success" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--success)', color: 'white' }} onClick={() => handleStatusUpdate(o.id, 'DELIVERED')}>
                        Mark Delivered
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
