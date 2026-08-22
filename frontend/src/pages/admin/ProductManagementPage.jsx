import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../../api/products';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    categoryId: '',
    name: '',
    description: '',
    price: '',
    mrp: '',
    stockQty: 0,
    unit: 'Kg',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        getProducts({ page: 0, size: 100 }),
        getCategories()
      ]);
      setProducts(prodData?.content || []);
      setCategories(catData || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setFormData({
        id: product.id,
        categoryId: String(product.categoryId),
        name: product.name,
        description: product.description || '',
        price: product.price,
        mrp: product.mrp,
        stockQty: product.stockQty || 0,
        unit: product.unit || 'Kg',
        imageUrl: product.imageUrl || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        categoryId: categories[0]?.id ? String(categories[0].id) : '',
        name: '',
        description: '',
        price: '',
        mrp: '',
        stockQty: 0,
        unit: 'Kg',
        imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
      mrp: Number(formData.mrp || formData.price),
      stockQty: Number(formData.stockQty)
    };

    try {
      if (isEditing) {
        await api.put(`/admin/products/${formData.id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Product Management</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No products found</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--surface3)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.name}</td>
                  <td style={{ padding: '1rem' }}>{p.categoryName}</td>
                  <td style={{ padding: '1rem' }}>₹{Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{p.stockQty} {p.unit}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--info)' }} onClick={() => openModal(p)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--error)' }} onClick={() => handleDelete(p.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Product' : 'New Product'}</h2>

            <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                <select className="select" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required>
                  <option value="">-- Choose Category --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price (₹)</label>
                  <input type="number" step="0.01" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>MRP (₹)</label>
                  <input type="number" step="0.01" className="input" value={formData.mrp || ''} onChange={e => setFormData({...formData, mrp: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Stock Quantity</label>
                  <input type="number" className="input" value={formData.stockQty} onChange={e => setFormData({...formData, stockQty: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Unit</label>
                  <input type="text" className="input" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} required placeholder="e.g. Kg, Pcs, Packet" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL</label>
                <input type="url" className="input" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea className="input" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
