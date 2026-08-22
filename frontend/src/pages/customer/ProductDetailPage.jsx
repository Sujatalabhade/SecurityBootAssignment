import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../api/products';
import { addToCart } from '../../api/cart';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShoppingCart, ArrowLeft, Package, Truck, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryEmoji = {
  'Vegetables': '🥬',
  'Fruits': '🍎',
  'Dairy': '🥛',
  'Bakery': '🍞',
  'Snacks': '🍪',
  'Beverages': '🧃',
  'Meat': '🥩',
  'Default': '🛍️'
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stockQuantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return null;

  const outOfStock = product.stockQuantity <= 0;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back to Products
      </button>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', '@media(minWidth: 768px)': { gridTemplateColumns: '1fr 1fr' } }}>
        <div style={{ background: 'var(--surface2)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', fontSize: '8rem' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
          ) : (
            categoryEmoji[product.category] || categoryEmoji['Default']
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '1rem' }}>{product.category}</span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{product.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
              {product.description || 'Premium quality fresh product sourced directly for you.'}
            </p>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>₹{product.mrp}</span>
              )}
              {product.mrp && product.mrp > product.price && (
                <span className="badge badge-success">Save ₹{product.mrp - product.price}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} color={outOfStock ? 'var(--error)' : 'var(--success)'} />
              <span style={{ color: outOfStock ? 'var(--error)' : 'var(--success)', fontWeight: 500 }}>
                {outOfStock ? 'Out of Stock' : `${product.stockQuantity} units available`}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface3)', borderRadius: '8px' }}>
                <button className="btn btn-ghost" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={outOfStock}>-</button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                <button className="btn btn-ghost" onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))} disabled={outOfStock || quantity >= product.stockQuantity}>+</button>
              </div>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart} disabled={outOfStock}>
                <ShoppingCart size={20} /> {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Truck color="var(--primary)" size={24} />
              <span style={{ fontSize: '0.9rem' }}>Fast Delivery Available</span>
            </div>
            <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <RotateCcw color="var(--primary)" size={24} />
              <span style={{ fontSize: '0.9rem' }}>Easy Return Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
