'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminAuthStatus } from '../utils/auth';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAdmin = await getAdminAuthStatus();
      if (!isAdmin) {
        router.push('/login'); // Redirige si no está autenticado
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) return <div>Cargando...</div>;

  return isAuthenticated ? <AdminDashboard /> : null;
};

export default AdminPage;
