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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', '@media(minWidth: 768px)': { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } }}>
                
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                    <Package size={30} />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem' }}>Order #{order.id.slice(0, 8)}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', '@media(minWidth: 768px)': { alignItems: 'flex-end' } }}>
                  <OrderStatusBadge status={order.status} />
                  <div style={{ fontWeight: 'bold' }}>₹{order.totalAmount} • {order.items.length} items</div>
                </div>
                
                <div style={{ display: 'none', '@media(minWidth: 768px)': { display: 'block' } }}>
                  <ChevronRight color="var(--text-muted)" />
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
