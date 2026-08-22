import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder } from '../../api/orders';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, MapPin, Clock, XCircle, RotateCcw, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryEmoji = {
  'Fruits & Vegetables': '🥬', 'Dairy & Eggs': '🥛', 'Bakery': '🍞',
  'Beverages': '🧃', 'Snacks & Sweets': '🍪', 'Personal Care': '🧴', 'Default': '🛍️',
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { fetchOrder(); }, [id]);

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
    setCancelling(true);
    try {
      await cancelOrder(id);
      toast.success('Order cancelled successfully');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return null;

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
  const canReturn = order.status === 'DELIVERED';
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'RETURNED';

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>

      {/* Back button */}
      <button className="btn btn-ghost" onClick={() => navigate('/orders')} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Back to Orders
      </button>

      {/* Header */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Order #{order.id}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Status Tracker */}
      {!isCancelled && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Order Progress</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: i <= currentStep ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--surface3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.8rem', fontWeight: 700,
                    boxShadow: i === currentStep ? '0 0 12px rgba(108,99,255,0.6)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <p style={{ fontSize: '0.65rem', marginTop: '0.4rem', color: i <= currentStep ? 'var(--text)' : 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {step.replace(/_/g, ' ')}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '2px', background: i < currentStep ? 'var(--primary)' : 'var(--surface3)', minWidth: '20px', marginBottom: '20px' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Items */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Items ({order.items?.length || 0})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(order.items || []).map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--surface3)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '52px', height: '52px', background: 'var(--surface2)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                    {categoryEmoji[item.product?.categoryName] || categoryEmoji['Default']}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.2rem' }}>{item.product?.name}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      ₹{Number(item.priceAtOrder).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1rem' }}>
                  ₹{Number(item.subtotal ?? item.priceAtOrder * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Delivery Info */}
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>Delivery Info</h3>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <MapPin color="var(--primary)" size={20} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                  {(order.deliveryType || '').replace(/_/g, ' ')}
                </p>
                {order.deliveryAddress && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{order.deliveryAddress}</p>
                )}
              </div>
            </div>
            {order.scheduledTime && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Clock color="var(--primary)" size={20} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Scheduled Time</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {new Date(order.scheduledTime).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}
            {order.notes && (
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.88rem', borderTop: '1px solid var(--surface3)', paddingTop: '0.75rem' }}>
                📝 {order.notes}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>₹{Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Discount</span>
                <span style={{ color: 'var(--success)' }}>-₹{Number(order.discount || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--surface3)', paddingTop: '0.75rem', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span className="gradient-text">₹{Number(order.finalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {canCancel && (
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleCancel} disabled={cancelling}>
                  <XCircle size={18} /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              {canReturn && (
                <button className="btn btn-secondary" style={{ width: '100%' }}
                  onClick={() => navigate('/returns', { state: { orderId: order.id } })}>
                  <RotateCcw size={18} /> Request Return / Exchange
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
