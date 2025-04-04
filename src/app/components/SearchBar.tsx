import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { Search } from 'lucide-react';
import { Product } from '../context/types';
import { getImageUrl } from '../utils/getImageURL';
import LoadingSearchBar from './LoadingSearchBar';

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;  

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setLoading(false);
  }, [query, API_URL]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const delayDebounceFn = setTimeout(() => {
        fetchResults();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query, fetchResults]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query && results.length > 0) {
      clearSearch();
    }
  };

  const handleProductClick = (productId: number) => {
    clearSearch();
    router.push(`/products/${productId}`);
  };
  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
        />
        <button 
          type="submit" 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${query.length > 2 && results.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={query.length > 2 && results.length === 0}
        >
          <Search className="h-5 w-5 text-green-600" />
        </button>
      </form>

      {query.length > 2 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-10">
          {loading ? (
            <div className="p-4">
              <div className="w-full flex items-center justify-center">
                <LoadingSearchBar />
              </div>
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 flex items-center"
                onClick={() => handleProductClick(product.id)}
                >
                <div className="w-16 h-16 mr-4 relative flex-shrink-0">
                  <Image
                    src={product.Images[0] ? getImageUrl(product.Images[0]?.url) : '/logo-verde-manzana.svg'}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  {product.finalPrice && (
                  <p className="text-sm text-gray-600">
                    ${product.finalPrice.toFixed(2)}
                    {product.finalPrice !== product.price && product.price && (
                      <span className="ml-2 line-through text-gray-400">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </p>
                )}

                  {/* {product.discount && (
                    <span className="text-xs font-semibold text-white bg-pink-500 px-2 py-1 rounded-full ml-2">
                      {product.discount}% Off
                    </span>
                  )} */}
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500">No se han encontrado resultados</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;