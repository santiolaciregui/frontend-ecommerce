// AdminDashboard.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '../pages/api/authService';
import { getWhatsAppQRCode, deleteWhatsAppSession } from '../pages/api/whatsapp'; 
import { useEffect, useState } from 'react';
import BackButton from '../components/BackButton'; // Adjust the import path as needed

const AdminDashboard = () => {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Any initialization code here...
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGenerateQR = async () => {
    const confirmGenerate = window.confirm('¿Estás seguro de generar el código QR de WhatsApp?');
    if (!confirmGenerate) return;

    try {
      const data = await getWhatsAppQRCode();
      setQrCode(data.qrCode);
    } catch (error) {
      alert('No se pudo generar el código QR. Verifica que el cliente de WhatsApp esté listo.');
    }
  };

  const handleDeleteSession = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar la sesión de WhatsApp y generar un nuevo QR?');
    if (!confirmDelete) return;

    try {
      await deleteWhatsAppSession();
      alert('Sesión de WhatsApp eliminada. Por favor, genera un nuevo QR.');
      setQrCode(null);
    } catch (error) {
      alert('Error eliminando la sesión de WhatsApp.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto space-y-6 mx-4">

        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          {/* Back Button: 
              - If you want to always go back to a fixed route (e.g., '/home'), pass the destination prop:
                <BackButton destination="/home" />
              - Otherwise, just use the default behavior with no props */}
          <BackButton />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Main Dashboard Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Administración de Inicio */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Inicio</h2>
            <div className="space-y-4">
              <Link
                href="/admin/dashboard"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Administrar Carrusel
              </Link>
            </div>
          </div>
        
          {/* Administración de Productos */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Productos</h2>
            <div className="space-y-4">
              <Link
                href="/admin/products"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Ver Productos
              </Link>
              <Link
                href="/admin/products/create"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Añadir Producto
              </Link>
            </div>
          </div>

          {/* Administración de Categorías */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Categorías</h2>
            <div className="space-y-4">
              <Link
                href="/admin/categories"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Ver Categorías
              </Link>
              <Link
                href="/admin/categories/create"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Añadir Categoría
              </Link>
            </div>
          </div>

          {/* Administración de Opciones */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Opciones de Productos</h2>
            <div className="space-y-4">
              <Link
                href="/admin/options"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Ver Opciones
              </Link>
            </div>
          </div>

          {/* Administración de Descuentos */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Descuentos</h2>
            <div className="space-y-4">
              <Link
                href="/admin/discount"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Ver Descuentos
              </Link>
              <Link
                href="/admin/discount/create"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Añadir Descuento
              </Link>
            </div>
          </div>

          {/* Administración de Órdenes */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Órdenes</h2>
            <div className="space-y-4">
              <Link
                href="/admin/orders"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Ver Órdenes de Compra
              </Link>
            </div>
          </div>

          {/* Administración de Locales */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Locales</h2>
            <div className="space-y-4">
              <Link
                href="/admin/stores"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Ver Locales
              </Link>
              <Link
                href="/admin/stores/create"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Añadir Local
              </Link>
            </div>
          </div>

           {/* Administración de WhatsApp */}
           <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de WhatsApp</h2>
            <div className="space-y-4">
              <button
                onClick={handleGenerateQR}
                className="block w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Generar QR
              </button>
              <button
                onClick={handleDeleteSession}
                className="block w-full text-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Eliminar Sesión
              </button>
              {qrCode && (
                <div className="mt-4">
                  <p className="mb-2 font-semibold">Código QR:</p>
                  <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64 object-contain border" />
                </div>
              )}
            </div>
          </div>
          {/* Administración de Medios de Pago */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Administración de Medios de Pago</h2>
            <div className="space-y-4">
              <Link
                href="/admin/paymentFormats"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Ver Medios de Pago
              </Link>
              
            </div>
          </div>

          {/* Administración de Reseñas de Clientes */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Reseñas de Clientes</h2>
            <div className="space-y-4">
              <Link
                href="/admin/reviews"
                className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Administrar Reseñas
              </Link>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;