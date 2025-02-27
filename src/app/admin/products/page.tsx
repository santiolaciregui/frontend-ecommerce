'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiService from "../../pages/api/products";
import { Product } from '@/app/context/types';
import Link from 'next/link';
import BackButton from '@/app/components/BackButton';

const AdminList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Función para obtener productos con paginación y filtrado de duplicados
  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    try {
      // Se solicita un límite de 9 productos por página (ajusta según sea necesario)
      const newProducts: Product[] = await apiService.fetchProducts({ 
        categoryId: null,
        subcategoryId: null,
        limit: 3,
        page: pageNumber
      });
      
      // Si no se retornan productos, se asume que ya no hay más
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prevProducts => {
          // Crear un Set con los IDs de los productos ya cargados
          const existingProductIds = new Set(prevProducts.map(p => p.id));
          // Filtrar solo aquellos productos que aún no se han mostrado
          const uniqueNewProducts = newProducts.filter(p => !existingProductIds.has(p.id));
          return [...prevProducts, ...uniqueNewProducts];
        });
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos cada vez que la página cambie
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Manejador para eliminación de productos (sin cambios)
  const handleDelete = async (product_id: number) => {
    try {
      setLoading(true);
      await apiService.deleteProductByID({ id: product_id });
      setProducts(prevProducts => prevProducts.filter(product => product.id !== product_id));
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

  // Usamos useCallback para observar el último elemento renderizado
  const lastProductElementRef = useCallback((node: HTMLTableRowElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <BackButton destination="/admin" />
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
                {products.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <tr className="border-b hover:bg-gray-50 transition duration-300">
                      <td className="px-6 py-4">{product.SKU}</td>
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">
                        {product.Categories.map(category => category.name).join(', ')}
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
                    {/* Referencia al último elemento para activar el scroll infinito */}
                    {index === products.length - 1 && (
                      <tr ref={lastProductElementRef}>
                        <td colSpan={5} className="text-center py-4">
                          {loading && 'Cargando...'}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
