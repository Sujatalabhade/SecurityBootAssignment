import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Package, ShoppingBag, ClipboardList, RotateCcw, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user || user.role === 'CUSTOMER') return null;

  const links = [];

  if (user.role === 'STAFF' || user.role === 'MANAGER' || user.role === 'ADMIN') {
    links.push({ to: '/staff', icon: <LayoutDashboard size={20} />, label: 'Staff Dashboard' });
    links.push({ to: '/staff/orders', icon: <ClipboardList size={20} />, label: 'Order Queue' });
  }

  if (user.role === 'STAFF' || user.role === 'ADMIN') {
    links.push({ to: '/staff/pickup', icon: <ShoppingBag size={20} />, label: 'Pickups' });
    links.push({ to: '/staff/returns', icon: <RotateCcw size={20} />, label: 'Returns' });
  }

  if (user.role === 'MANAGER' || user.role === 'ADMIN') {
    links.push({ to: '/manager/inventory', icon: <Package size={20} />, label: 'Inventory' });
    links.push({ to: '/manager/reports', icon: <BarChart2 size={20} />, label: 'Reports' });
  }

  if (user.role === 'ADMIN') {
    links.push({ to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Admin Dashboard' });
    links.push({ to: '/admin/users', icon: <Users size={20} />, label: 'Users' });
    links.push({ to: '/admin/products', icon: <Package size={20} />, label: 'Products' });
    links.push({ to: '/admin/audit-logs', icon: <ClipboardList size={20} />, label: 'Audit Logs' });
  }

  return (
    <div className="card sidebar" style={{ borderRadius: 0, padding: '1rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/staff' || link.to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1.5rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
              textDecoration: 'none',
              borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all 0.2s ease'
            })}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
