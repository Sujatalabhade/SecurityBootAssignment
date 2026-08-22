import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../../api/cart';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(id, qty);
      fetchCart();
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeCartItem(id);
      toast.success('Item removed');
      fetchCart();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <div className="card animate-slide-up" style={{ textAlign: 'center', padding: '4rem', maxWidth: '500px', width: '100%' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
          <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media(minWidth: 992px)': { gridTemplateColumns: '2fr 1fr' } }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.items.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem' }}>
                {item.product.category === 'Vegetables' ? '🥬' : item.product.category === 'Fruits' ? '🍎' : '🛍️'}
              </div>
              
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item.product.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.product.name}</h3>
                </Link>
                <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>₹{item.product.price}</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface2)', borderRadius: '8px' }}>
                <button className="btn btn-ghost" style={{ padding: '0.5rem' }} onClick={() => handleUpdate(item.id, item.quantity - 1)}>-</button>
                <span style={{ width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                <button className="btn btn-ghost" style={{ padding: '0.5rem' }} onClick={() => handleUpdate(item.id, item.quantity + 1)}>+</button>
              </div>
              
              <div style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                ₹{item.product.price * item.quantity}
              </div>
              
              <button className="btn btn-ghost" style={{ color: 'var(--error)' }} onClick={() => handleRemove(item.id)}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal ({cart.items.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Tax</span>
              <span>₹{Math.round(subtotal * 0.05)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span className="gradient-text">₹{subtotal + Math.round(subtotal * 0.05)}</span>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
