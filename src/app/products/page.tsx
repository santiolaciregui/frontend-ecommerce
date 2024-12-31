'use client'
import { useEffect, useState } from "react";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";
import apiService from "../pages/api/products";
import Loading from '../components/Loading';
import { Product } from "../context/types";

const ListPage = ({ searchParams }: { searchParams: any }) => {
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

  if (showLoading) return <Loading />;

  return (
    <div className="mt-12 px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32 relative">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="hidden md:block md:w-1/4">
          <Filter onProductsFetched={handleProductsFetched} setLoading={setLoading} />
        </div>
        <div className="w-full md:w-3/4">
          {products.length > 0 ? (
            <ProductList
              products={products}
              currentPage={currentPage}
              hasPrev={currentPage > 0}
              hasNext={products.length === 8}
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