import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../../api/cart';
import { placeOrder } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Store, Clock, Home, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState('HOME_DELIVERY');
  const [address, setAddress] = useState(user?.address || '');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      if (!data || !data.items || data.items.length === 0) {
        toast.error('Cart is empty');
        navigate('/cart');
      }
      setCart(data);
    } catch (err) {
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (deliveryType === 'HOME_DELIVERY' && !address.trim()) {
      toast.error('Please provide a delivery address');
      return;
    }
    if (deliveryType === 'SCHEDULED_PICKUP' && !scheduledTime) {
      toast.error('Please select a pickup time');
      return;
    }

    setPlacingOrder(true);
    try {
      const payload = {
        deliveryType,
        deliveryAddress: deliveryType === 'HOME_DELIVERY' ? address : null,
        scheduledTime: deliveryType === 'SCHEDULED_PICKUP' ? scheduledTime : null
      };
      
      const order = await placeOrder(payload);
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const subtotal = cart?.items?.reduce((sum, item) =>
    sum + Number(item.subtotal ?? (item.product?.price * item.quantity) ?? 0), 0) || 0;
  const deliveryFee = deliveryType === 'HOME_DELIVERY' ? 50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media(minWidth: 992px)': { gridTemplateColumns: '2fr 1fr' } }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Select Delivery Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              
              <div 
                className={`card ${deliveryType === 'STORE_PICKUP' ? 'card-hover' : ''}`} 
                style={{ cursor: 'pointer', border: deliveryType === 'STORE_PICKUP' ? '2px solid var(--primary)' : '1px solid var(--border)', background: deliveryType === 'STORE_PICKUP' ? 'rgba(108, 99, 255, 0.1)' : 'var(--surface2)' }}
                onClick={() => setDeliveryType('STORE_PICKUP')}
              >
                <Store size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <h4>Store Pickup</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pick up immediately</p>
                {deliveryType === 'STORE_PICKUP' && <CheckCircle size={20} color="var(--primary)" style={{ position: 'absolute', top: '1rem', right: '1rem' }} />}
              </div>
              
              <div 
                className={`card ${deliveryType === 'SCHEDULED_PICKUP' ? 'card-hover' : ''}`} 
                style={{ cursor: 'pointer', border: deliveryType === 'SCHEDULED_PICKUP' ? '2px solid var(--primary)' : '1px solid var(--border)', background: deliveryType === 'SCHEDULED_PICKUP' ? 'rgba(108, 99, 255, 0.1)' : 'var(--surface2)' }}
                onClick={() => setDeliveryType('SCHEDULED_PICKUP')}
              >
                <Clock size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <h4>Scheduled Pickup</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Choose a time</p>
                {deliveryType === 'SCHEDULED_PICKUP' && <CheckCircle size={20} color="var(--primary)" style={{ position: 'absolute', top: '1rem', right: '1rem' }} />}
              </div>
              
              <div 
                className={`card ${deliveryType === 'HOME_DELIVERY' ? 'card-hover' : ''}`} 
                style={{ cursor: 'pointer', border: deliveryType === 'HOME_DELIVERY' ? '2px solid var(--primary)' : '1px solid var(--border)', background: deliveryType === 'HOME_DELIVERY' ? 'rgba(108, 99, 255, 0.1)' : 'var(--surface2)' }}
                onClick={() => setDeliveryType('HOME_DELIVERY')}
              >
                <Home size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <h4>Home Delivery</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Delivered to you (+₹50)</p>
                {deliveryType === 'HOME_DELIVERY' && <CheckCircle size={20} color="var(--primary)" style={{ position: 'absolute', top: '1rem', right: '1rem' }} />}
              </div>
              
            </div>
          </div>

          {deliveryType === 'HOME_DELIVERY' && (
            <div className="card animate-slide-up">
              <h3 style={{ marginBottom: '1.5rem' }}>Delivery Address</h3>
              <textarea 
                className="input" 
                rows={4} 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full delivery address..."
              ></textarea>
            </div>
          )}

          {deliveryType === 'SCHEDULED_PICKUP' && (
            <div className="card animate-slide-up">
              <h3 style={{ marginBottom: '1.5rem' }}>Pickup Time</h3>
              <input 
                type="datetime-local" 
                className="input" 
                value={scheduledTime} 
                onChange={(e) => setScheduledTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Payment Method</h3>
            <div className="badge badge-success" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              <CheckCircle size={20} /> Pay on Delivery / Pickup
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              For demo purposes, online payment is bypassed. You will pay when you receive the items.
            </p>
          </div>
          
        </div>
        
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Order Summary</h3>
            
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cart.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.product?.name}</span>
                  <span>₹{Number(item.subtotal ?? (item.product?.price * item.quantity) ?? 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
              <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span className="gradient-text">₹{total}</span>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handlePlaceOrder} disabled={placingOrder}>
              {placingOrder ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
