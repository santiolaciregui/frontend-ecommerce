'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard1 from '../components/AdminDashboard1';

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();


  return <AdminDashboard1 /> 
};

export default AdminPage;
