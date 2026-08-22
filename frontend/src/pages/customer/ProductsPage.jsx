import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, category]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      
      const newParams = new URLSearchParams(params);
      setSearchParams(newParams);

      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Filters Header */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', '@media(minWidth: 768px)': { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <button 
              className={`badge ${category === '' ? 'badge-info' : 'badge-default'}`} 
              onClick={() => setCategory('')}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button 
                key={c}
                className={`badge ${category === c ? 'badge-info' : 'badge-default'}`} 
                onClick={() => setCategory(c)}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="card skeleton" style={{ height: '350px' }}></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => {setSearchTerm(''); setCategory('');}}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
