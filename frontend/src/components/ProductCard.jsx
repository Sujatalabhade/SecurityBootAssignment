import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '../api/cart';
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

const ProductCard = ({ product }) => {
  const outOfStock = product.stockQuantity <= 0;
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (outOfStock) return;
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
          <span className="badge badge-default">{product.category}</span>
        </div>
        
        <div style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4rem', background: 'var(--surface2)', borderRadius: '8px', marginBottom: '1rem' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            categoryEmoji[product.category] || categoryEmoji['Default']
          )}
        </div>
        
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', flex: 1 }}>{product.name}</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹{product.mrp}</span>
            )}
          </div>
        </div>

        <button 
          className={`btn ${outOfStock ? 'btn-secondary' : 'btn-primary'}`} 
          style={{ width: '100%' }}
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? 'Out of Stock' : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
