import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/auth';
import { User, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await updateProfile(formData);
      setUser({ ...updatedUser, token: user.token });
      toast.success('Profile updated successfully! 🎉');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontWeight: 800 }}>My Profile</h1>
        {!isEditing && (
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="card">
        {/* Avatar banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ 
            width: '90px', height: '90px', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            borderRadius: '50%', display: 'flex', justifyContent: 'center', 
            alignItems: 'center', fontSize: '2.5rem', color: 'white', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(108, 99, 255, 0.3)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ marginBottom: '0.25rem', fontSize: '1.5rem', fontWeight: 700 }}>{user?.name}</h2>
            <div className="badge badge-info">{user?.role}</div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  className="input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ paddingLeft: '2.75rem' }}
                />
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  className="input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="Enter phone number"
                />
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                Delivery Address
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  name="address"
                  className="input"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="Enter your address"
                />
                <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                {saving ? (
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsEditing(false)} disabled={saving}>
                <X size={18} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', background: 'var(--surface2)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)', border: '1px solid var(--border-light)' }}>
                <User size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</div>
                <div style={{ fontSize: '1.05rem', marginTop: '0.15rem' }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', background: 'var(--surface2)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)', border: '1px solid var(--border-light)' }}>
                <Phone size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</div>
                <div style={{ fontSize: '1.05rem', marginTop: '0.15rem' }}>{user?.phone || 'Not provided'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', background: 'var(--surface2)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)', border: '1px solid var(--border-light)' }}>
                <MapPin size={18} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Address</div>
                <div style={{ fontSize: '1.05rem', marginTop: '0.15rem', lineHeight: 1.4 }}>{user?.address || 'Not provided'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
