import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder } from '../../api/orders';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, MapPin, Clock, XCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (err) {
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(id);
      toast.success('Order cancelled');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return null;

  const canCancel = ['PENDING'].includes(order.status);
  const canReturn = ['DELIVERED'].includes(order.status);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      <button className="btn btn-ghost" onClick={() => navigate('/orders')} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back to Orders
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media(minWidth: 992px)': { gridTemplateColumns: '2fr 1fr' } }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>Order #{order.id.slice(0, 8)}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
                      {item.product.category === 'Vegetables' ? '🥬' : item.product.category === 'Fruits' ? '🍎' : '🛍️'}
                    </div>
                    <div>
                      <h4>{item.product.name}</h4>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Delivery Info</h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <MapPin color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Type: {order.deliveryType.replace(/_/g, ' ')}</div>
                {order.deliveryAddress && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{order.deliveryAddress}</p>}
              </div>
            </div>
            
            {order.scheduledTime && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Clock color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Scheduled Time</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(order.scheduledTime).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total Amount</span>
              <span className="gradient-text">₹{order.totalAmount}</span>
            </div>

            {canCancel && (
              <button className="btn btn-danger" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCancel}>
                <XCircle size={20} /> Cancel Order
              </button>
            )}

            {canReturn && (
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate('/returns', { state: { orderId: order.id } })}>
                <RotateCcw size={20} /> Request Return
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
