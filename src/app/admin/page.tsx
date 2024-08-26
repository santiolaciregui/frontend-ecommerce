'use client';
import Link from 'next/link';

const AdminMenu = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

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

          {/* Administración de Ordenes */}
          <div className="border rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Administración de Ordenes</h2>
          <div className="space-y-4">
            <Link href="/admin/orders" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Ver Ordenes de Compra
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
