import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../api/orders';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Package, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      // data is a List<OrderResponse> (array)
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>📦 My Orders</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Track and manage your orders</p>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start shopping and your orders will appear here.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '56px', height: '56px', background: 'var(--surface2)', borderRadius: '10px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)', flexShrink: 0
                  }}>
                    <Package size={26} />
                  </div>
                  <div>
                    {/* id is a Number — use String() or template literal */}
                    <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Order #{order.id}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Clock size={13} />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {(order.deliveryType || '').replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>
                      ₹{Number(order.finalAmount || 0).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <OrderStatusBadge status={order.status} />
                  <ChevronRight color="var(--text-muted)" size={20} />
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
