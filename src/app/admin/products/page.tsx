'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiService from "../../pages/api/products";
import { Product } from '@/app/context/types';
import Link from 'next/link';
import BackButton from '@/app/components/BackButton';
import { ReactSortable } from 'react-sortablejs';
import Image from 'next/image';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { getImageUrl } from '@/app/utils/getImageURL';

const PAGE_SIZE = 12;
const formatPrice = (price: number) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
}).format(Number(price));

const AdminList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const hasDragged = useRef(false);

  // Función para obtener productos con paginación y filtrado de duplicados
  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    try {
      const newProducts: Product[] = await apiService.fetchProducts({ 
        categoryId: null,
        subcategoryId: null,
        limit: PAGE_SIZE,
        page: pageNumber,
        admin: true
      });
      
      // Si no se retornan productos, se asume que ya no hay más
      if (newProducts.length < PAGE_SIZE) {
        setHasMore(false);
      }
      if (newProducts.length > 0) {
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

  // Los productos con pedidos se retiran de la venta para conservar su historial.
  const handleDelete = async (product_id: number) => {
    const product = products.find(item => item.id === product_id);
    if (!window.confirm(`¿Eliminar "${product?.name || 'este producto'}"? Si tiene pedidos, se retirará de la venta y se conservará su historial.`)) return;
    try {
      setLoading(true);
      const result = await apiService.deleteProductByID({ id: product_id });
      if (result?.archived) {
        setProducts(prevProducts => prevProducts.map(product =>
          product.id === product_id ? { ...product, stock: 0 } : product
        ));
        setNotification('Producto retirado de la venta. Sus pedidos se conservan.');
      } else {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== product_id));
        setNotification('Producto eliminado con éxito');
      }
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
      setNotification((err as any)?.response?.data?.error || 'No se pudo eliminar el producto.');
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
    if (!isDragging && hasDragged.current) {
      hasDragged.current = false;
      handleDragEnd();
    }
  }, [isDragging]);

  return (
    <div className="min-h-screen bg-[#f7f9f7] px-4 py-8 text-[#26352d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BackButton destination="/admin" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#6a8173]">Catálogo</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Productos</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#66776c]">
              Gestioná los productos de la tienda. Los archivados se conservan para los pedidos anteriores.
            </p>
          </div>
          <Link
            href="/admin/products/create"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#285d43] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#204d37]"
          >
            <Plus size={18} aria-hidden="true" />
            Añadir producto
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e0e9e2] bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#e8eee9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-semibold">Listado de productos</h2>
              <p className="mt-0.5 text-sm text-[#718076]">Arrastrá el ícono junto a un producto para cambiar su orden.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-[#66776c]">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2f8055]" /> Activo</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#b47c27]" /> Archivado</span>
            </div>
          </div>

          <div className="hidden grid-cols-[minmax(0,2.5fr)_minmax(0,1.1fr)_110px_110px_118px_160px] gap-4 bg-[#f4f8f5] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#718076] lg:grid">
            <span>Producto</span><span>Categoría</span><span>Precio</span><span>Stock</span><span>Estado</span><span className="text-right">Acciones</span>
          </div>

          {products.length > 0 ? (
            <ReactSortable
              list={products as any[]}
              setList={setProducts}
              animation={200}
              delayOnTouchOnly={true}
              delay={2}
              handle=".drag-handle"
              onStart={() => { hasDragged.current = true; setIsDragging(true); }}
              onEnd={() => setIsDragging(false)}
            >
              {products.map((product) => {
                const archived = product.stock <= 0;
                const imageUrl = product.Images?.[0]?.url;
                return (
                  <div key={product.id} className={`grid gap-4 border-t border-[#edf1ed] px-5 py-4 transition-colors hover:bg-[#fafcfb] sm:px-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1.1fr)_110px_110px_118px_160px] lg:items-center ${archived ? 'bg-[#fcfcfa]' : ''}`}>
                    <div className="flex min-w-0 items-center gap-3">
                      <button type="button" className="drag-handle shrink-0 cursor-grab rounded-lg p-1.5 text-[#9aa99f] hover:bg-[#edf3ee] hover:text-[#285d43] active:cursor-grabbing" aria-label={`Cambiar orden de ${product.name}`}>
                        <GripVertical size={18} aria-hidden="true" />
                      </button>
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#e8eee9] bg-[#f6f8f6]">
                        <Image src={imageUrl ? getImageUrl(imageUrl) : '/logo-verde-manzana-gris.svg'} alt="" fill sizes="56px" className="object-contain p-1" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#26352d]" title={product.name}>{product.name}</p>
                        <p className="mt-1 text-xs text-[#819087]">SKU {product.SKU}</p>
                      </div>
                    </div>
                    <div className="min-w-0 text-sm text-[#5b6b61]"><span className="mr-2 text-xs text-[#8b9990] lg:hidden">Categoría</span>{product.Categories?.map(category => category.name).join(', ') || 'Sin categoría'}</div>
                    <div className="text-sm font-semibold tabular-nums"><span className="mr-2 text-xs font-normal text-[#8b9990] lg:hidden">Precio</span>{formatPrice(product.price)}</div>
                    <div className="text-sm tabular-nums text-[#5b6b61]"><span className="mr-2 text-xs text-[#8b9990] lg:hidden">Stock</span>{product.stock}</div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${archived ? 'bg-[#fff3df] text-[#8a5d17]' : 'bg-[#e7f4eb] text-[#286447]'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${archived ? 'bg-[#b47c27]' : 'bg-[#2f8055]'}`} />
                        {archived ? 'Archivado' : 'Activo'}
                      </span>
                      {archived && <p className="mt-1 text-[11px] text-[#8b9990]">Oculto en tienda</p>}
                    </div>
                    <div className="flex items-center gap-1 lg:justify-end">
                      <Link href={`/admin/products/update/${product.id}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#285d43] hover:bg-[#eaf3ec]" title="Editar producto">
                        <Pencil size={15} aria-hidden="true" /> Editar
                      </Link>
                      <button type="button" onClick={() => handleDelete(product.id)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#a34742] hover:bg-[#fff0ee]" title="Eliminar producto">
                        <Trash2 size={15} aria-hidden="true" /> Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </ReactSortable>
          ) : (
            <div className="px-6 py-16 text-center text-sm text-[#718076]">{loading ? 'Cargando productos...' : 'Todavía no hay productos.'}</div>
          )}
          <div ref={lastProductElementRef} className="h-2" aria-hidden="true" />
          {loading && products.length > 0 && <p className="px-6 py-4 text-center text-sm text-[#718076]">Cargando más productos...</p>}
        </div>
      </div>

      {notification && (
        <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-[#285d43] px-4 py-3 text-sm font-medium text-white shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default AdminList;
