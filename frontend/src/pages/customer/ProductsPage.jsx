import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(0);
      fetchProducts(0);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, category]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      // data is an array of CategoryResponse objects
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchProducts = async (page = currentPage) => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (searchTerm) params.search = searchTerm;
      if (category) params.categoryId = category;

      const newParams = {};
      if (searchTerm) newParams.search = searchTerm;
      if (category) newParams.category = category;
      setSearchParams(newParams);

      // data is a PageResponse: { content, page, size, totalElements, totalPages }
      const data = await getProducts(params);
      setProducts(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch products', err);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Page Title */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            🛍️ <span className="gradient-text">All Products</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Fresh groceries delivered to your door</p>
        </div>

        {/* Filters */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '500px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`badge ${category === '' ? 'badge-info' : 'badge-default'}`}
              onClick={() => setCategory('')}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: 'none' }}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`badge ${category === String(c.id) ? 'badge-info' : 'badge-default'}`}
                onClick={() => setCategory(String(c.id))}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="card skeleton" style={{ height: '320px' }}></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{products.length} products shown</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`btn ${currentPage === i ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '40px', padding: '0.5rem' }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try adjusting your search or filters.</p>
            <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setCategory(''); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
