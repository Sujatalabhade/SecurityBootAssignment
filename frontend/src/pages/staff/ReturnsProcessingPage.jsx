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
      setReturns(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id, approved) => {
    const notes = prompt(`Enter optional notes for this decision:`);
    if (notes === null) return; // user cancelled prompt

    try {
      await processReturn(id, approved, notes);
      toast.success(approved ? 'Return approved' : 'Return rejected');
      fetchReturns();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process return request');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Returns Processing</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {returns.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            No pending returns to process.
          </div>
        ) : (
          returns.map(r => (
            <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="badge badge-info">{r.type}</span>
                  <OrderStatusBadge status={r.status} />
                </div>

                <h3 style={{ marginBottom: '0.5rem' }}>{r.product?.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Order #{r.orderId} | User: {r.userName}
                </p>

                <div style={{ background: 'var(--surface2)', padding: '1rem', borderRadius: '8px', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                  "{r.reason}"
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <button className="btn btn-success" style={{ flex: 1, background: 'var(--success)', color: 'white' }} onClick={() => handleProcess(r.id, true)}>
                  Approve
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleProcess(r.id, false)}>
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
