'use client'
import { Suspense, useEffect, useState } from "react";
import Filter from "../components/Filter";
import ProductList from "../components/ProductList";
import apiService from "../pages/api/products";
import Spinner from '../components/Spinner';

const ListPage = ({ searchParams }: { searchParams: any }) => {
  const categoryId = searchParams.categoryId; 
  const [products, setProducts] = useState([]);
  
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const currentPage = pageParam ? parseInt(pageParam) : 0;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await apiService.fetchProducts({ categoryId, searchParams });
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      <h1>{'All Products'}</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="hidden md:block md:w-1/4">
            <Filter />
        </div>
        <div className="w-full md:w-3/4">
          <Suspense fallback={<Spinner />}>
            <ProductList
              products={products}
              currentPage={currentPage}
              hasPrev={currentPage > 0}
              hasNext={products.length === 8}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
