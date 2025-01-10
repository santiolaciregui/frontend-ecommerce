'use client'
import React, { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";
import Loading from '../components/Loading';
import { Product } from "../context/types";
import { useEffect } from "react";
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
  // State to store temporary filter results before applying
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
  
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const currentPage = pageParam ? parseInt(pageParam) : 0;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const handleProductsFetched = (fetchedProducts: Product[]) => {
    setProducts(fetchedProducts);
    setLoading(false);
    // Close mobile filter after applying filters
    setIsMobileFilterOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setShowLoading(true);
      try {
        const fetchedProducts = await apiService.fetchProducts({ categoryId, subcategoryId, searchParams });
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Error fetching products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, searchParams]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Prevent body scroll when mobile filter is open
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

  if (showLoading) return <Loading />;

  return (
    <div className="mt-12 px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 relative">
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Mobile Filter Panel */}
      <MobileFilter
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        onProductsFetched={handleProductsFetched}
        setLoading={setLoading}
      />

      <div className="flex flex-col md:flex-row gap-4">
        {/* Desktop Filter */}
        <div className="hidden md:block md:w-1/4">
          <Filter onProductsFetched={handleProductsFetched} setLoading={setLoading} />
        </div>

        {/* Product List */}
        <div className="w-full md:w-3/4">
          {products.length > 0 ? (
            <ProductList
              products={products}
              currentPage={currentPage}
              hasPrev={currentPage > 0}
              hasNext={products.length === 9}
            />
          ) : (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">¡Estamos renovando nuestro catalogo de productos!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPage;