import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../api/products';
import { addToCart } from '../../api/cart';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShoppingCart, ArrowLeft, Package, Truck, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryEmoji = {
  'Fruits & Vegetables': '🥬',
  'Dairy & Eggs': '🥛',
  'Bakery': '🍞',
  'Beverages': '🧃',
  'Snacks & Sweets': '🍪',
  'Personal Care': '🧴',
  'Fruits': '🍎',
  'Vegetables': '🥕',
  'Dairy': '🧀',
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
    if ((product.stockQty ?? 0) < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity });
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return null;

  const outOfStock = (product.stockQty ?? 0) <= 0;
  const emoji = categoryEmoji[product.categoryName] || categoryEmoji['Default'];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media(minWidth: 768px)': { gridTemplateColumns: '1fr 1fr' } }}>
        <div style={{
          background: 'var(--surface2)', borderRadius: '12px', display: 'flex',
          justifyContent: 'center', alignItems: 'center', minHeight: '320px',
          fontSize: '7rem', overflow: 'hidden'
        }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <span style={{ display: product.imageUrl ? 'none' : 'flex' }}>{emoji}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>{product.categoryName}</span>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 750 }}>{product.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              {product.description || 'Premium quality fresh product sourced directly for you.'}
            </p>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{Number(product.price).toFixed(2)}</span>
              {product.mrp && product.mrp > product.price && (
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem' }}>₹{Number(product.mrp).toFixed(2)}</span>
              )}
              {product.mrp && product.mrp > product.price && (
                <span className="badge badge-success">Save ₹{Number(product.mrp - product.price).toFixed(2)}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} color={outOfStock ? 'var(--error)' : 'var(--success)'} />
              <span style={{ color: outOfStock ? 'var(--error)' : 'var(--success)', fontWeight: 500, fontSize: '0.95rem' }}>
                {outOfStock ? 'Out of Stock' : `${product.stockQty} ${product.unit || 'units'} available`}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface3)', borderRadius: '8px' }}>
                <button className="btn btn-ghost" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={outOfStock}>-</button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                <button className="btn btn-ghost" onClick={() => setQuantity(q => Math.min(product.stockQty, q + 1))} disabled={outOfStock || quantity >= product.stockQty}>+</button>
              </div>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart} disabled={outOfStock}>
                <ShoppingCart size={18} /> {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Truck color="var(--primary)" size={22} />
              <span style={{ fontSize: '0.85rem' }}>Superfast Delivery</span>
            </div>
            <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RotateCcw color="var(--primary)" size={22} />
              <span style={{ fontSize: '0.85rem' }}>7-day Easy Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
