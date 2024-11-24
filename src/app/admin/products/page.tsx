'use client';
import React, { useState, useEffect } from 'react';
import apiService, { fetchAllProducts } from "../../pages/api/products";
import { Product, Category, Discount, Option } from '@/app/context/types';
import Link from 'next/link';

const AdminList = () => { 
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<string | null>(null); // Para el mensaje flotante

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await apiService.fetchAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Error fetching products');
        console.error(err);
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
      
      // Actualiza la lista eliminando el producto
      setProducts(prevProducts => prevProducts.filter(product => product.id !== product_id));
      
      // Muestra el mensaje flotante
      setNotification('Producto eliminado con éxito');
      
      // Oculta el mensaje después de 3 segundos
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification('Error al eliminar el producto');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Lista de Productos</h2>
          <Link 
              href='/admin/products/create' className="w-36 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
          >
              Añadir Producto
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-4 border-b">SKU</th>
                <th className="px-6 py-4 border-b">Nombre</th>
                <th className="px-6 py-4 border-b">Categoría</th>
                <th className="px-6 py-4 border-b">Precio</th>
                <th className="px-6 py-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 border-b">{product.SKU}</td>
                  <td className="px-6 py-4 border-b">{product.name}</td>
                  <td className="px-6 py-4 border-b">
                    {product.Categories.map(category => category.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 border-b">${product.price}</td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Contenedor para el mensaje flotante */}
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded shadow-md">
          {notification}
        </div>
      )}
    </div>
  );
};

export default AdminList;
