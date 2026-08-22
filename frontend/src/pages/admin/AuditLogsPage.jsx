import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Audit Logs</h1>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Timestamp</th>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Action</th>
              <th style={{ padding: '1rem' }}>Entity</th>
              <th style={{ padding: '1rem' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No logs found</td></tr>
            ) : (
              logs.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--surface3)' }}>
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{new Date(l.timestamp).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{l.userEmail || 'System'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-default">{l.action}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{l.entityType} ({l.entityId})</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{l.ipAddress}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsPage;
