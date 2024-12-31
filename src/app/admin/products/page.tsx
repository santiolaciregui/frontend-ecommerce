'use client';
import React, { useState, useEffect } from 'react';
import apiService from "../../pages/api/products";
import { Product } from '@/app/context/types';
import Link from 'next/link';

const AdminList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await apiService.fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (product_id: number) => {
    try {
      setLoading(true);
      await apiService.deleteProductByID({ id: product_id });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== product_id)
      );

      setNotification('Producto eliminado con éxito');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
      setNotification('Error al eliminar el producto');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Lista de Productos</h2>
          <Link
            href="/admin/products/create"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir nuevo producto
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-600 text-sm uppercase font-semibold">
              <tr>
                <th className="text-left px-6 py-3">SKU</th>
                <th className="text-left px-6 py-3">Nombre</th>
                <th className="text-left px-6 py-3">Categoría</th>
                <th className="text-left px-6 py-3">Precio</th>
                <th className="text-center px-6 py-3">Acciones</th>
              </tr>
            </thead>
            {products.length > 0 ? (
              <tbody className="text-gray-700">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 transition duration-300"
                  >
                    <td className="px-6 py-4">{product.SKU}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">
                      {product.Categories.map((category) => category.name).join(
                        ', '
                      )}
                    </td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4 flex justify-center space-x-4">
                      <Link
                        href={`/admin/products/update/${product.id}`}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar"
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id!)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <i className="fas fa-trash-alt mr-2"></i>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="text-gray-700">
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 text-lg"
                  >
                    Aún no hay elementos
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white py-2 px-4 rounded shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default AdminList;
