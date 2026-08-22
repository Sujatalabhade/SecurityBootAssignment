import React, { useState, useEffect } from 'react';
import { getPendingReturns, processReturn } from '../../api/staff';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ReturnsProcessingPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const data = await getPendingReturns();
      setReturns(data);
    } catch (err) {
      toast.error('Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id, status) => {
    const notes = prompt(`Enter notes for ${status.toLowerCase()}:`);
    if (notes === null) return;
    
    try {
      await processReturn(id, { status, staffNotes: notes });
      toast.success('Return processed');
      fetchReturns();
    } catch (err) {
      toast.error('Failed to process');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Returns Processing</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {returns.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            No pending returns to process.
          </div>
        ) : (
          returns.map(r => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-info">{r.type}</span>
                <OrderStatusBadge status={r.status} />
              </div>
              
              <h3 style={{ marginBottom: '0.5rem' }}>{r.product.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Order #{r.order.id.slice(0,8)} | User: {r.user.name}
              </p>
              
              <div style={{ background: 'var(--surface2)', padding: '1rem', borderRadius: '8px', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "{r.reason}"
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-success" style={{ flex: 1, background: 'var(--success)', color: 'white' }} onClick={() => handleProcess(r.id, 'RETURN_APPROVED')}>
                  Approve
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleProcess(r.id, 'REJECTED')}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReturnsProcessingPage;
