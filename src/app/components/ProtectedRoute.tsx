'use client'
import React from 'react';
import useAuth from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null; // O puedes mostrar un mensaje o redirigir, pero el hook ya lo hace
  }

  return <>{children}</>;
};

export default ProtectedRoute;
