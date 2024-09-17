// pages/admin.tsx
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminPage;
