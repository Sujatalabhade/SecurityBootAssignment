import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, CreditCard } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ padding: '4rem 1rem', textAlign: 'center', background: 'linear-gradient(to bottom, var(--surface2), var(--bg))' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          Fresh Groceries, <br />
          <span className="gradient-text">Delivered to Your Door</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Experience the premium way of grocery shopping. Get farm-fresh products delivered within minutes.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Shop Now
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Sign In
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          {['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Snacks', 'Beverages'].map((cat, i) => (
            <Link key={cat} to={`/products?category=${cat}`} style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {['🥬', '🍎', '🥛', '🍞', '🍪', '🧃'][i]}
                </div>
                <h3 style={{ color: 'var(--text)' }}>{cat}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface2)', padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Why D-Mart?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Truck size={32} color="var(--primary)" />, title: 'Fast Delivery', desc: 'Get your groceries delivered in 30 minutes.' },
              { icon: <ShoppingBag size={32} color="var(--accent)" />, title: 'Fresh Products', desc: 'Sourced directly from local farms daily.' },
              { icon: <RotateCcw size={32} color="var(--success)" />, title: 'Easy Returns', desc: 'No questions asked return policy.' },
              { icon: <ShieldCheck size={32} color="var(--warning)" />, title: 'Secure Payments', desc: '100% secure payment gateways.' }
            ].map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background: 'var(--surface3)', padding: '3rem 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>D-Mart</h2>
            <p style={{ color: 'var(--text-muted)' }}>Premium grocery shopping experience.</p>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shop</Link>
                <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Login</Link>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Privacy Policy</span>
                <span style={{ color: 'var(--text-muted)' }}>Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { RotateCcw } from 'lucide-react';
export default LandingPage;
