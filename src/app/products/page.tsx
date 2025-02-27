'use client'
import React, { useState, useEffect, useRef } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";
import Loading from '../components/Loading';
import { Product } from "../context/types";
import apiService from "../pages/api/products";

interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsFetched: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
}

const MobileFilter: React.FC<MobileFilterProps> = ({ 
  isOpen, 
  onClose, 
  onProductsFetched, 
  setLoading 
}) => {
  const [tempProducts, setTempProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleTempProductsFetched = (products: Product[]) => {
    setTempProducts(products);
    setIsFiltering(false);
  };

  const handleApplyChanges = () => {
    onProductsFetched(tempProducts);
  };

  return (
    <div className={`
      fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Filtros</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto pb-20">
          <Filter 
            onProductsFetched={handleTempProductsFetched} 
            setLoading={setIsFiltering}
          />
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={handleApplyChanges}
            disabled={isFiltering}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium
              disabled:bg-blue-300 disabled:cursor-not-allowed
              hover:bg-blue-700 transition-colors"
          >
            {isFiltering ? 'Aplicando filtros...' : 'Aplicar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ListPage = ({ searchParams }: { searchParams: any }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const categoryId = searchParams.categoryId; 
  const subcategoryId = searchParams.categoryId; 
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estados para infinite scrolling
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Cuando cambian los filtros o categorías, reseteamos la lista
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    const fetchInitialProducts = async () => {
      setLoading(true);
      try {
        const initialProducts = await apiService.fetchProducts({ 
          categoryId, 
          subcategoryId, 
          page: 0, 
          searchParams 
        });
        setProducts(initialProducts);
        if (initialProducts.length < 9) {
          setHasMore(false);
        }
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialProducts();
  }, [categoryId, subcategoryId, searchParams]);

  // Configuramos el IntersectionObserver para cargar más productos
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        const fetchMore = async () => {
          setLoading(true);
          try {
            const newProducts = await apiService.fetchProducts({ 
              categoryId, 
              subcategoryId, 
              page: nextPage, 
              searchParams 
            });
            setProducts(prev => [...prev, ...newProducts]);
            if (newProducts.length < 9) {
              setHasMore(false);
            }
          } catch (err) {
            setError('Error fetching products');
          } finally {
            setLoading(false);
          }
        };
        fetchMore();
      }
    }, { threshold: 1.0 });
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, page, hasMore, loading, categoryId, subcategoryId, searchParams]);

  // Callback para el filtro móvil: reemplaza la lista de productos
  const handleProductsFetched = (fetchedProducts: Product[]) => {
    setProducts(fetchedProducts);
    setPage(0);
    setHasMore(fetchedProducts.length === 9);
    setLoading(false);
    setIsMobileFilterOpen(false);
  };

  // Evitar scroll del body cuando el filtro móvil está abierto
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

  if (loading && products.length === 0) return <Loading />;

  return (
    <div className="mt-12 px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 relative">
      {/* Botón para filtro móvil */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Panel de filtro móvil */}
      <MobileFilter
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        onProductsFetched={handleProductsFetched}
        setLoading={setLoading}
      />

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filtro para escritorio */}
        <div className="hidden md:block md:w-1/4">
          <Filter onProductsFetched={handleProductsFetched} setLoading={setLoading} />
        </div>

        {/* Lista de productos */}
        <div className="w-full md:w-3/4">
          {products.length > 0 ? (
            <>
              <ProductList products={products} />
              {/* Div sentinel para detectar el scroll y cargar más */}
              <div ref={loadMoreRef} className="h-10"></div>
              {loading && <div className="text-center py-4">Cargando más productos...</div>}
            </>
          ) : (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">¡Estamos renovando nuestro catálogo de productos!</p>
            </div>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
};

export default ListPage;
