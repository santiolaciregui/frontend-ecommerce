'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiService from "../../pages/api/products";
import { Product } from '@/app/context/types';
import Link from 'next/link';
import BackButton from '@/app/components/BackButton';
import { ReactSortable } from 'react-sortablejs';
import Sortable from 'sortablejs';

const AdminList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Manejador para cuando se completa el arrastre
  const handleDragEnd = async () => {
    try {
      setLoading(true);
      // Extraer solo los IDs de los productos en el nuevo orden actualizado
      const productIds = products.map(product => product.id!);
      // Enviar el nuevo orden al servidor
      await apiService.updateProductsOrder(productIds);
      setNotification('Orden de productos actualizado con éxito');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error al actualizar el orden de productos:', err);
      setNotification('Error al actualizar el orden de productos');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (!isDragging) {
      handleDragEnd();
    }
  }, [isDragging]);

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
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="grid grid-cols-6 gap-4 bg-gray-200 text-gray-600 text-sm uppercase font-semibold p-3 rounded-t-lg">
              <div className="col-span-1">SKU</div>
              <div className="col-span-1">Nombre</div>
              <div className="col-span-1">Categoría</div>
              <div className="col-span-1">Precio</div>
              <div className="col-span-2 text-center">Acciones</div>
            </div>
            
            {products.length > 0 ? (
              <ReactSortable
                list={products as any[]}
                setList={setProducts}
                animation={200}
                delayOnTouchOnly={true}
                delay={2}
                handle=".drag-handle"
                onStart={() => setIsDragging(true)}
                onEnd={() => setIsDragging(false)}
                className="text-gray-700"
              >
                {products.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="grid grid-cols-6 gap-4 items-center border-b p-4 hover:bg-gray-50 transition duration-300 cursor-move"
                  >
                    <div className="col-span-1 flex items-center">
                      <span className="drag-handle mr-2 text-gray-400 cursor-move">
                        <i className="fas fa-grip-vertical"></i>
                      </span>
                      {product.SKU}
                    </div>
                    <div className="col-span-1">{product.name}</div>
                    <div className="col-span-1">
                      {product.Categories.map(category => category.name).join(', ')}
                    </div>
                    <div className="col-span-1">${product.price}</div>
                    <div className="col-span-2 flex justify-center space-x-4">
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
                    </div>
                    
                    {/* Referencia al último elemento para activar el scroll infinito */}
                    {index === products.length - 1 && (
                      <div ref={lastProductElementRef} className="col-span-6 text-center py-2">
                        {loading && 'Cargando...'}
                      </div>
                    )}
                  </div>
                ))}
              </ReactSortable>
            ) : (
              <div className="p-8 text-center text-gray-500 text-lg">
                Aún no hay elementos
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Instrucciones</h3>
          <p className="text-gray-600">
            Puedes arrastrar y soltar los productos para cambiar su orden. Simplemente haz clic y mantén presionado el ícono <i className="fas fa-grip-vertical"></i> junto al SKU, luego mueve el producto a la posición deseada.  
          </p>
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
