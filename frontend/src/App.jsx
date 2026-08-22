import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ReturnsPage from './pages/customer/ReturnsPage';
import ProfilePage from './pages/customer/ProfilePage';
import StaffDashboard from './pages/staff/StaffDashboard';
import OrderQueuePage from './pages/staff/OrderQueuePage';
import PickupSchedulePage from './pages/staff/PickupSchedulePage';
import ReturnsProcessingPage from './pages/staff/ReturnsProcessingPage';
import InventoryPage from './pages/manager/InventoryPage';
import ReportsPage from './pages/manager/ReportsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const authOnlyPaths = ['/login', '/register'];
  const showNav = !authOnlyPaths.includes(location.pathname);
  const showSidebar = user && user.role !== 'CUSTOMER' &&
    location.pathname !== '/' &&
    !location.pathname.startsWith('/products') &&
    !authOnlyPaths.includes(location.pathname);

  return (
    <div className="page-wrapper">
      {showNav && <Navbar />}
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {showSidebar && <Sidebar />}
        
        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* Customer/Shared Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Staff Routes */}
            <Route element={<ProtectedRoute roles={['STAFF', 'MANAGER', 'ADMIN']} />}>
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/orders" element={<OrderQueuePage />} />
              <Route path="/staff/pickup" element={<PickupSchedulePage />} />
              <Route path="/staff/returns" element={<ReturnsProcessingPage />} />
            </Route>

            {/* Manager Routes */}
            <Route element={<ProtectedRoute roles={['MANAGER', 'ADMIN']} />}>
              <Route path="/manager/inventory" element={<InventoryPage />} />
              <Route path="/manager/reports" element={<ReportsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/products" element={<ProductManagementPage />} />
              <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
