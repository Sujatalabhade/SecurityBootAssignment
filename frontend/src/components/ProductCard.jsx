import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '../api/cart';
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
  'Default': '🛍️',
};

const StockBadge = ({ qty }) => {
  if (qty <= 0) return <span className="badge badge-error" style={{ background: '#2c1414', border: '1px solid #ef4444' }}>Out of Stock</span>;
  if (qty <= 10) return <span className="badge badge-warning" style={{ background: '#2c2214', border: '1px solid #f59e0b' }}>Low Stock</span>;
  return <span className="badge badge-success" style={{ background: '#142c1c', border: '1px solid #22c55e', color: '#4ade80' }}>In Stock</span>;
};

const ProductCard = ({ product }) => {
  const outOfStock = (product.stockQty ?? 0) <= 0;
  const emoji = categoryEmoji[product.categoryName] || categoryEmoji['Default'];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
    }
  };

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="card card-hover"
        style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', padding: '1rem' }}
      >
        {/* Discount badge */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 10,
            background: '#ef4444', color: 'white', borderRadius: '6px',
            padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}>
            -{discount}%
          </div>
        )}

        {/* Image / Emoji */}
        <div style={{
          height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '4rem', background: 'var(--surface2)', borderRadius: '8px',
          marginBottom: '1rem', overflow: 'hidden', position: 'relative'
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

        {/* Category label & Stock badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {product.categoryName}
          </span>
          <StockBadge qty={product.stockQty} />
        </div>

        {/* Name */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', flex: 1, lineHeight: 1.3, color: 'var(--text)' }}>
          {product.name}
        </h3>

        {/* Unit */}
        {product.unit && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            per {product.unit}
          </p>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>
            ₹{Number(product.price).toFixed(2)}
          </span>
          {discount > 0 && (
            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ₹{Number(product.mrp).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          className={`btn ${outOfStock ? 'btn-secondary' : 'btn-primary'}`}
          style={{ width: '100%', fontSize: '0.9rem' }}
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? 'Out of Stock' : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
