'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { logout } from '../pages/api/authService';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto space-y-6 mx-4">

        {/* Logout Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Show 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Administración de Productos */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Productos</h2>
            <div className="space-y-4">
              <Link href="/admin/products" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Ver Productos
              </Link>
              <Link href="/admin/products/create" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Añadir Producto
              </Link>
            </div>
          </div>

          {/* Administración de Categorías */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Categorías</h2>
            <div className="space-y-4">
              <Link href="/admin/categories" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Ver Categorías
              </Link>
              <Link href="/admin/categories/create" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Añadir Categoría
              </Link>
            </div>
          </div>

          {/* Administración de Opciones */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Opciones de Productos</h2>
            <div className="space-y-4">
              <Link href="/admin/options" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Ver Opciones
              </Link>
            </div>
          </div>

          {/* Administración de Descuentos */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Descuentos</h2>
            <div className="space-y-4">
              <Link href="/admin/discount" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Ver Descuentos
              </Link>
              <Link href="/admin/discount/create" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Añadir Descuento
              </Link>
            </div>
          </div>

          {/* Administración de Promociones */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Promociones</h2>
            <div className="space-y-4">
              <Link href="/admin/promotions" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Ver Promociones
              </Link>
              <Link href="/admin/promotions/create" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Añadir Promoción
              </Link>
            </div>
          </div>

          {/* Administración de Órdenes */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Órdenes</h2>
            <div className="space-y-4">
              <Link href="/admin/orders" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Ver Órdenes de Compra
              </Link>
            </div>
          </div>

          {/* Administración de Locales */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Locales</h2>
            <div className="space-y-4">
              <Link href="/admin/stores" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Ver Locales
              </Link>
              <Link href="/admin/stores/create" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Añadir Local
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
