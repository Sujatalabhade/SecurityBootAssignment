import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, Menu, X, LogOut, Package } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="card" style={{ borderRadius: 0, borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🛒</span>
          <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>D-Mart</span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-nav">
          <Link to="/products" className="btn-ghost" style={{ textDecoration: 'none' }}>Shop</Link>
          
          {isAuthenticated ? (
            <>
              {user?.role !== 'CUSTOMER' && (
                <Link to={user.role === 'ADMIN' ? '/admin' : user.role === 'MANAGER' ? '/manager/reports' : '/staff'} className="btn-ghost" style={{ textDecoration: 'none' }}>
                  Dashboard
                </Link>
              )}
              {user?.role === 'CUSTOMER' && (
                <Link to="/orders" className="btn-ghost" style={{ textDecoration: 'none' }}>
                  My Orders
                </Link>
              )}
              
              <Link to="/cart" className="btn-ghost" style={{ textDecoration: 'none', position: 'relative' }} title="Shopping Cart">
                <ShoppingCart size={20} />
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/profile" className="btn-ghost" style={{ textDecoration: 'none' }} title="My Profile">
                  <User size={20} />
                </Link>
                <button onClick={logout} className="btn btn-ghost" style={{ padding: '0.5rem' }} title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="btn-ghost desktop-hidden" onClick={() => setIsOpen(!isOpen)} style={{ padding: '0.5rem' }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="container animate-slide-up" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/products" onClick={() => setIsOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none' }}>Shop</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setIsOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none' }}>My Orders</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none' }}>Cart</Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none' }}>Profile</Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 0 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} style={{ color: 'var(--text)', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
