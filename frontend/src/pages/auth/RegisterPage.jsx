import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join D-Mart for premium groceries</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
            <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} required placeholder="••••••••" minLength={6} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone Number</label>
            <input type="tel" name="phone" className="input" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Delivery Address</label>
            <textarea name="address" className="input" value={formData.address} onChange={handleChange} placeholder="Full address for delivery" rows={3} />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : <><UserPlus size={20} /> Sign Up</>}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
