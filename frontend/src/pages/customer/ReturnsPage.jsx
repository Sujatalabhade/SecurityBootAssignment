import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyReturns, createReturn } from '../../api/returns';
import { getOrders } from '../../api/orders';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

  const [formData, setFormData] = useState({
    orderId: state?.orderId || '',
    productId: '',
    reason: '',
    type: 'RETURN'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [returnsData, ordersData] = await Promise.all([getMyReturns(), getOrders()]);
      setReturns(returnsData);
      setOrders(ordersData.filter(o => o.status === 'DELIVERED'));
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReturn(formData);
      toast.success('Return requested successfully');
      setFormData({ orderId: '', productId: '', reason: '', type: 'RETURN' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to request return');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const selectedOrder = orders.find(o => o.id === formData.orderId);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Returns & Exchanges</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media(minWidth: 992px)': { gridTemplateColumns: '1fr 1fr' } }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Request Return / Exchange</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Order</label>
              <select className="select" value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} required>
                <option value="">-- Choose Order --</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>Order #{o.id.slice(0,8)} ({new Date(o.createdAt).toLocaleDateString()})</option>
                ))}
              </select>
            </div>

            {selectedOrder && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Product</label>
                <select className="select" value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} required>
                  <option value="">-- Choose Product --</option>
                  {selectedOrder.items.map(item => (
                    <option key={item.product.id} value={item.product.id}>{item.product.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
              <select className="select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
                <option value="RETURN">Return (Refund)</option>
                <option value="EXCHANGE">Exchange</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Reason</label>
              <textarea className="input" rows={3} value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required placeholder="Please explain why..."></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Submit Request</button>
          </form>
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem' }}>My Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {returns.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No return requests found.</p>
              </div>
            ) : (
              returns.map(r => (
                <div key={r.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className="badge badge-info">{r.type}</div>
                    <OrderStatusBadge status={r.status} />
                  </div>
                  <h4>{r.product.name}</h4>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Order #{r.order.id.slice(0,8)}</div>
                  <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>"{r.reason}"</p>
                  {r.staffNotes && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
                      <strong>Staff Note:</strong> {r.staffNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
