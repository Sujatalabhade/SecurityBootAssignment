import React, { useState, useEffect } from 'react';
import { getInventory, updateStock } from '../../api/manager';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Package, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // getInventory returns a PageResponse: { content, page, size, totalElements, totalPages }
      const data = await getInventory({ page: 0, size: 100 });
      setProducts(data?.content || []);
    } catch (err) {
      toast.error('Failed to load inventory');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (id, currentStock) => {
    const qty = prompt('Enter quantity to ADD to stock:', '10');
    if (!qty || isNaN(qty)) return;

    try {
      await updateStock({ productId: id, quantity: parseInt(qty), notes: 'Restock via dashboard' });
      toast.success('Stock updated');
      fetchInventory();
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  if (loading) return <LoadingSpinner />;

  const filtered = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Inventory Management</h1>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          className="input"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No products found</td></tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--surface3)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Package size={20} />
                    </div>
                    {p.name}
                  </td>
                  <td style={{ padding: '1rem' }}>{p.categoryName}</td>
                  <td style={{ padding: '1rem' }}>₹{Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${(p.stockQty ?? 0) <= 5 ? 'badge-error' : (p.stockQty ?? 0) <= 20 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stockQty ?? 0} in stock
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleStockUpdate(p.id, p.stockQty)}>
                      Restock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
