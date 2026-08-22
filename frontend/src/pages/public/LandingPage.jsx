import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShoppingBag, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLandingData();
  }, []);

  const fetchLandingData = async () => {
    try {
      const [catData, prodData] = await Promise.all([
        getCategories(),
        getProducts({ page: 0, size: 4 })
      ]);
      setCategories(catData || []);
      setPopularProducts(prodData?.content || []);
    } catch (err) {
      console.error('Failed to load landing page data', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryEmoji = {
    'Fruits & Vegetables': '🥬',
    'Dairy & Eggs': '🥛',
    'Bakery': '🍞',
    'Beverages': '🧃',
    'Snacks & Sweets': '🍪',
    'Personal Care': '🧴',
    'Default': '🛍️'
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Hero Section */}
      <div style={{ padding: '5rem 1rem', textAlign: 'center', background: 'linear-gradient(to bottom, var(--surface2), var(--bg))' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.2, fontWeight: 800 }}>
          Fresh Groceries, <br />
          <span className="gradient-text">Delivered to Your Doorstep</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Experience the premium way of grocery shopping. Sourced directly from farms, delivered straight to your home.
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

      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : (
        <>
          {/* Categories Grid */}
          <div className="container" style={{ padding: '4rem 1rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.2rem', fontWeight: 700 }}>
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
              {categories.map((cat) => (
                <Link key={cat.id} to={`/products?category=${cat.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card card-hover" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                      {categoryEmoji[cat.name] || categoryEmoji['Default']}
                    </div>
                    <h3 style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600 }}>{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Products Grid */}
          {popularProducts.length > 0 && (
            <div style={{ background: 'var(--surface2)', padding: '4rem 1rem' }}>
              <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.2rem', fontWeight: 700 }}>
                  Popular <span className="gradient-text">Products</span>
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  {popularProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                  <Link to="/products" className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Features Section */}
      <div className="container" style={{ padding: '5rem 1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.2rem', fontWeight: 700 }}>
          Why Choose <span className="gradient-text">D-Mart?</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {[
            { icon: <Truck size={36} color="var(--primary)" />, title: 'Superfast Delivery', desc: 'Fresh items delivered to your doorstep within 30 minutes.' },
            { icon: <ShoppingBag size={36} color="var(--accent)" />, title: 'Fresh From Farm', desc: '100% organic and fresh stock sourced from local farmers daily.' },
            { icon: <RotateCcw size={36} color="var(--success)" />, title: 'Easy Returns', desc: 'Return any items within 7 days with a direct money-back policy.' },
            { icon: <ShieldCheck size={36} color="var(--warning)" />, title: 'Quality Assured', desc: 'Rigorous food inspection checks to deliver the best quality.' }
          ].map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 600 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--surface3)', padding: '4rem 1rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem' }}>
          <div>
            <h2 className="gradient-text" style={{ marginBottom: '1rem', fontWeight: 800 }}>D-Mart</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '280px', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Your premium neighborhood online grocery store delivering fresh choices daily.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 600 }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                <Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shop Products</Link>
                <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Sign In</Link>
                <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Create Account</Link>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 600 }}>Customer Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Help Center</span>
                <span style={{ color: 'var(--text-muted)' }}>Contact Us</span>
                <span style={{ color: 'var(--text-muted)' }}>Refund Policy</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Mini D-Mart. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
